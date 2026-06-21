function EvidenceMeter({ score = 0, label = "Evidence Meter" }) {
  const safeScore = Math.max(0, Math.min(100, score));

  let strength = "Weak";
  if (safeScore >= 85) strength = "Excellent";
  else if (safeScore >= 70) strength = "Strong";
  else if (safeScore >= 50) strength = "Moderate";

  return (
    <div className="evidence-meter">
      <div className="evidence-meter-header">
        <span>{label}</span>
        <strong>{safeScore}/100</strong>
      </div>

      <div className="evidence-bar">
        <div style={{ width: `${safeScore}%` }} />
      </div>

      <p>{strength} evidence</p>
    </div>
  );
}

export default EvidenceMeter;