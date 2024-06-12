import { useUserStore } from '@/store/user.ts';
import TasksAdmin from '@/components/pages/Tasks/TasksAdmin.tsx';
import { Roles } from '@/utils/types.ts';
import TasksClient from '@/components/pages/Tasks/TasksClient.tsx';

function Tasks() {
  const userStore = useUserStore();

  switch (userStore.user.role) {
    case 'ADMIN' as unknown as Roles.ADMIN:
      return <TasksAdmin />;
    case 'CLIENT' as unknown as Roles.CLIENT:
      return <TasksClient />;
  }
}

export default Tasks;
