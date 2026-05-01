# Landing Page Builder

Builder estatico em React para criar, editar, pre-visualizar e exportar landing pages.

## Uso

Abra o builder:

```txt
index.html
```

O editor abre direto na previa da landing page, com sidebar fixa para edicao por slots, edicao JSON, prompts de IA, upload de imagens e acoes de exportacao.

Para rodar em desenvolvimento:

```powershell
npm install
npm run dev
```

Para gerar a versao estatica do builder:

```powershell
npm run build
```

O Vite escreve o app em:

```txt
dist/
```

## Exportacao

No builder, clique em **Exportar** para baixar um ZIP pronto para hospedagem:

```txt
index.html
styles.css
assets/
```

Envie e extraia esses arquivos dentro do `public_html/` da Hostinger.

## Estrutura

```txt
temporary-workspace/
  index.html
  package.json
  public/
    assets/
      defaults/
        team/
  src/
    app/
    builder/
    design-system/
    domain/
    editor/
    lib/
    preview/
    sections/
  template/
    TEMPLATE_GUIDE.md
```

## JSON Do Projeto

O formato canonico usado pelo builder e:

```txt
site.meta
site.brand
site.footer
site.tracking
sections.<section>.content
sections.<section>.assets
```

As tags ficam centralizadas em `site.tracking`: pageview, clique no video, assistiu X segundos e clique em WhatsApp. A landing exportada so injeta GA4, Google Ads e Meta Pixel quando o provedor esta ativo e com ID preenchido.

## Assets

Assets padrao ficam em:

```txt
public/assets/defaults/
```

No JSON e nos campos de imagem, use caminhos relativos a `assets/` ou envie arquivos pelo proprio builder. Durante a exportacao, as imagens usadas sao incluidas no ZIP.

Depoimentos nao usam fotos ou nomes padrao. Sem foto, a landing mostra um icone de usuario; com nome e sem foto, mostra as iniciais; com foto enviada, usa a foto.
