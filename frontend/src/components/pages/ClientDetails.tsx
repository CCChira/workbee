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
import QueryTable from '@/components/layout/table/QueryTable.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { PaginationSortingState } from '@/utils/types.ts';
import { TableCell } from '@/components/ui/table.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.tsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { TabsContent } from '@radix-ui/react-tabs';
import CreateContractForm from '@/components/forms/CreateContractForm.tsx';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast.ts';
import { useCreateContractFormStore } from '@/store/createContractFormStore.ts';
import CreateLocationForm from '@/components/forms/CreateLocationForm.tsx';
import CreateTaskTemplates from '@/components/forms/CreateTaskTemplates.tsx';
import createLocationForm from '@/components/forms/CreateLocationForm.tsx';
import { useCreateLocationMarkerStore } from '@/store/useCreateLocationMarkerStore.ts';

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
      return <TableCell key={`template${contract.id}`}>Task no.</TableCell>;
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

function ClientDetails() {
  const { clientId } = useParams();
  const { data: clientData } = useQuery<ClientData>('client', { queryFn: () => getClientDetails(clientId ?? '') });
  const [locationsEnabled, setLocationsEnabled] = useState(false);
  const [lockContractFields, setLockContractFields] = useState(false);
  const [lockLocationFields, setLockLocationFields] = useState(false);
  const [taskFields, setTaskFields] = useState(true);
  const [contractId, setContractId] = useState('');
  //const createContractFormStore = useCreateContractFormStore();
  const createContractFormStore = useCreateContractFormStore();
  const createLocationFormStore = useCreateLocationMarkerStore();
  const { toast } = useToast();
  const onContractCreationSuccess = (responseContractId: string) => {
    setLockContractFields(true);
    toast({
      title: 'Contract created',
      description: 'Contract was created successfully. You can now add locations to it.',
    });
    setContractId(responseContractId);
    setLocationsEnabled(true);
  };
  const onLocationCreationSuccess = () => {
    setLockLocationFields(true);
    toast({
      title: 'Locations added to contract',
      description:
        'Locations were created successfully and added to the contract. You may now create task templates for this contract.',
    });
    setTaskFields(false);
  };
  const onFormsHandle = () => {
    setLocationsEnabled(false);
    setLockContractFields(false);
    setTaskFields(false);
    createContractFormStore.setDescription('');
    createContractFormStore.setTitle('');
    createContractFormStore.setStartDate(new Date());
    createContractFormStore.setEndDate(new Date());
    createLocationFormStore.deleteMarkers();
  };
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
      <section className="flex flex-col gap-4 rounded-md w-full">
        {clientData && (
          <div className="border border-muted p-4 rounded-md">
            <h4 className="text-2xl mb-4">Contracts</h4>
            <div className="flex flex-col gap-4">
              <section>
                <Dialog>
                  <DialogTrigger>
                    <Button className="btn btn-primary w-fit">Add new contract</Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[calc(100vw-40px)] max-h-[900px]">
                    <Tabs defaultValue="createContract">
                      <TabsList>
                        <TabsTrigger value="createContract">Create Contract</TabsTrigger>
                        <TabsTrigger value="createLocationsForContract" disabled={!locationsEnabled}>
                          Create Locations
                        </TabsTrigger>
                        <TabsTrigger value="createTaskTemplates" disabled={taskFields}>
                          Create Templates
                        </TabsTrigger>
                      </TabsList>
                      <div className="mt-4 mx-2">
                        <TabsContent value="createContract">
                          <CreateContractForm onSuccess={onContractCreationSuccess} lockFields={lockContractFields} />
                        </TabsContent>
                        <TabsContent value="createLocationsForContract" className="min-w-[700px]">
                          <CreateLocationForm
                            onSuccess={onLocationCreationSuccess}
                            contractId={contractId}
                            lockFields={lockLocationFields}
                          />
                        </TabsContent>
                        <TabsContent value="createTaskTemplates" className="max-h-[600px] overflow-auto">
                          <CreateTaskTemplates onSuccess={onFormsHandle} contractId={contractId} />
                        </TabsContent>
                      </div>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </section>
              <Separator />
              <QueryTable
                queryFn={(pagSort: PaginationSortingState) => getClientContract(pagSort, clientData.id)}
                queryKey={'contracts'}
                columns={contractColumns}
                sortableColumns={{
                  title: true,
                  taskTemplates: false,
                }}
                searchField="title"
                maxResults={5}
                defaultSort="title"
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ClientDetails;
