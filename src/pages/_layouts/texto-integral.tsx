import { Outlet } from "react-router-dom"


export function TextoIntegralLayout() {
  return (
         

      <div className="flex flex-col items-center justify-center relative">
        <Outlet />
      </div>
    
  )
}