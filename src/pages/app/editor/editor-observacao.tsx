import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';

const EditorObservacao: React.FC<{ value?: string, onChange?: (value: string) => void }> = ({ value = '', onChange }) => {
  const editor = useRef(null);
  const [content, setContent] = useState(value);

  const config = {
    readonly: false, // All options from https://xdsoft.net/jodit/doc/
    height: 200,
    language: 'pt_br',
    uploader: {
      insertImageAsBase64URI: true, // Insert image as base64
    },
    buttons: [
      'link', '|',
    ],
    defaultFont: 'Calibri',
    style: {
      font: 'Calibri, sans-serif'
    },
    controls: {
      font: {
        list: {
          Calibri: 'Calibri, sans-serif'        }
      },
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

export default EditorObservacao;