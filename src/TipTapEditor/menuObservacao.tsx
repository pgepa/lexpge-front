import { Editor } from "@tiptap/core";
import { useRef } from "react";
import {
    Italic,
    Bold,
    Strikethrough,
    Underline,
    Link,

} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

type MenuBarProps = {
    editor: Editor | null;

};


export const MenuBarObservacao = ({ editor }: MenuBarProps) => {
    if (!editor) return null;

    const fileInputRef = useRef<HTMLInputElement>(null);

   

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            console.log("Nenhum arquivo selecionado.");
            return;
        }
        console.log("Arquivo selecionado:", file);

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            console.log("Imagem convertida para base64:", base64);
            editor.chain().focus().setImage({ src: base64 }).run();
        };
        reader.onerror = (error) => console.error("Erro ao ler o arquivo:", error);
        reader.readAsDataURL(file);
    };
    



    const ACTIONS = [

        {
            label: "Negrito",
            icon: Bold,
            action: () => editor.chain().focus().toggleBold().run(),
            active: editor.isActive("bold"),
        },
        {
            label: "Itálico",
            icon: Italic,
            action: () => editor.chain().focus().toggleItalic().run(),
            active: editor.isActive("italic"),
        },
        {
            label: "Riscado",
            icon: Strikethrough,
            action: () => editor.chain().focus().toggleStrike().run(),
            active: editor.isActive("strike"),
        },
        {
            label: "Sublinhado",
            icon: Underline,
            action: () => editor.chain().focus().toggleUnderline().run(),
            active: editor.isActive("underline"),
        },       
      
        
        {
            label: "Link",
            icon: Link,
            action: () => {
                if (editor.isActive('link')) {
                    // Se o link já estiver ativo, remove o link
                    editor.chain().focus().unsetLink().run();
                } else {
                    // Se o link não estiver ativo, define um novo link
                    const url = prompt('Insira a URL'); // Solicita ao usuário a URL
                    if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                    }
                }
            },
            active: editor.isActive("link"),
        },

        


    ];


    return (
        <div className="flex items-center border-b p-2 flex-wrap">
            {ACTIONS.filter(Boolean).map((action) => (
                <Tooltip key={action.label}>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={action.action}
                            variant="ghost"
                            className={`p-2 h-max ${action.active ? "bg-gray-200" : ""
                                }`}
                            type="button"
                        >
                            <action.icon className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{action.label}</TooltipContent>
                </Tooltip>
            ))}
            

            
            
            {/* Input de Arquivo (escondido) */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
            />
            {/* Seção de controle de cor */}
            <div className="control-group">
                <div className="button-group flex items-center">
                    <input
                        type="color"
                        onInput={(event) => {
                            const target = event.target as HTMLInputElement; // Type assertion
                            editor.chain().focus().setColor(target.value).run();
                        }}
                        value={editor.getAttributes("textStyle").color}
                        data-testid="setColor"
                    />

                    <Button
                        onClick={() => editor.chain().focus().setColor("#FF0000").run()}
                        className={editor.isActive("textStyle p-2 h-max", { color: "#FF0000" }) ? "is-active" : ""}
                        data-testid="setRed"
                        type='button'
                        variant="ghost"
                    >
                        Red
                    </Button>


                    <Button
                        onClick={() => editor.chain().focus().setColor("#0563C1").run()}
                        className={editor.isActive("textStyle p-2 h-max", { color: "#0563C1" }) ? "is-active" : ""}
                        data-testid="setBlue"
                        type='button'
                        variant="ghost"
                    >
                        Blue
                    </Button>


                    <Button
                        onClick={() => editor.chain().focus().unsetColor().run()}
                        data-testid="unsetColor"
                        type='button'
                        variant="ghost"
                    >
                        Reset color
                    </Button>
                </div>
            </div>

            
        </div>
    );
};
