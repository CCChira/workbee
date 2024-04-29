import { useParams } from 'react-router-dom';
import QueryTable from '@/components/layout/table/QueryTable.tsx';
import { getContractLocations } from '@/queries/contractDetails.ts';
import { ColumnDef } from '@tanstack/react-table';
import { LocationData } from '@/queries/clientDetails.ts';

interface ContractDetailsProps {}
const locationColumns: ColumnDef<LocationData>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: 'Address',
  },
];
function ContractDetails({}: ContractDetailsProps) {
  const { contractId } = useParams();

  return (
    <>
      {contractId && (
        <QueryTable
          queryFn={(pagSort) => getContractLocations(pagSort, contractId)}
          queryKey={`locationContract${contractId}`}
          columns={locationColumns}
          sortableColumns={{
            name: true,
            contractId: true,
          }}
          navigateTo="/locations"
          navigateToState="coords"
        />
      )}
    </>
  );
}

export default ContractDetails;
