import { useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Document from '@tiptap/extension-document';
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
import Dropcursor from '@tiptap/extension-dropcursor';
import FontFamily from '@tiptap/extension-font-family';
import Link from '@tiptap/extension-link';
import './styles.css'


type EditorProps = {
    value: string;
    onChange?: (value: string) => void;
    className?: string;
};

const CustomImage = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        align: {
          default: null,
          parseHTML: (element) => element.style.float || null,
          renderHTML: (attributes) => {
            if (!attributes.align) return {};
            return {
              style: `float: ${attributes.align};`,
            };
          },
        },
        width: {
          default: "auto",
          parseHTML: (element) => element.style.width || "auto",
          renderHTML: (attributes) => {
            if (!attributes.width) return {};
            return {
              style: `width: ${attributes.width};`,
            };
          },
        },
      };
    },
  });

  

  const TableWithClasses = Table.extend({
    addAttributes() {
      return {
        alignment: {
          default: null,
          parseHTML: (element) => {
            if (element.classList.contains('table-align-left')) return 'left';
            if (element.classList.contains('table-align-center')) return 'center';
            if (element.classList.contains('table-align-right')) return 'right';
            return null;
          },
          renderHTML: (attributes) => {
            const alignmentClass: Record<string, string> = {
              left: 'table-align-left',
              center: 'table-align-center',
              right: 'table-align-right',
            };
            return attributes.alignment ? { class: alignmentClass[attributes.alignment] } : {};
          },
        },
        borderColor: {
          default: null,
          parseHTML: (element) => {
            if (element.classList.contains('table-border-red')) return 'red';
            if (element.classList.contains('table-border-blue')) return 'blue';
            if (element.classList.contains('table-border-green')) return 'green';
            return null;
          },
          renderHTML: (attributes) => {
            const borderColorClass: Record<string, string> = {
              red: 'table-border-red',
              blue: 'table-border-blue',
              green: 'table-border-green',
            };
            return attributes.borderColor ? { class: borderColorClass[attributes.borderColor] } : {};
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
            TextStyle,
            Underline,
            Document,
            ImageResize,
            TableRow,
            TableHeader,
            TableCell,
            TableWithClasses.configure({ resizable: true }),
            Dropcursor.configure({
                color: '#3546e4',
              }),
              
            Highlight.configure({
                HTMLAttributes: {
                  class: 'my-custom-class',
                },
              }),

            TextAlign.configure({
                types: ["heading", "paragraph", "table"]
            }),
            CustomImage,
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'my-custom-class',
                  },
              }),
              
        ],
        content: value,
        onCreate: ({ editor }) => {
            onChange?.(editor.getHTML());
        }, 
        onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
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
