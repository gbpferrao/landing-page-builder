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

No topo do builder, preencha **Nome da pagina**. Esse valor vira o nome da pasta exportada e tambem o slug sugerido para hospedagem.

Depois, clique em **Exportar pasta** e escolha onde salvar a landing. O builder cria uma pasta com:

```txt
nome-da-pagina/
  index.html
  styles.css
  assets/
```

Envie essa pasta inteira para `public_html/` na Hostinger para publicar em `https://dominio.com/nome-da-pagina/`, sem passar pelo WordPress ou Elementor.

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

No JSON e nos campos de imagem, use caminhos relativos a `assets/` ou envie arquivos pelo proprio builder. Durante a exportacao, as imagens usadas sao incluidas na pasta exportada.

Depoimentos nao usam fotos, nomes ou avatares padrao. A landing so mostra foto, nome ou data quando esses campos forem preenchidos no editor da landing.
