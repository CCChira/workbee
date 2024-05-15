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
import { useCallback, useEffect, useReducer } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Action, customPagSort, PaginationSortingState, QueryResponse } from '@/utils/types.ts';
import { useQuery } from 'react-query';
import { ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input.tsx';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form.tsx';
import { debounce } from 'lodash';
import { FormControl, FormField, FormItem } from '@/components/ui/form.tsx';
import { useNavigate } from 'react-router-dom';
import TableSkeleton from '@/components/layout/table/TableSkeleton.tsx';
interface QueryTableProps<TType, TValue> {
  queryFn: (pagSort: PaginationSortingState) => Promise<QueryResponse<TType>>;
  queryKey: string;
  columns: ColumnDef<TType, TValue>[];
  sortableColumns: Record<string, boolean>;
  searchField?: string;
  maxResults?: number;
  defaultSort?: string;
  pagCenter?: boolean;
  navigateTo?: string;
  navigateToState?: string;
  onRowHover?: (rowNo: string) => void;
  onRowExit?: (rowNo: string) => void;
}
function reducer(state: PaginationSortingState, action: Action): PaginationSortingState {
  switch (action.type) {
    case 'SET_SIZE':
      return { ...state, size: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_SORT_ORDER':
      return {
        ...state,
        sortOrder: {
          property: action.payload.property,
          direction: action.payload.direction,
        },
      };
    case 'SET_SEARCH':
      return {
        ...state,
        search: {
          field: action.payload.field,
          searchParam: action.payload.searchParam,
        },
      };
    default:
      throw new Error(`Unhandled action type`);
  }
}
function QueryTable<TType extends { id: string | number }, TValue>({
  queryFn,
  queryKey,
  columns,
  sortableColumns,
  searchField,
  maxResults = 10,
  defaultSort = 'name',
  pagCenter = false,
  navigateTo,
  navigateToState,
  onRowHover,
  onRowExit,
}: QueryTableProps<TType, TValue>) {
  const [pagSort, dispatch] = useReducer(reducer, customPagSort(maxResults, defaultSort));

  const { data, isLoading } = useQuery<QueryResponse<TType>, Error>(
    [queryKey, pagSort],
    () => {
      return queryFn(pagSort);
    },
    {
      onSuccess: (data) => console.log(data),
    },
  );

  const sortAppliedColumns = columns.map((column) => {
    return {
      ...column,
      header: () => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              sortableColumns[column.id as keyof typeof sortableColumns] &&
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
            {sortableColumns[column.id as keyof typeof sortableColumns] && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
    };
  }) as typeof columns;

  const table = useReactTable({
    data: !isLoading && data ? data.data : [],
    columns: sortAppliedColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  const form = useForm({
    defaultValues: {
      search: '',
    },
  });
  const changePage = (page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };
  // const onSearch = (data: { search: string }) => {
  //   if (searchField) dispatch({ type: 'SET_SEARCH', payload: { field: searchField, searchParam: data.search } });
  // };
  const navigate = useNavigate();
  const onSearch = useCallback(
    debounce((data: { search: string }) => {
      if (searchField) {
        dispatch({ type: 'SET_SEARCH', payload: { field: searchField, searchParam: data.search } });
      }
    }, 300),
    [],
  );
  return (
    <div className="w-full flex flex-col gap-4 justify-between">
      <div>
        <Form {...form}>
          <form onChange={form.handleSubmit(onSearch)}>
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={`Search by ${searchField}`} type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="rounded-md border">
        {!isLoading && data ? (
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
              {table.getRowModel()?.rows?.length ? (
                table.getRowModel()?.rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() =>
                      navigate(
                        `${navigateTo ? navigateTo + '/' : ''}${row.original.id}`,
                        navigateToState ? { state: row.original[navigateToState as keyof typeof row.original] } : {},
                      )
                    }
                    onMouseOver={() => (onRowHover ? onRowHover(row.id) : null)}
                    onMouseLeave={() => (onRowExit ? onRowExit(row.id) : null)}
                    data-state={row.getIsSelected() && 'selected'}
                  >
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
        ) : (
          <TableSkeleton columns={columns} pagSort={pagSort} />
        )}
      </div>
      <div className={`mt-5 ${pagCenter ? '' : 'self-end'}`}>
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
                  <Button onClick={() => changePage(pagSort.page)} variant="outline" className="bg-primary">
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
                  <Button onClick={() => changePage(pagSort.page)} variant="outline" className="bg-primary">
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
    </div>
  );
}

export default QueryTable;
