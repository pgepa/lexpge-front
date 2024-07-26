import React, { useState } from 'react';
import Editor from './Editor';

const EditorContainer: React.FC = () => {
  const [content, setContent] = useState('');

  const handleSave = () => {
    const data = {
      conteudo: content,
      numero: null,
      titulo: null,
      ementa: null,
      tipo_id: null,
      fonte: null,
      situacao: null,
      data_ato: null,
      data_publicacao: null,
      observacao: null,
      descritores: null
    };

    fetch('http://10.96.5.67:4000/atos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      alert('Conteúdo salvo com sucesso!');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Erro ao salvar o conteúdo.');
    });
  };

  return (
    <div>
      <Editor value={content} onChange={setContent} />
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
};

export default EditorContainer;
