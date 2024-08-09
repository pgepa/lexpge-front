import { Scale, BookOpenText, List, Home} from "lucide-react"
import { Separator} from './ui/separator'
import { NavLink } from "./nav-link"
import { ThemeToggle } from "./theme/theme-toggle"
import { Login } from './login'


export function HeaderPublic() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">

        <Scale className="h-6 w-6" />
        <span className="font-semibold">LEXPGE</span>
        
        <Separator orientation="vertical" className="h-6"/>

        <nav className="flex items-center space-x-4 lg:space-x-6">

        <NavLink to="/">
          <Home className="h-4 w-4" />
            Início
          </NavLink>

          <NavLink to="/atos">
          <BookOpenText className="h-4 w-4" />
            Atos Normativos
          </NavLink>         

          <NavLink to="/sobre">
            <List className="h-4 w-4"/>            
            Sobre 
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Login/>
        </div>
      </div>

    </div>
  )
}