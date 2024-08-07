import { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar.tsx';
import { useUserStore } from '@/store/user.ts';
import { Toaster } from '@/components/ui/toaster.tsx';
import MessageBar from '@/components/layout/messageBar/MessageBar.tsx';

interface LayoutProps {
  children: ReactNode;
}
function Layout({ children }: LayoutProps) {
  const { user } = useUserStore();
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {user.loggedIn && (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
          <Navbar />
        </aside>
      )}
      <main className={`${user.loggedIn ? 'ml-16' : ''} p-8 min-h-screen h-screen relative`}>{children}</main>
      <Toaster />
    </div>
  );
}

export default Layout;
