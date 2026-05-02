# Landing Page Template Guide

## Builder

Abra `index.html` para usar o app. Crie ou abra um projeto, edite por slots ou cole um JSON completo no formato canonico. Preencha **Projeto** no topo do editor e clique em **Exportar pasta** para salvar:

```txt
nome-da-pagina/
  index.html
  styles.css
  assets/
```

Essa pasta e o pacote final da landing page.

## Formato JSON

```txt
site.meta
site.brand
site.footer
site.tracking
sections.hero.content / assets
sections.problems.content / assets
sections.solutions.content / assets
sections.value.content / assets
sections.team.content / assets
sections.testimonials.content / assets
sections.cta.content / assets
sections.faq.content / assets
sections.footer.content / assets
```

## Tracking

As tags sao globais em `site.tracking`.

- `pageView`: disparada ao carregar a landing.
- `videoClick`: disparada em clique no video.
- `videoWatch`: disparada ao assistir o tempo configurado.
- `whatsappClick`: disparada em todos os botoes de WhatsApp.

Deixe IDs de provedores vazios para nao renderizar GA4, Google Ads ou Meta Pixel no HTML exportado.

## FAQ

O campo de FAQ usa texto simples:

```txt
Q1: Pergunta
R1: Resposta

Q2: Pergunta
R2: Resposta
```

## Imagens

Use caminhos em `assets/` ou envie imagens pelo campo de upload do builder.

Imagens enviadas sao salvas no IndexedDB junto com o projeto, para sobreviver a refresh e reabertura no mesmo navegador.

Assets padrao:

```txt
public/assets/defaults/
public/assets/defaults/team/
```

Depoimentos nao tem nomes, fotos ou avatares padrao. O editor permite preencher nomes e enviar fotos; se esses campos ficarem vazios, a landing nao inventa fallback visual ou identidade.

## Publicacao

Envie a pasta exportada para dentro de `public_html/`:

```txt
public_html/
  nome-da-pagina/
    index.html
    styles.css
    assets/
```

A landing fica disponivel em `/nome-da-pagina/` e nao precisa passar pelo WordPress ou Elementor.
