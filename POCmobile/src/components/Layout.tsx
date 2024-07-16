import {Tabs, TabsList, TabsTrigger} from "./ui/tabs.tsx";
import routes from "../router/routes.tsx";
import {Link} from "react-router-dom";
import {ReactNode} from "react";
import {useUserStore} from "../store/userStore.ts";
interface LayoutProps {
  children: ReactNode;
}
export default function Layout({children}: LayoutProps) {
  const {user} = useUserStore();
  return <main className='h-[100dvh]'>
    <div className='h-full mb-24'>
      {children}
    </div>
    {
      user.id &&
        <Tabs className='fixed bottom-0 left-0 w-screen'>
            <TabsList className='w-full'>
              {routes.map(route => {
                return route.icon &&
                  <TabsTrigger key={route.path} value={route.path} className='w-1/2' asChild>
                    <Link to={route.path} className='w-1/2'>{route.icon}</Link>
                  </TabsTrigger>
                }
              )}
            </TabsList>
        </Tabs>
    }
  </main>

}
