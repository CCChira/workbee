import { ModeToggle } from '@/components/mode-toggle.tsx';

import WorkbeeLogo from '@/assets/chira_logo.svg';
import routes from '@/router/routes.tsx';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipProvider } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
interface NavbarProps {}

function Navbar({}: NavbarProps) {
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                      <Link to={route.path}>{route.icon}</Link>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {route.path === '/' ? 'Home' : route.path.charAt(1).toUpperCase() + route.path.slice(2)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ),
        )}
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
    </nav>
  );
}

export default Navbar;
