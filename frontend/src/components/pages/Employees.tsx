import { getEmployees } from '@/queries/employees.ts';
import { User } from '@/utils/types.ts';
import QueryTable from '@/components/layout/table/QueryTable.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQueryClient } from 'react-query';
import { deleteMultipleUsers } from '@/queries/users.ts';

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="w-full bg-primary h-32 border border-primary-foreground"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onClick={(event) => {
          event.stopPropagation();
        }}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          return row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);

      return <div className="w-fit">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: 'taskInstances',
    accessorKey: 'taskInstances',
    header: 'Task Assigned',
    cell: ({ row }) => <div>{row.original._count.TaskAssignment}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                console.log('here');
                navigator.clipboard.writeText(payment.id);
              }}
            >
              View Employee
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete Employee</DropdownMenuItem>
            <DropdownMenuItem>Update Employee</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
const deleteUsers = (rows: Row<User>[]) => {
  const ids = rows.map((row) => row.original.id);
  return deleteMultipleUsers(ids);
};
function Employees() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation('deleteEmployees', {
    mutationFn: deleteUsers,
    onSuccess: () => {
      queryClient.invalidateQueries('employees');
      queryClient.refetchQueries('employees');
    },
  });
  return (
    <>
      <QueryTable
        columns={columns}
        queryFn={getEmployees}
        queryKey="employees"
        sortableColumns={{
          email: true,
          name: true,
          createdAt: true,
        }}
        searchField="name"
        showActionBtns
        selectedDeleteFn={(selectedRows) => mutate(selectedRows)}
      />
    </>
  );
}

export default Employees;
