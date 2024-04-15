import { ColumnDef, getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useEffect, useReducer } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Action, defaultPagSort, PaginationSortingState, QueryResponse, User } from '@/utils/types.ts';
import { useQuery } from 'react-query';
import { ArrowUpDown } from 'lucide-react';
interface QueryTableProps<TType, TValue> {
  queryFn: (pagSort: PaginationSortingState) => Promise<QueryResponse<TType>>;
  queryKey: string;
  columns: ColumnDef<TType, TValue>[];
  sortableColumns: Record<string, boolean>;
}
function reducer(state: PaginationSortingState, action: Action): PaginationSortingState {
  switch (action.type) {
    case 'SET_SIZE':
      return { ...state, size: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_SORT_ORDER':
      console.log(action.payload);
      return {
        ...state,
        sortOrder: {
          property: action.payload.property,
          direction: action.payload.direction,
        },
      };
    default:
      throw new Error(`Unhandled action type`);
  }
}
function QueryTable<TType, TValue>({ queryFn, queryKey, columns, sortableColumns }: QueryTableProps<TType, TValue>) {
  const [pagSort, dispatch] = useReducer(reducer, defaultPagSort);
  const { data, isLoading, error } = useQuery<QueryResponse<TType>, Error>([queryKey, pagSort], () => queryFn(pagSort));
  const tableData = !isLoading && data ? data.data : [];
  const sortAppliedColumns = columns.map((column) => {
    return {
      ...column,
      header:
        sortableColumns[column.id as keyof typeof sortableColumns] &&
        (() => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                dispatch({
                  type: 'SET_SORT_ORDER',
                  payload: {
                    property: column.id || '',
                    direction: pagSort.sortOrder.direction === 'asc' ? 'desc' : 'asc',
                  },
                })
              }
            >
              {column.header as string}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        }),
    };
  }) as typeof columns;

  const table = useReactTable({
    data: tableData,
    columns: sortAppliedColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  useEffect(() => {
    console.log(pagSort);
  }, [pagSort]);
  const changePage = (page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };
  return (
    <>
      <div className="rounded-md border">
        {!isLoading && data && (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="mt-5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => changePage(pagSort.page - 1)} variant="outline" />
            </PaginationItem>
            {pagSort.page >= 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {pagSort.page === 1 ? (
              <>
                <PaginationItem>
                  <Button onClick={() => changePage(pagSort.page)} variant="outline">
                    {pagSort.page}
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button onClick={() => changePage(pagSort.page + 1)} variant="outline">
                    {pagSort.page + 1}
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button onClick={() => changePage(pagSort.page + 2)} variant="outline">
                    {pagSort.page + 2}
                  </Button>
                </PaginationItem>
              </>
            ) : (
              <>
                <PaginationItem>
                  <Button onClick={() => changePage(pagSort.page - 1)} variant="outline">
                    {pagSort.page - 1}
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button onClick={() => changePage(pagSort.page)} variant="outline">
                    {pagSort.page}
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button onClick={() => changePage(pagSort.page + 2)} variant="outline">
                    {pagSort.page + 1}
                  </Button>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => changePage(pagSort.page + 1)} variant="outline" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

export default QueryTable;
