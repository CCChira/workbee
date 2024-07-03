import { getClients } from '@/queries/clients.ts';
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
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.tsx';
import UpdateUserForm from '@/components/forms/UpdateUserForm.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { format } from 'date-fns';
interface ClientsProps {}

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
      const newDate = new Date(row.original.createdAt);
      const date = format(newDate, 'MMMM do, yyyy');
      return <div className="px-5">{date}</div>;
    },
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
              View Client
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              Delete Client
            </DropdownMenuItem>
            <Dialog>
              <DialogTrigger
                onClick={(event) => event.stopPropagation()}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-primary-foreground"
              >
                Update Client
              </DialogTrigger>
              <DialogContent onClick={(event) => event.stopPropagation()}>
                <UpdateUserForm onSuccess={() => {}} id={row.original.id} />
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function Clients({}: ClientsProps) {
  return (
    <>
      <QueryTable
        columns={columns}
        queryFn={getClients}
        queryKey="clients"
        sortableColumns={{
          email: true,
          name: true,
          createdAt: true,
        }}
        searchField="email"
      />
    </>
  );
}

export default Clients;
