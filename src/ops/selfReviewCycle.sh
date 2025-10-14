#!/usr/bin/env bash
# Self-Review Cycle - P2 Automation
# Runs comprehensive system health check and generates report

set -e

TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
REPORT_DIR="/reports"
REPORT_FILE="$REPORT_DIR/self_review_$TIMESTAMP.json"

echo "🔍 Starting Self-Review Cycle at $TIMESTAMP"

# Create reports directory if it doesn't exist
mkdir -p "$REPORT_DIR"

# Initialize report
cat > "$REPORT_FILE" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "review_type": "automated_self_review",
  "checks": []
}
EOF

# Function to add check result to report
add_check() {
  local name=$1
  local status=$2
  local message=$3
  
  # Read current report
  local temp_file=$(mktemp)
  jq --arg name "$name" --arg status "$status" --arg msg "$message" \
    '.checks += [{"name": $name, "status": $status, "message": $msg}]' \
    "$REPORT_FILE" > "$temp_file"
  mv "$temp_file" "$REPORT_FILE"
}

# Check 1: Config file validity
echo "  Checking config file..."
if [ -f "./karolconfig.json" ]; then
  if jq empty ./karolconfig.json 2>/dev/null; then
    add_check "config_validity" "pass" "Config file is valid JSON"
  else
    add_check "config_validity" "fail" "Config file has invalid JSON"
  fi
else
  add_check "config_validity" "fail" "Config file not found"
fi

# Check 2: Backup directory
echo "  Checking backup system..."
if [ -d "/data/karol_backups" ]; then
  backup_count=$(ls -1 /data/karol_backups/*.tar.gz 2>/dev/null | wc -l || echo 0)
  if [ "$backup_count" -gt 0 ]; then
    add_check "backup_system" "pass" "Found $backup_count backup(s)"
  else
    add_check "backup_system" "warn" "Backup directory exists but no backups found"
  fi
else
  add_check "backup_system" "fail" "Backup directory not found"
fi

# Check 3: Disk space
echo "  Checking disk space..."
disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$disk_usage" -lt 80 ]; then
  add_check "disk_space" "pass" "Disk usage: ${disk_usage}%"
elif [ "$disk_usage" -lt 90 ]; then
  add_check "disk_space" "warn" "Disk usage: ${disk_usage}% - approaching limit"
else
  add_check "disk_space" "fail" "Disk usage: ${disk_usage}% - critical"
fi

# Check 4: Memory usage
echo "  Checking memory..."
if command -v free &> /dev/null; then
  mem_usage=$(free | grep Mem | awk '{print ($3/$2) * 100.0}' | cut -d'.' -f1)
  if [ "$mem_usage" -lt 85 ]; then
    add_check "memory_usage" "pass" "Memory usage: ${mem_usage}%"
  else
    add_check "memory_usage" "warn" "Memory usage: ${mem_usage}% - high"
  fi
else
  add_check "memory_usage" "skip" "Memory check not available"
fi

# Calculate overall status
echo "  Calculating overall status..."
fail_count=$(jq '[.checks[] | select(.status == "fail")] | length' "$REPORT_FILE")
warn_count=$(jq '[.checks[] | select(.status == "warn")] | length' "$REPORT_FILE")

if [ "$fail_count" -gt 0 ]; then
  overall_status="FAILED"
elif [ "$warn_count" -gt 0 ]; then
  overall_status="WARNING"
else
  overall_status="PASSED"
fi

# Update report with overall status
temp_file=$(mktemp)
jq --arg status "$overall_status" '.overall_status = $status' "$REPORT_FILE" > "$temp_file"
mv "$temp_file" "$REPORT_FILE"

echo "✅ Self-Review Complete: $overall_status"
echo "📄 Report saved to: $REPORT_FILE"

# Print summary
echo ""
echo "Summary:"
jq -r '.checks[] | "  \(.name): \(.status) - \(.message)"' "$REPORT_FILE"

exit 0
