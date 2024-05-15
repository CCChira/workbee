import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { MailQuestion } from 'lucide-react';
import { Request, useApproveRequest, useDenyRequest } from '@/queries/requests.ts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';

interface ClientRequestsProps {
  requests: Request[];
}

function ClientRequests({ requests }: ClientRequestsProps) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [unHandled, setUnhandled] = useState(
    requests.reduce((count, request) => {
      return request.status === 'PENDING' ? count + 1 : count;
    }, 0),
  );
  const approve = useApproveRequest();
  const deny = useDenyRequest();
  return (
    <>
      {
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <div className="w-4 h-4 items-center justify-center text-xs bg-primary rounded-full absolute -top-[12.5%] -right-[12.5%]">
                  {unHandled}
                </div>
                <MailQuestion className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </PopoverTrigger>
            <PopoverContent dir="right" className="w-fit" sideOffset={10} side="right" arrowPadding={5}>
              <div className="max-h-[300px] w-[500px] overflow-auto">
                {requests.map((req) => (
                  <Card
                    className={
                      req.status === 'CANCELLED'
                        ? 'bg-destructive opacity-60'
                        : req.status === 'VERIFIED'
                          ? 'bg-green-500 opacity-60'
                          : ''
                    }
                    key={req.id}
                  >
                    <CardHeader>
                      <CardTitle>
                        {req.type === 'TASK_SCHEDULE_CREATION' && <h4>Create new Task Schedule</h4>}
                      </CardTitle>
                      <CardDescription>Requested by {req.createdBy.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full flex justify-between items-center">
                        <Button
                          className="bg-destructive"
                          disabled={req.status !== 'PENDING'}
                          onClick={() => deny.mutate(req.id)}
                        >
                          Deny Request
                        </Button>
                        <Button
                          className="bg-green-500"
                          disabled={req.status !== 'PENDING'}
                          onClick={() => approve.mutate(req.id)}
                        >
                          Approve Request
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      }
    </>
  );
}

export default ClientRequests;
