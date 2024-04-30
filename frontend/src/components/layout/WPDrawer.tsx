import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { useDrawerStore } from '@/store/drawer.ts';
import { Menu } from 'lucide-react';
import { paths } from '@/router/routes.tsx';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
interface DrawerTabProps {
  children: ReactNode;
}
function DrawerTab({ children }: DrawerTabProps) {
  return <li className="h-12 hover:bg-accent w-full list-none">{children}</li>;
}
export function WPDrawer() {
  const { toggleDrawer } = useDrawerStore();
  return (
    <Sheet>
      <SheetTrigger>
        <Menu onClick={toggleDrawer} />
      </SheetTrigger>
      <SheetContent side="left" className="w-60">
        <SheetHeader></SheetHeader>
        <div className="px-5 mt-10">
          {paths.map((path) => (
            <DrawerTab key={path}>
              <SheetClose asChild>
                <Link to={path as string} onClick={toggleDrawer}>
                  {path === '/' ? 'Home' : path.charAt(1).toUpperCase() + path.slice(2)}
                </Link>
              </SheetClose>
            </DrawerTab>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
