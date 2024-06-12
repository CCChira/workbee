import { ModeToggle } from '@/components/mode-toggle.tsx';

import WorkbeeLogo from '@/assets/chira_logo.svg';
import routes from '@/router/routes.tsx';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipProvider } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { useSideBarStore } from '@/store/sidebar.ts';
import ClientRequests from '@/components/ClientRequests.tsx';
import { useFetchRequests } from '@/queries/requests.ts';
import { Button } from '@/components/ui/button.tsx';
import { MailQuestion } from 'lucide-react';
interface NavbarProps {}

function Navbar({}: NavbarProps) {
  const sidebar = useSideBarStore();
  const onClick = (alias: string) => {
    sidebar.changeIcon(alias);
  };
  const requestsData = useFetchRequests(1, 100);
  return (
    <nav className="flex flex-col justify-between items-center gap-4 px-2 sm:py-5 h-full">
      <div className="flex flex-col gap-4 items-center">
        <div className="bg-accent rounded-full p-0.5">
          <img src={WorkbeeLogo} alt="Workbee Logo" className="w-10 h-10" />
        </div>
        {routes.map(
          (route) =>
            route.icon && (
              <TooltipProvider key={route.path}>
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      onClick={() => {
                        onClick(route.alias);
                      }}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg  transition-colors  md:h-8 md:w-8 ${sidebar.active === route.alias ? 'bg-primary text-accent-foreground hover:bg-primary-foreground hover:text-accent' : 'bg-none text-muted-foreground hover:text-foreground'}`}
                    >
                      <Link to={route.path}>{route.icon}</Link>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">{route.alias}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ),
        )}
      </div>
      <div className="flex items-center flex-col gap-4">
        {!requestsData.isLoading && requestsData.data?.data ? (
          <ClientRequests requests={requestsData.data.data} />
        ) : (
          <Button variant="outline" size="icon">
            <MailQuestion />
          </Button>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
}

export default Navbar;
