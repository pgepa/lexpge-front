import { useState } from "react";
import { Scale, BookOpenText, List, Home, Menu, AreaChart, Users } from "lucide-react";
import { Separator } from "./ui/separator";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme/theme-toggle";
import { AccountMenu } from './account-menu';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={`border-b ${isMenuOpen ? "mb-40" : ""}`}> {/* Adiciona margem inferior quando o menu está aberto */}
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
          className={`flex-col lg:flex-row lg:flex items-start lg:items-center space-x-0 lg:space-x-6 lg:space-y-0 space-y-4 absolute lg:relative top-16 lg:top-0 left-0 w-full lg:w-auto lg:bg-transparent p-4 lg:p-0 z-10 lg:z-auto transition-all duration-300 ease-in-out ${
            isMenuOpen ? "flex" : "hidden"
          }`}
        >
          <NavLink to="/admin" onClick={closeMenu}>
            <Home className="h-4 w-4" />
            Início
          </NavLink>
          <NavLink to="/admin/atos/" onClick={closeMenu}>
            <BookOpenText className="h-4 w-4" />
            Atos Normativos
          </NavLink>
          <NavLink to="/admin/dashboard" onClick={closeMenu}>
            <AreaChart className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/usuario" onClick={closeMenu}>
            <Users className="h-4 w-4" />
            Usuários
          </NavLink>
          <NavLink to="/admin/sobre" onClick={closeMenu}>
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
