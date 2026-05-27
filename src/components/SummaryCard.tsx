import type { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
}

export function SummaryCard({
  title,
  value,
  description,
  icon,
}: SummaryCardProps) {
  return (
    <div className="summary-card">
      <div className="summary-card-header">
        <div>
          <p className="summary-card-title">{title}</p>
          <h3>{value}</h3>
        </div>

        {icon && <div className="summary-card-icon">{icon}</div>}
      </div>

      {description && <p className="summary-card-description">{description}</p>}
    </div>
  );
}