import { User } from "lucide-react";
import { Button } from "./ui/button";
import { NavLink } from 'react-router-dom';


export function Login() {
    return (

        <NavLink to="/sign-in">

            <Button variant="outline" className="flex items-center gap-2 select-none bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500">
                <User className="h-4 w-4" />
                Entrar

            </Button>

        </NavLink>

    )
}