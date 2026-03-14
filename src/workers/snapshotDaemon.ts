/**
 * Snapshot Daemon - P0 Component
 * Automated backup system for critical system state
 */
// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface SnapshotConfig {
  interval_minutes: number;
  backup_path: string;
  retain_last: number;
}

// Default configuration
const config: SnapshotConfig = {
  interval_minutes: 10,
  backup_path: '/data/karol_backups/',
  retain_last: 72
};

function ensureBackupDirectory(): void {
  if (!fs.existsSync(config.backup_path)) {
    fs.mkdirSync(config.backup_path, { recursive: true });
    console.log(`[SnapshotDaemon] Created backup directory: ${config.backup_path}`);
  }
}

async function createSnapshot(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const snapshotName = `karol_snapshot_${timestamp}.tar.gz`;
  const tempDir = path.join('/tmp', `karol_snapshot_${timestamp}`);
  
  console.log(`[SnapshotDaemon] Creating snapshot: ${snapshotName}`);
  
  try {
    // Create temp directory
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Files to snapshot
    const filesToSnapshot = [
      'karolconfig.json',
      'package.json',
      'src/services/p0Initializer.ts'
    ];
    
    // Copy files
    for (const file of filesToSnapshot) {
      if (fs.existsSync(file)) {
        const destPath = path.join(tempDir, path.basename(file));
        fs.copyFileSync(file, destPath);
        console.log(`[SnapshotDaemon]   Copied: ${file}`);
      }
    }
    
    // Create metadata
    const metadata = {
      timestamp: new Date().toISOString(),
      files: filesToSnapshot.filter(f => fs.existsSync(f)),
      system: {
        node_version: process.version,
        platform: process.platform
      }
    };
    fs.writeFileSync(
      path.join(tempDir, 'snapshot_metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    // Create tar.gz
    const snapshotPath = path.join(config.backup_path, snapshotName);
    execSync(`tar -czf ${snapshotPath} -C ${tempDir} .`);
    
    // Cleanup temp directory
    execSync(`rm -rf ${tempDir}`);
    
    console.log(`[SnapshotDaemon] ✅ Snapshot created: ${snapshotPath}`);
    return snapshotPath;
    
  } catch (error) {
    console.error('[SnapshotDaemon] ❌ Snapshot creation failed:', error);
    throw error;
  }
}

function pruneOldSnapshots(): void {
  try {
    const files = fs.readdirSync(config.backup_path)
      .filter(name => name.endsWith('.tar.gz'))
      .map(name => ({
        name,
        path: path.join(config.backup_path, name),
        time: fs.statSync(path.join(config.backup_path, name)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);
    
    const toDelete = files.slice(config.retain_last);
    
    if (toDelete.length > 0) {
      console.log(`[SnapshotDaemon] Pruning ${toDelete.length} old snapshot(s)`);
      for (const file of toDelete) {
        try {
          fs.unlinkSync(file.path);
          console.log(`[SnapshotDaemon]   Deleted: ${file.name}`);
        } catch (error) {
          console.warn(`[SnapshotDaemon]   Failed to delete ${file.name}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('[SnapshotDaemon] ❌ Pruning failed:', error);
  }
}

async function snapshotCycle(): Promise<void> {
  try {
    await createSnapshot();
    pruneOldSnapshots();
  } catch (error) {
    console.error('[SnapshotDaemon] Snapshot cycle failed:', error);
  }
}

// Initialize and start daemon
export function startSnapshotDaemon(): void {
  console.log('[SnapshotDaemon] Starting...');
  console.log(`[SnapshotDaemon] Interval: ${config.interval_minutes} minutes`);
  console.log(`[SnapshotDaemon] Backup path: ${config.backup_path}`);
  console.log(`[SnapshotDaemon] Retention: ${config.retain_last} snapshots`);
  
  ensureBackupDirectory();
  
  // Initial snapshot after 30 seconds
  setTimeout(() => {
    console.log('[SnapshotDaemon] Running initial snapshot...');
    snapshotCycle();
  }, 30000);
  
  // Periodic snapshots
  const intervalMs = config.interval_minutes * 60 * 1000;
  setInterval(() => {
    snapshotCycle();
  }, intervalMs);
  
  console.log('[SnapshotDaemon] ✅ Daemon started successfully');
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SnapshotDaemon] Received SIGTERM, performing final snapshot...');
  snapshotCycle().then(() => {
    console.log('[SnapshotDaemon] Shutdown complete');
    process.exit(0);
  });
});

// Run if executed directly
if (require.main === module) {
  startSnapshotDaemon();
}

export { createSnapshot, pruneOldSnapshots };
