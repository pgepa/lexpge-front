import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { cn } from '@/lib/utils';
import Image from '@tiptap/extension-image';
import ImageResize from "tiptap-extension-resize-image";
import Table from "@tiptap/extension-table";
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { useCallback } from 'react';
import FontFamily from '@tiptap/extension-font-family';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import { FontSize } from './FontSize';
import {
    Italic,
    Bold,
    Strikethrough,
    UnderlineIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    Link2OffIcon,


} from "lucide-react";

import './styles.css'
import { MenuBarObservacao } from './menuObservacao';


type EditorProps = {
    value: string;
    onChange?: (value: string) => void;
    className?: string;
};


const TableWithClasses = Table.extend({
    addAttributes() {
        return {
            alignment: {
                default: null,
                parseHTML: (element) => {
                    const classList = element.classList;
                    if (classList.contains('table-align-left')) return 'left';
                    if (classList.contains('table-align-center')) return 'center';
                    if (classList.contains('table-align-right')) return 'right';
                    return null;
                },
                renderHTML: (attributes) => {
                    const alignmentClass: Record<string, string> = {
                        left: 'table-align-left',
                        center: 'table-align-center',
                        right: 'table-align-right',
                    };
                    return {
                        class: alignmentClass[attributes.alignment] || '',
                    };
                },
            },
            border: {
                default: 'bordered',
                parseHTML: (element) => {
                    if (element.classList.contains('table-no-border')) return 'none';
                    return 'bordered';
                },
                renderHTML: (attributes) => {
                    return {
                        class: attributes.border === 'none' ? 'table-no-border' : 'table-bordered',
                    };
                },
            },
        };
    },
});




