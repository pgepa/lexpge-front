import { User } from "lucide-react";
import { Button } from "./ui/button";
import { NavLink } from 'react-router-dom';


export function Login() {
    return (

        <NavLink to="/sign-in">

            <Button variant="outline" className="flex items-center gap-2 select-none">
                <User className="h-4 w-4" />
                Entrar

            </Button>

        </NavLink>

    )
}