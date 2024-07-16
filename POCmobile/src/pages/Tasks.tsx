import {useTaskInstancesToday} from "../queries.ts";
import {useEffect} from "react";
import {useUserStore} from "../store/userStore.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card.tsx";
import {Badge} from "../components/ui/badge.tsx";
import {Separator} from "../components/ui/separator.tsx";
import {Button} from "../components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
const colors = {
  PENDING: 'bg-secondary text-black',
  IN_PROGRESS: 'bg-primary',
  REDO: 'bg-destructive',
  COMPLETED: 'bg-green-500 text-white',
  INCOMPLETE: 'bg-destructive',
  UNASSIGNED: 'bg-muted-foreground',
};
const hovers = {
  PENDING: 'hover:bg-secondary text-black',
  IN_PROGRESS: 'hover:bg-primary hover:text-white',
  REDO: 'hover:bg-destructive',
  COMPLETED: 'hover:bg-green-500',
  INCOMPLETE: 'hover:bg-destructive',
  UNASSIGNED: 'hover:bg-muted-foreground hover:text-white',
};
export const taskStatusCell = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  REDO: 'Redo',
  COMPLETED: 'Completed',
  INCOMPLETE: 'Incomplete',
  UNASSIGNED: 'Unassigned',
};
export default function Tasks() {
  const user = useUserStore();
  const {data, isLoading} = useTaskInstancesToday(user.user.id)
  const navigate = useNavigate();
  useEffect(() => {
    console.log(data)
  }, [data]);
  return <div className='flex flex-col gap-4'>  {
    data && !isLoading && data.map(taskInstance =>
      <Card className={taskInstance.status !== 'IN_PROGRESS' && taskInstance.status !== 'REDO' ? 'opacity-50 bg-muted-foreground' : ''} onClick={(event) =>
        navigate('task-details', {
          state: {
            taskInstance: taskInstance,
          }
        })
      }>
        <CardHeader>
          <CardTitle className='flex justify-start'>{taskInstance.taskSchedule.taskTemplate.title} </CardTitle>
          <CardDescription className='flex'><Badge className={`w-fit ${colors[taskInstance.status]}`}>{taskStatusCell[taskInstance.status]}</Badge></CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <ul className='text-left'>
              <li>
                <span className='font-medium'>Location:</span> {taskInstance.room.location.name}
              </li>
              <li>
                <span className='font-medium'>Room:</span> {taskInstance.room.name}
              </li>
              <li>
                <span className='font-medium'>Hour:</span> {taskInstance.hour}
              </li>
              <li>
                <span className='font-medium'>Access:</span> {taskInstance.room.accessMode}
              </li>
            </ul>
          </div>
          <div className='flex gap-2 w-full items-center justify-center'>
            <Button className='w-1/2 bg-green-500' disabled={taskInstance.status !== 'IN_PROGRESS'}>Done</Button>
            <Button className='w-1/2 bg-destructive' disabled={taskInstance.status !== 'IN_PROGRESS'}>Refuse</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  </div>
}
