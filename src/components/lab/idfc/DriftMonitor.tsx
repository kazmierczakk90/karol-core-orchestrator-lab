import { useEffect, useState } from 'react';
import { driftDetector, type DriftAlert } from '@/services/idfc/driftDetector';

export function DriftMonitor() {
  const [alerts, setAlerts] = useState<DriftAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const scan = async () => {
    setLoading(true);
    try { setAlerts(await driftDetector.scan()); } finally { setLoading(false); }
  };
  useEffect(() => { scan(); const t = setInterval(scan, 30000); return () => clearInterval(t); }, []);

  const sevColor: Record<DriftAlert['severity'], string> = {
    low: 'text-lab-muted',
    medium: 'text-lab-accent',
    high: 'text-destructive',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-lab-muted text-xs uppercase tracking-widest">{alerts.length} active alerts · auto-scan every 30s</div>
        <button onClick={scan} disabled={loading} className="px-3 py-1 text-xs text-lab-muted hover:text-lab-foreground tracking-widest uppercase">↻ Scan</button>
      </div>
      {alerts.length === 0 && <p className="text-lab-muted text-sm">No drift detected. System coherent.</p>}
      {alerts.map((a, i) => (
        <div key={i} className="border border-lab-border p-3 bg-lab-background/40">
          <div className={`text-xs uppercase tracking-widest ${sevColor[a.severity]}`}>{a.severity} · FUKO_{a.fuko_module}</div>
          <div className="text-lab-foreground text-sm mt-1">{a.reason}</div>
          <div className="text-lab-muted text-xs font-mono mt-1">{a.instance_id.slice(0,8)}</div>
        </div>
      ))}
    </div>
  );
}
