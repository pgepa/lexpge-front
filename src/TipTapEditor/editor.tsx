import { useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { cn } from '@/lib/utils';
import { MenuBar } from './menu-bar';
import Image from '@tiptap/extension-image';
import ImageResize from "tiptap-extension-resize-image";
import Table from "@tiptap/extension-table";
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

import FontFamily from '@tiptap/extension-font-family';
import logo from '@/assets/logo.svg';

import Link from '@tiptap/extension-link';
import { FontSize } from './FontSize';

import './styles.css'


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


  
  
export const EditorTip = ({ value, onChange, className }: EditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes:{
                        class: 'list-disc pl-4'
                    }
                },
                orderedList: {
                    HTMLAttributes:{
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
        content: value || `    
        <p style="text-align: right; font-family: Calibri, sans-serif;">Ver no Diário Oficial</p>    
        <div style="text-align: center;">
        <img src="${logo}" alt="Logo" style="display: block; margin: 0 auto; width: 100px; height: 134px;" />
        <h5 style="font-family: Calibri, sans-serif; text-align: center">GOVERNO DO ESTADO DO PARÁ</h5>
        </div>
    
  `,
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

    

    return (
        <div className={cn(
            "bg-background border border-slate-300 rounded-2xl w-full flex flex-col",
            className
        )}>
            <MenuBar editor={editor}/>
            
            <div className='h-full [&>div]:h-full flex flex-col overflow-y-auto tiptap'>
        
                <EditorContent editor={editor} />          

            </div>
        </div>
    );
};
