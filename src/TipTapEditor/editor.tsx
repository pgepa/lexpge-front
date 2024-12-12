import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight'
import Document from '@tiptap/extension-document'
import { cn } from '@/lib/utils';
import { MenuBar } from './menu-bar';
import Image from '@tiptap/extension-image';
import ImageResize from "tiptap-extension-resize-image";
import { Table } from "@tiptap/extension-table";
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row';
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

  const TableWithAttributes = Table.extend({
    addAttributes() {
      return {
        alignment: {
          default: null,
          parseHTML: element => element.style.textAlign || null,
          renderHTML: attributes => {
            if (!attributes.alignment) return {};
            return { style: `text-align: ${attributes.alignment}` };
          },
        },
        borderColor: {
          default: null,
          parseHTML: element => element.style.borderColor || null,
          renderHTML: attributes => {
            if (!attributes.borderColor) return {};
            return { style: `border-color: ${attributes.borderColor}` };
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
            Underline,
            Document,
            ImageResize,
              TableRow,
              TableHeader,
              TableCell,
              TableWithAttributes.configure({ resizable: true }),
              
            Highlight.configure({
                HTMLAttributes: {
                  class: 'my-custom-class',
                },
              }),

            TextAlign.configure({
                types: ["heading", "paragraph"]
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
