import { Editor } from "@tiptap/core";
import { useRef } from "react";
import {
    Italic,
    Bold,
    ListOrdered,
    List,
    Strikethrough,
    Underline,
    AlignLeft,
    AlignJustify,
    AlignCenter,
    AlignRight,
    Image as ImageIcon,
    Heading5,
    Highlighter,
    Table,
    Grid2x2X,
    Link,
    AArrowUp,
    AArrowDown,
    Undo2Icon,
    Redo2Icon,
    RemoveFormattingIcon,

} from "lucide-react";
import { TbColumnRemove, TbColumnInsertRight } from "react-icons/tb";
import { AiOutlineDeleteRow, AiOutlineInsertRowAbove, AiOutlineInsertRowBelow } from "react-icons/ai";
import { BsBorder, BsBorderOuter } from "react-icons/bs";
import { LuTableCellsMerge, LuTableCellsSplit } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

type MenuBarProps = {
    editor: Editor | null;

};


export const MenuBar = ({ editor }: MenuBarProps) => {
    if (!editor) return null;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };


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
            label: "Remover Formatação",
            icon: RemoveFormattingIcon,
            action: () => editor.chain().focus().unsetAllMarks().run(),
            active: editor.isActive("orderedList"),
        },
        
        {
            label: "Aumentar Fonte 12pt",
            icon: AArrowUp,
            action: () => editor.chain().focus().setFontSize('16px').run(), // Ajuste para o tamanho desejado
            active: false,
        },
        {
            label: "Diminuir Fonte 10pt",
            icon: AArrowDown,
            action: () => editor.chain().focus().setFontSize('12px').run(), // Ajuste para o tamanho desejado
            active: false,
        },
        {
            label: "Desfazer",
            icon: Undo2Icon,
            action: () => editor.chain().focus().undo().run(), // Ajuste para o tamanho desejado
            active: false,
            disabled: !editor.can().undo(),
        },
        {
            label: "Refazer",
            icon: Redo2Icon,
            action: () => editor.chain().focus().redo().run(), // Ajuste para o tamanho desejado
            active: false,
            disabled: !editor.can().redo(),
        },
        {
            label: "Lista",
            icon: List,
            action: () => editor.chain().focus().toggleBulletList().run(),
            active: editor.isActive("bulletList"),
        },
        
        {
            label: "Lista ordenada",
            icon: ListOrdered,
            action: () => editor.chain().focus().toggleOrderedList().run(),
            active: editor.isActive("orderedList"),
        },

        
        {
            label: "Alinhar Esquerda",
            icon: AlignLeft,
            action: () => editor.chain().focus().setTextAlign("left").run(),
            active: editor.isActive({ textAlign: "left" }),
        },
        {
            label: "Alinhar Centro",
            icon: AlignCenter,
            action: () => editor.chain().focus().setTextAlign("center").run(),
            active: editor.isActive({ textAlign: "center" }),
        },
        {
            label: "Alinhar Direita",
            icon: AlignRight,
            action: () => editor.chain().focus().setTextAlign("right").run(),
            active: editor.isActive({ textAlign: "right" }),
        },
        {
            label: "Alinhar Justificado",
            icon: AlignJustify,
            action: () => editor.chain().focus().setTextAlign("justify").run(),
            active: editor.isActive({ textAlign: "justify" }),
        },
        
        {
            label: "Cabeçalho 5",
            icon: Heading5,
            action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
            active: editor.isActive("heading", { level: 5 }),
        },
        {
            label: "Marcador",
            icon: Highlighter,
            action: () => editor.chain().focus().toggleHighlight().run(),
            active: editor.isActive("highlight"),
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

        {
            label: "Inserir Tabela",
            icon: Table,
            action: () => editor.chain().focus().insertTable({
                rows: 2,
                cols: 2,
                withHeaderRow: true,
            }).updateAttributes('table', {
                class: 'table-bordered',
            }).run()
        },
        {
            label: "Adicionar Linha Abaixo",
            icon: AiOutlineInsertRowBelow,
            action: () => editor.chain().focus().addRowAfter().run(),
            active: false,
        },
        {
            label: "Adicionar Linha Acima",
            icon: AiOutlineInsertRowAbove,
            action: () => editor.chain().focus().addRowBefore().run(),
            active: false,
        },
        {
            label: "Adicionar Coluna",
            icon: TbColumnInsertRight,
            action: () => editor.chain().focus().addColumnAfter().run(),
            active: false,
        },
        {
            label: "Mesclar Células",
            icon: LuTableCellsMerge,
            action: () => editor.chain().focus().mergeCells().run(),
            active: false,
        },
        {
            label: "Dividir Células",
            icon: LuTableCellsSplit,
            action: () => editor.chain().focus().splitCell().run(),
            active: false,
        },
        {
            label: "Excluir Linha",
            icon: AiOutlineDeleteRow,
            action: () => editor.chain().focus().deleteRow().run(),
            active: false,
        },
        {
            label: "Excluir Coluna",
            icon: TbColumnRemove,
            action: () => editor.chain().focus().deleteColumn().run(),
            active: false,
        },
        {
            label: "Excluir Tabela",
            icon: Grid2x2X,
            action: () => editor.chain().focus().deleteTable().run(),
            active: false,
        },
        
        {
            label: "Adicionar Borda à Tabela",
            icon: BsBorderOuter,
            action: () => {
                const currentAttributes = editor.getAttributes('table');
                editor.chain().focus().updateAttributes('table', {
                    ...currentAttributes,
                    class: `${currentAttributes.class || ''} table-bordered`.trim(),
                }).run();
            },
            active: editor.isActive('table', { class: 'table-bordered' }),
        },
        {
            label: "Remover Borda da Tabela",
            icon: BsBorder,
            action: () => {
                const currentAttributes = editor.getAttributes('table');
                editor.chain().focus().updateAttributes('table', {
                    ...currentAttributes,
                    border: 'none',
                    class: 'table-no-border'
                }).run();
            },
            active: editor.isActive('table', { class: 'table-no-border' }),
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
            {/* Botão de Upload de Imagem */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        className="p-2 h-max"
                        onClick={handleButtonClick}
                        type="button"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Upload de Imagem</TooltipContent>
            </Tooltip>

            <link
                href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap"
                rel="stylesheet" />
            <div className="control-group">
                <div className="button-group flex items-center">
                   
                    <Button
                        onClick={() => editor.chain().focus().setFontFamily('Calibri').run()}
                        className={editor.isActive('textStyle', { fontFamily: 'Calibri' }) ? 'is-active' : ''}
                        data-test-id="calibri"
                        type="button"
                        variant="ghost"
                    >
                        Calibri
                    </Button>

                    <Button type='button' variant="ghost" onClick={() => editor.chain().focus().unsetFontFamily().run()}
                        data-test-id="unsetFontFamily">
                        Reset font
                    </Button>
                </div>
            </div>
            
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
