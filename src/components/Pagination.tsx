interface PaginationProps {
  pageNumber: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

export function Pagination({
  pageNumber,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        disabled={pageNumber === 1}
        onClick={() => onPageChange(pageNumber - 1)}
      >
        Previous
      </button>

      <span>
        Page {pageNumber} of {totalPages}
      </span>

      <button
        disabled={pageNumber === totalPages}
        onClick={() => onPageChange(pageNumber + 1)}
      >
        Next
      </button>
    </div>
  );
}