# LEXPGE 2.0

O lexpge é o frontend da Base de Atos Normativo da Procuradoria Geral do Estado do Pará, desenvolvido em React + Typescript.

## Instalação

Utilize o gerenciador de pacotes npm

```bash
npm install
```

## Configuração

1. É necessário criar um arquivo **.env** na raiz do projeto, para identificar o endereço do servidor de backend
   Servidor de desenvolvimento:
   
   ```bash
   VITE_API_URL=localhost:4000
   ```
3. Para iniciar a aplicação:

   ```bash
   npm run dev
   ```
4. UPDATE FRONT-END:
    ```bash  

    git pull
    npm run build
    cd dist/
    tar -zcvf lexpge.tar.gz *
    sudo mv lexpge.tar.gz /var/www/html/
    cd /var/www/html
    sudo rm -rf assets/
    sudo rm index.html
    sudo tar -zxvf lexpge.tar.gz
    sudo rm lexpge.tar.gz
    cd ..
    sudo chown root:root -R html/
    sudo service apache2 restart

    ```