export const EditorTipObservacao = ({ value, onChange, className }: EditorProps) => {
    const editor = useEditor({
        editable: true,
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc pl-4'
                    }
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal pl-4'
                    }
                },

                history: {
                    depth: 100,
                    newGroupDelay: 500,
                }

            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                protocols: ['http', 'https'],
                isAllowedUri: (url, ctx) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

                        // use default validation
                        if (!ctx.defaultValidate(parsedUrl.href)) {
                            return false
                        }

                        // disallowed protocols
                        const disallowedProtocols = ['ftp', 'file', 'mailto']
                        const protocol = parsedUrl.protocol.replace(':', '')

                        if (disallowedProtocols.includes(protocol)) {
                            return false
                        }

                        // only allow protocols specified in ctx.protocols
                        const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

                        if (!allowedProtocols.includes(protocol)) {
                            return false
                        }

                        // disallowed domains
                        const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
                        const domain = parsedUrl.hostname

                        if (disallowedDomains.includes(domain)) {
                            return false
                        }

                        // all checks have passed
                        return true
                    } catch (error) {
                        return false
                    }
                },
                shouldAutoLink: url => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

                        // only auto-link if the domain is not in the disallowed list
                        const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                        const domain = parsedUrl.hostname

                        return !disallowedDomains.includes(domain)
                    } catch (error) {
                        return false
                    }
                },

            }),
            Color,
            Subscript,
            Superscript,
            FontFamily,
            TextStyle.configure({}),
            Underline,
            ImageResize,
            FontSize,
            TableRow,
            TableHeader,
            TableCell,
            TableWithClasses.configure({ resizable: true }),


            Highlight.configure({
                HTMLAttributes: {
                    class: 'my-custom-class',
                },
            }),

            TextAlign.configure({
                types: ["heading", "paragraph", "table"]
            }),
            Image.configure({
                allowBase64: true,
            }),




        ],
        content: value,
        onCreate: ({ editor }) => {
            onChange?.(editor.getHTML());

        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());


        },

        autofocus: false,

        editorProps: {
            attributes: {
                class: 'focus:outline-none h-full p-4'

            }
        }

    });

    const setLink = useCallback(() => {
        if (!editor) return; // Certifique-se de que o editor não é nulo antes de usar
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);


        // cancelled
        if (url === null) {
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);





    return (
        <div className={cn(
            "bg-background border border-slate-300 rounded-2xl w-full flex flex-col",
            className
        )}>
            <MenuBarObservacao editor={editor} />


            <EditorContent className='h-full [&>div]:h-full flex flex-col overflow-y-auto tiptap' editor={editor} />

            {editor && (
                <BubbleMenu className='bg-white shadow-xl border border-gray-300 shadow-gray-300/50 overflow-hidden flex divide-x divide-gray-200 rounded-md'
                    editor={editor}
                >

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn(
                            "p-2 text-gray-700 text-sm flex items-center gap-1.5 font-medium leading-none",
                            editor.isActive('bold') ? 'bg-gray-200 font-bold text-violet-600' : 'hover:bg-gray-100'
                        )}
                    >
                        <Bold className='w-4 h-4' />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn(
                            "p-2 text-gray-700 text-sm flex items-center gap-1.5 font-medium leading-none",
                            editor.isActive('italic') ? 'bg-gray-200 font-bold text-violet-600' : 'hover:bg-gray-100'
                        )}
                    >
                        <Italic className='w-4 h-4' />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={cn(
                            "p-2 text-gray-700 text-sm flex items-center gap-1.5 font-medium leading-none",
                            editor.isActive('underline') ? 'bg-gray-200 font-bold text-violet-600' : 'hover:bg-gray-100'
                        )}
                    >
                        <UnderlineIcon className='w-4 h-4' />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={cn(
                            "p-2 text-gray-700 text-sm flex items-center gap-1.5 font-medium leading-none",
                            editor.isActive('strike') ? 'bg-gray-200 font-bold text-violet-800' : 'hover:bg-gray-100'
                        )}
                    >
                        <Strikethrough className='w-4 h-4' />
                    </button>                    

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        className={cn(
                            "p-2 text-gray-700 text-sm flex items-center gap-1.5 font-medium leading-none",
                            editor.isActive({ textAlign: "left" }) ? 'bg-gray-200 font-bold text-violet-800' : 'hover:bg-gray-100'
                        )}
                    >
                        <AlignLeft className='w-4 h-4' />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        className={cn(
                            "p-2 text-gray-700 text-sm flex items-center gap-1.5 font-medium leading-none",
                            editor.isActive({ textAlign: "center" }) ? 'bg-gray-200 font-bold text-violet-800' : 'hover:bg-gray-100'
                        )}
                    >
                        <AlignCenter className='w-4 h-4' />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        className={cn(
                            "p-2 text-gray-700 text-sm flex items-center gap-1.5 font-medium leading-none",
                            editor.isActive({ textAlign: "right" }) ? 'bg-gray-200 font-bold text-violet-800' : 'hover:bg-gray-100'
                        )}
                    >
                        <AlignRight className='w-4 h-4' />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                        className={cn(
                            "p-2 text-gray-700 text-sm flex items-center gap-1.5 font-medium leading-none",
                            editor.isActive({ textAlign: "justify" }) ? 'bg-gray-200 font-bold text-violet-800' : 'hover:bg-gray-100'
                        )}
                    >
                        <AlignJustify className='w-4 h-4' />
                    </button>
                    
                    

                    <button
                        type='button'
                        onClick={setLink}
                        className={cn(
                            "p-2 text-gray-700 text-sm flex items-center gap-1.5 font-medium leading-none",
                            editor.isActive("link") ? 'bg-gray-200 font-bold text-violet-800' : 'hover:bg-gray-100'
                        )}
                    >
                        <LinkIcon className='w-4 h-4' />
                    </button>

                    <button
                        type='button'
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        className={cn(
                            "p-2 text-gray-700 text-sm flex items-center gap-1.5 font-medium leading-none hover:bg-gray-100",
                            
                          )}
                          disabled={!editor?.isActive('link')} // Desativa o botão se o link não estiver ativo
                        >
                        <Link2OffIcon className='w-4 h-4' />
                    </button>


                    
                    




                </BubbleMenu>
            )}




        </div>
    );
};
