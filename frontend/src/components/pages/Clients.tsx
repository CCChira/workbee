import { getClients } from '@/queries/clients.ts';
import { User } from '@/utils/types.ts';
import QueryTable from '@/components/Layout/Table/QueryTable.tsx';
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
interface ClientsProps {}

const columns: ColumnDef<User>[] = [
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
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
