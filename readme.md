# 📸 PhotosExpress

Hospedagem rápida de imagens com link direto para compartilhamento. Suba uma imagem e receba na hora um link público ou privado para compartilhar onde quiser.

## ✨ Funcionalidades

- Upload de imagens via clique ou arrastar e soltar
- Link direto e código HTML para incorporar
- Opção de link privado (não listado)
- Armazenamento em banco de dados Neon (PostgreSQL)
- Deploy serverless via Netlify Functions

## 🛠️ Tecnologias

- **Frontend:** HTML, Tailwind CSS
- **Backend:** Netlify Functions (Node.js)
- **Banco de dados:** Neon (PostgreSQL serverless)
- **Dependências:** `@neondatabase/serverless`, `nanoid`

## 🚀 Como fazer o deploy

### 1. Clone ou faça upload do projeto no Netlify

Conecte o repositório no painel do Netlify ou arraste a pasta do projeto.

### 2. Crie a tabela no Neon

No painel do **Neon → SQL Editor**, rode:

```sql
CREATE TABLE IF NOT EXISTS images (
  id         TEXT PRIMARY KEY,
  image_data TEXT NOT NULL,
  mime_type  TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Configure a variável de ambiente

No painel do Netlify vá em **Site configuration → Environment variables** e adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | Connection string do seu banco Neon |

> Se você conectou o Neon diretamente pelo painel do Netlify, essa variável já é criada automaticamente.

### 4. Faça o deploy

Após configurar a variável, acesse **Deploys → Trigger deploy → Deploy site**.

---

## 📁 Estrutura do projeto

```
PhotosExpress/
  functions/
    upload.js       # Recebe a imagem e salva no banco
    image.js        # Recupera e serve a imagem pelo ID
  public/
    index.html      # Interface do usuário
  netlify.toml      # Configuração do Netlify
  package.json      # Dependências do projeto
  README.md
```

## 🔒 Privacidade

Ao marcar a opção **Link Privado**, a imagem não aparece em nenhuma listagem pública. O acesso só é possível com o link gerado, que contém um ID único de 10 caracteres gerado pelo `nanoid`.

## 📄 Licença

MIT — use à vontade.
