import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnDef } from '@tanstack/react-table';
import { PaginationSortingState } from '@/utils/types.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';

interface TableSkeletonProps<TType, TValue> {
  columns: ColumnDef<TType, TValue>[];
  pagSort: PaginationSortingState;
}

function TableSkeleton<TType, TValue>({ columns, pagSort }: TableSkeletonProps<TType, TValue>) {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.id}>
              <Skeleton className="h-5 w-full" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: pagSort.size }, (_, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column.id}>
                <Skeleton className="h-5 w-full p-4" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TableSkeleton;
