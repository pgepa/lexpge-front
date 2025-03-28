import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';
import logo from '@/assets/logo.svg';

const Editor: React.FC<{ value?: string, onChange?: (value: string) => void }> = ({ value = '', onChange }) => {
    const editor = useRef(null);
    // Valor inicial do editor
    const defaultText = `    
      <p style="text-align: right; font-family: Calibri, sans-serif;">Ver no Diário Oficial</p>    
    <div style="text-align: center;">
      <img src="${logo}" alt="Logo" style="display: block; margin: 0 auto; width: 100px; height: 134px;" />
      <h5 style="font-family: Calibri, sans-serif;">GOVERNO DO ESTADO DO PARÁ</h5>
    </div>
    
  `;

    const [content, setContent] = useState(value || defaultText);

    const config = {
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        askBeforePasteHTML: false,
        defaultFontSizePoints: "pt",
        disablePlugins: "ai-assistant,focus",
        readonly: false, // All options from https://xdsoft.net/jodit/doc/
        defaultMode: 1,
        useSearch: false,
        toolbarInlineForSelection: true,
        showPlaceholder: false,
        height: 500,
        toolbarSticky: false,
        language: 'pt_br',
        uploader: {
            insertImageAsBase64URI: true, // Insert image as base64
        },
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'superscript', 'subscript', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'table', 'link', '|',
            'align', 'undo', 'redo', 'paste', '|',
            'hr', 'eraser', 'copyformat', '|',
            'symbol', 'fullsize', 'print',
        ],
        defaultFont: 'Calibri, sans-serif',
        style: {
            font: 'Calibri, sans-serif'
        },
        controls: {
            paragraph: {
                list: {
                    p: 'Normal',
                    h1: 'Cabeçalho 1',
                    h2: 'Cabeçalho 2',
                    h3: 'Cabeçalho 3',
                    h4: 'Cabeçalho 4',
                    h5: 'Cabeçalho 5'
                }
            },
            font: {
                list: {
                    Calibri: 'Calibri, sans-serif'
                },
            },
        }
    };

    const addTableClass = (html: string) => {
        const div = document.createElement('div');
        div.innerHTML = html;

        const tables = div.getElementsByTagName('table');
        for (let table of tables) {
            table.classList.add('jodit-table-style'); // Adiciona a classe CSS às tabelas
        }

        return div.innerHTML;
    };

    const handleContentChange = (newContent: string) => {
        const styledContent = addTableClass(newContent);
        setContent(styledContent);
        if (onChange) {
            onChange(styledContent);
        }
    };

    return (
        <>
            <style>{`
        .jodit-table-style {
          border-collapse: collapse;
          width: 100%;
        }
        .jodit-table-style th, .jodit-table-style td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        .jodit-table-style th {
          background-color: #f2f2f2;
          text-align: left;
        }
        .jodit-table-style caption {
          caption-side: bottom;
          padding: 10px;
          font-weight: bold;
        }
        a {
            color: #0563C1;
            text-decoration: underline;
        }
      `}</style>
            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                onBlur={handleContentChange} // preferred to use only this option to update the content for performance reasons
                onChange={() => { }}
            />
        </>
    );
};

export default Editor;
