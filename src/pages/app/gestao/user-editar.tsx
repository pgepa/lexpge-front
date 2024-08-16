import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


export function UserEditar() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Editar usuário</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuário</DialogTitle>
                    <DialogDescription>
                        Faça as alterações do usuário aqui. Clique em salvar quando terminar.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            defaultValue="Anderson Pontes"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            E-mail
                        </Label>
                        <Input
                            id="useremail"
                            defaultValue="anderson.pontes@email.com"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="id_perfil" className="text-right">Perfil:</Label>

                        <Select >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Escolha uma opção"  />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectItem value="1">Administrador</SelectItem>
                                <SelectItem value="2">Chefia</SelectItem>
                                <SelectItem value="3">Estagiário</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="senha" className="text-right">
                            Nova Senha
                        </Label>
                        <Input
                           id="senha" 
                           type="password"
                           className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

