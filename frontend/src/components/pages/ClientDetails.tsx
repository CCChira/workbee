import { useQuery } from 'react-query';
import {
  ClientData,
  ContractData,
  getClientContract,
  getClientDetails,
  getClientLocations,
  LocationData,
} from '@/queries/clientDetails.ts';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import QueryTable from '@/components/Layout/Table/QueryTable.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { PaginationSortingState } from '@/utils/types.ts';
import { TableCell } from '@/components/ui/table.tsx';

interface ClientDetailsProps {}
const contractColumns: ColumnDef<ContractData>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title',
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
  },
  {
    id: 'taskTemplates',
    accessorKey: 'taskTemplates',
    header: 'Task Templates',
    cell: ({ row }) => {
      const contract = row.original;
      return <TableCell key={`tempalte${contract.id}`}>Task no.</TableCell>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;

      return <div>{payment.id}</div>;
    },
  },
];
const locationColumns: ColumnDef<LocationData>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'contractId',
    accessorKey: 'contractId',
    header: 'Contract ID',
    cell: ({ row }) => {
      const contractId = row.original.contractId;
      return (
        <div key={`contractId${contractId}`} className="flex justify-center">
          {contractId}
        </div>
      );
    },
  },
];
function ClientDetails({}: ClientDetailsProps) {
  const { clientId } = useParams();
  const { data: clientData } = useQuery<ClientData>('client', { queryFn: () => getClientDetails(clientId ?? '') });

  return (
    <div className="flex gap-16 h-full">
      <section className="flex flex-col gap-16 flex-1">
        <section>
          <Card className="h-52 w-fit">
            <CardHeader>
              <CardTitle>Client {clientData?.name}</CardTitle>
              <CardDescription>
                Created at
                {clientData &&
                  ' ' +
                    new Date(clientData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-w-80">
                {clientData &&
                  Object.keys(clientData)
                    .filter((key) => !['id', 'role', 'password', 'updatedAt', 'createdAt'].includes(key))
                    .map((key) => (
                      <div key={key} className="flex gap-5 items-center justify-between my-2">
                        <span className="text-primary font-medium">{key}: </span>
                        <span className="text-muted-foreground ">{clientData[key as keyof ClientData]}</span>
                      </div>
                    ))}
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </section>
        <section>
          {clientData && (
            <div className="flex flex-col gap-4">
              <h4>{clientData.name}'s locations</h4>
              <QueryTable
                queryFn={(pagSort: PaginationSortingState) => getClientLocations(pagSort, clientData.id)}
                queryKey={'locationsClient'}
                columns={locationColumns}
                sortableColumns={{
                  name: true,
                  contractId: true,
                }}
                searchField="name"
                maxResults={5}
                defaultSort="name"
                pagCenter
                navigateTo="/locations"
                navigateToState="coords"
              />
            </div>
          )}
        </section>
      </section>
      <section className="flex flex-col gap-4 p-4 rounded-md w-full">
        {clientData && (
          <>
            <h4 className="text-2xl">Contracts for client {clientData.name}</h4>
            <QueryTable
              queryFn={(pagSort: PaginationSortingState) => getClientContract(pagSort, clientData.id)}
              queryKey={'contracts'}
              columns={contractColumns}
              sortableColumns={{
                title: true,
                description: true,
                taskTemplates: false,
              }}
              searchField="title"
              maxResults={5}
              defaultSort="title"
            />
          </>
        )}
      </section>
    </div>
  );
}

export default ClientDetails;
