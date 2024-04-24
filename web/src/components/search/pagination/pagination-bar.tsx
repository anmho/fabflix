import { NextURL } from "next/dist/server/web/next-url";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

interface PaginationBarProps {
  page: number;
  handlePageChange: (page: number) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function PaginationBar({
  page,
  handlePageChange,
  hasPrev,
  hasNext,
}: PaginationBarProps) {
  return (
    <Pagination className="bg-background text-foreground">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => hasPrev && handlePageChange(page - 1)}
          />
        </PaginationItem>
        {hasPrev && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(page - 1)}>
              {page - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive>{page}</PaginationLink>
        </PaginationItem>
        {hasNext && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => hasNext && handlePageChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
