interface ResultsSummaryProps {
  totalRecords: number;
  singularLabel: string;
  pluralLabel: string;
}

export function ResultsSummary({
  totalRecords,
  singularLabel,
  pluralLabel,
}: ResultsSummaryProps) {
  return (
    <div className="results-summary">
      <span>
        {totalRecords === 1
          ? `1 ${singularLabel} found`
          : `${totalRecords} ${pluralLabel} found`}
      </span>
    </div>
  );
}