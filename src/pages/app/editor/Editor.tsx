import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';

const Editor: React.FC<{ onSave: (content: string) => void }> = ({ onSave }) => {
  const editor = useRef(null);
  const [content, setContent] = useState(' ');

  const config = {
    readonly: false, // All options from https://xdsoft.net/jodit/doc/
    height: 500,
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
      }
    }
  };

  const handleSave = () => {
    onSave(content);
  };

  return (
    <div className="App">
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => {}}
      />
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
};

export default Editor;