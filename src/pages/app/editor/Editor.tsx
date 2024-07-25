import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';

const Editor: React.FC<{ value?: string, onChange?: (value: string) => void }> = ({ value = '', onChange }) => {
  const editor = useRef(null);
  const [content, setContent] = useState(value);

  const config = {
    readonly: false, // All options from https://xdsoft.net/jodit/doc/
    height: 500,
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
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'symbol', 'fullsize', 'print', 'about'
    ],
    defaultFont: 'Calibri',
    style: {
      font: 'Calibri, sans-serif'
    },
    controls: {
      font: {
        list: {
          Calibri: 'Calibri, sans-serif',
          'Helvetica,Arial,sans-serif': 'Helvetica',
          'Georgia,serif': 'Georgia',
          'Impact,Charcoal,sans-serif': 'Impact',
          'Tahoma,Geneva,sans-serif': 'Tahoma',
          'Verdana,Geneva,sans-serif': 'Verdana'
        }
      },
      paragraph: {
        list: {
          p: 'Normal',
          h1: 'Cabeçalho 1',
          h2: 'Cabeçalho 2',
          h3: 'Cabeçalho 3',
          h4: 'Cabeçalho 4',
          h5: 'Cabeçalho 5',
          h6: 'Cabeçalho 6'
        }
      }
    }
  };

  const addTableStyles = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;

    const tables = div.getElementsByTagName('table');
    for (let table of tables) {
      table.style.borderCollapse = 'collapse';
      table.style.border = '2px solid rgb(140, 140, 140)';
      table.style.fontFamily = 'sans-serif';
      table.style.fontSize = '0.8rem';
      table.style.letterSpacing = '1px';

      const caption = table.querySelector('caption');
      if (caption) {
        caption.style.captionSide = 'bottom';
        caption.style.padding = '10px';
        caption.style.fontWeight = 'bold';
      }

      const thead = table.querySelector('thead');
      if (thead) {
        thead.style.backgroundColor = 'rgb(228, 240, 245)';
      }

      const tfoot = table.querySelector('tfoot');
      if (tfoot) {
        tfoot.style.backgroundColor = 'rgb(228, 240, 245)';
        const ths = tfoot.getElementsByTagName('th');
        for (let th of ths) {
          th.style.textAlign = 'right';
        }
        const tds = tfoot.getElementsByTagName('td');
        for (let td of tds) {
          td.style.fontWeight = 'bold';
        }
      }

      const ths = table.getElementsByTagName('th');
      for (let th of ths) {
        th.style.border = '1px solid rgb(160, 160, 160)';
        th.style.padding = '8px 10px';
      }

      const tds = table.getElementsByTagName('td');
      for (let td of tds) {
        td.style.border = '1px solid rgb(160, 160, 160)';
        td.style.padding = '8px 10px';
      }

      const lastTds = table.querySelectorAll('td:last-of-type');
      for (let lastTd of lastTds) {
        lastTd.style.textAlign = 'center';
      }
    }

    return div.innerHTML;
  };

  const handleContentChange = (newContent: string) => {
    const styledContent = addTableStyles(newContent);
    setContent(styledContent);
    if (onChange) {
      onChange(styledContent);
    }
  };

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      onBlur={handleContentChange} // preferred to use only this option to update the content for performance reasons
      onChange={() => {}}
    />
  );
};

export default Editor;