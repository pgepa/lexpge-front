import { useState } from "react";
import { Scale, BookOpenText, List, Home, Users, Menu } from "lucide-react";
import { Separator } from "./ui/separator";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme/theme-toggle";
import { AreaChart } from "lucide-react";
import { AccountMenu } from "./account-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 justify-between px-6">
        <div className="flex items-center gap-6">
          <Scale className="h-6 w-6" />
          <span className="font-semibold">LEXPGE</span>
          <Separator orientation="vertical" className="h-6 hidden lg:block" />
        </div>

        <button
          className="lg:hidden"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <nav
          className={`flex-col lg:flex-row lg:flex items-center space-x-0 lg:space-x-6 lg:space-y-0 space-y-4 absolute lg:relative top-16 lg:top-0 left-0 w-full lg:w-auto bg-white lg:bg-transparent p-4 lg:p-0 z-10 lg:z-auto ${
            isMenuOpen ? "flex" : "hidden"
          }`}
        >
          <NavLink to="/admin">
            <Home className="h-4 w-4" />
            Início
          </NavLink>
          <NavLink to="/admin/atos/">
            <BookOpenText className="h-4 w-4" />
            Atos Normativos
          </NavLink>
          <NavLink to="/admin/dashboard">
            <AreaChart className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/usuario">
            <Users className="h-4 w-4" />
            Usuários
          </NavLink>
          <NavLink to="/admin/sobre">
            <List className="h-4 w-4" />
            Sobre
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
