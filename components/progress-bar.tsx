export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label ? (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
          <span className="muted">{label}</span>
          <span>{safe}%</span>
        </div>
      ) : null}
      <div className="progress-track" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={safe} role="progressbar">
        <div className="progress-fill" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}
