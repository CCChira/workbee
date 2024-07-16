import {useLocation, useNavigate} from "react-router-dom";
import {TaskInstance} from "../queries.ts";
import {useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "../components/ui/card.tsx";
import {Carousel, CarouselContent, CarouselItem} from "../components/ui/carousel.tsx";
import {Button} from "../components/ui/button.tsx";
import {Separator} from "../components/ui/separator.tsx";

export default function TaskDetails() {
  const location = useLocation();
  const taskInstance = location.state.taskInstance as unknown as TaskInstance;
  useEffect(() => {
    console.log(taskInstance.room);
  }, [taskInstance]);
  return <Card>
      <CardHeader className='text-left'>
        <CardTitle className='flex justify-start'>{taskInstance.taskSchedule.taskTemplate.title} in {taskInstance.room.name}</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        {
          1 &&
          <Carousel>
              <CarouselContent>
                {
                 /* taskInstance.room.images.map*/Array.from({length: 5}).map(image =>
                    <CarouselItem key={image}>
                      <img src='https://www.decorilla.com/online-decorating/wp-content/uploads/2022/03/Modern-Office-Interior-with-Open-Floor-Plan-scaled.jpeg' alt="o poza"/>
                    </CarouselItem>
                  )
                }
              </CarouselContent>
          </Carousel>
        }
        <div className='text-left'>
          <ul>
            <li>
              <span className='font-medium'>Hour: </span>{taskInstance.hour}
            </li>
            <li>
              <span className='font-medium'>Address: </span>{taskInstance.room.location.name}
            </li>
            <li>
              <span className='font-medium'>Access Mode: </span>{taskInstance.room.accessMode}
            </li>
          </ul>
        </div>
        <Separator/>
        <div className='flex flex-col gap-2 items-center'>
          <div className='font-medium text-lg'>Update the status of the task</div>
          <Button className='w-full bg-green-500'>Complete Task</Button>
          <Button className='w-full bg-destructive'>Refuse Task</Button>
          <Button className='w-full bg-muted-foreground'>Mark Incomplete</Button>
        </div>
      </CardContent>
    </Card>
}
