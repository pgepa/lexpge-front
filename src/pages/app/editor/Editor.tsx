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

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
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