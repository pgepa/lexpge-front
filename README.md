# LEXPGE - Frontend

Interface web moderna da Base de Atos Normativos da **Procuradoria-Geral do Estado do Pará (PGE-PA)**.

---

## 1. Visão Geral

O frontend do LEXPGE foi desenvolvido como uma Single Page Application (SPA) responsiva e de alta performance, proporcionando tanto aos cidadãos quanto aos operadores internos uma navegação rápida para consulta, visualização e gestão completa do acervo legal do Estado do Pará.

### Principais Recursos:
* **Pesquisa Pública de Atos**:
  * Filtros por ano, tipo do ato, situação (vigente/revogado), busca textual no conteúdo da norma e descritores.
  * Paginação dinâmica integrada ao Elasticsearch com ordenação por relevância ou data.
* **Visualização Completa de Atos**:
  * Exibição formatada do texto legal, marcação de alterações e revogações, textos compilados e visualização de observações.
* **Painel Administrativo Autenticado**:
  * Autenticação via JWT com controle de permissão por perfil de acesso.
  * Cadastro e edição rica de normas utilizando o editor **TipTap** (com suporte a formatação jurídica, inserção de tabelas e imagens).
  * Gestão de usuários do sistema (criação, edição e controle de status ativo/inativo).
  * Dashboard com métricas visuais e relatórios de acesso.
  * Trilha de auditoria completa com registro detalhado de todas as alterações.

---

## 2. Stack Tecnológica

* **Framework Principal**: React 18
* **Linguagem**: TypeScript
* **Ferramenta de Build**: Vite 5
* **Estilização**: Tailwind CSS com classes utilitárias
* **Componentes UI**: Radix UI / Shadcn UI
* **Ícones**: Lucide React
* **Editor de Texto Jurídico**: TipTap Editor 2.x
* **Gerenciamento de Estado de Busca e Autenticação**: React Context API
* **Requisições HTTP**: Axios e TanStack React Query
* **Formulários e Validação**: React Hook Form + Zod
* **Roteamento**: React Router DOM 6

---

## 3. Instalação e Execução Local

### 3.1. Pré-requisitos
* Node.js 18+ (recomendado LTS 20 ou 22)
* Gerenciador de pacotes `npm` ou `yarn`

### 3.2. Instalação das Dependências
```bash
git clone <repo_url>
cd lexpge-front

npm install
```

### 3.3. Configuração de Variáveis de Ambiente (`.env`)
Crie um arquivo `.env` na raiz de `lexpge-front`:

```env
# Endereço base da API backend do LEXPGE
VITE_API_URL=http://localhost:4000
```

> **Atenção**: Não inclua barra `/` no final da URL. Em produção, substitua pelo domínio ou IP do backend (ex: `https://lexpge-api.pge.pa.gov.br` ou `http://seu-servidor:4000`).

### 3.4. Iniciar em Modo de Desenvolvimento
```bash
npm run dev
```
O servidor de desenvolvimento iniciará em `http://localhost:5173`.

---

## 4. Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento Vite com Hot Module Replacement (HMR) |
| `npm run build` | Valida tipagens com TypeScript (`tsc -b`) e compila o bundle de produção em `dist/` |
| `npm run preview` | Executa um servidor local para inspecionar os arquivos da pasta `dist/` já compilados |
| `npm run lint` | Executa o ESLint para verificar qualidade e regras de código |

---

## 5. Estrutura do Projeto

```
lexpge-front/
├── public/                 # Favicon e assets públicos estáticos
├── src/
│   ├── api/                # Serviços de requisições à API (login, atos, usuários)
│   ├── assets/             # Imagens e logotipos institucionais (PGE-PA)
│   ├── components/         # Componentes reutilizáveis (formulários, filtros, modais, cards)
│   ├── Context/            # Contextos globais (AuthContext, SearchContext)
│   ├── Helpers/            # Utilitários e manipuladores de erros
│   ├── Model/              # Tipagens e interfaces TypeScript
│   ├── pages/              # Páginas e views do sistema (busca pública, login, admin, dashboard)
│   ├── TipTapEditor/       # Editor customizado para redação e compilação de atos normativos
│   ├── admin.routes.tsx    # Configuração de rotas autenticadas e controle de perfis
│   ├── app.tsx             # Componente raiz da aplicação
│   └── main.tsx            # Ponto de entrada da aplicação React
├── dist/                   # Artefato gerado pelo build de produção
├── index.html              # Template HTML principal
├── package.json            # Metadados e dependências do projeto
├── tailwind.config.js      # Configuração do Tailwind CSS
├── tsconfig.json           # Configuração do compilador TypeScript
└── vite.config.ts          # Configuração do Vite
```

---

## 6. Controle de Acesso e Perfis

O frontend adapta as interfaces e restringe rotas conforme o perfil retornado na autenticação:

* **Público Geral**: Acesso à busca de normas, leitura integral de atos e visualização de notas de compilação.
* **Administrador (Perfil 1)**: Acesso completo ao menu administrativo, gestão de usuários, dashboard analítico, trilha de auditoria e edição/exclusão de atos.
* **Chefia (Perfil 2)**: Acesso ao dashboard analítico e consulta administrativa de atos.
* **Estagiário (Perfil 3)**: Acesso às telas de inclusão e edição de novos atos normativos.

---

## 7. Procedimento de Deploy em Servidor Web (Produção)

### 7.1. Compilação do Bundle Estático
No servidor de CI/CD ou máquina de build:
```bash
git pull origin homologation # ou main/master
npm install
npm run build
```
O build estático otimizado será gerado na pasta `dist/`.

### 7.2. Publicação no Servidor Apache (`/var/www/html`)
```bash
cd dist/
tar -zcvf lexpge-front.tar.gz *
sudo mv lexpge-front.tar.gz /var/www/html/
cd /var/www/html

# Limpar versão anterior preservando configurações
sudo rm -rf assets/ index.html

# Extrair nova versão
sudo tar -zxvf lexpge-front.tar.gz
sudo rm lexpge-front.tar.gz

# Ajustar permissões
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

### 7.3. Configuração de Fallback para SPA (Single Page Application)
Para que rotas internas do React Router (como `/admin`, `/login`, `/dashboard`) funcionem sem gerar erro 404 ao recarregar a página no navegador:

#### No Apache (`/var/www/html/.htaccess`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
Habilite o módulo rewrite caso necessário e reinicie:
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### No Nginx (bloco `location`):
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
