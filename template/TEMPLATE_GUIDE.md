# Landing Page Template Guide

## Builder

Abra `index.html` para usar o builder estatico. Edite por slots ou cole um JSON completo no formato canonico do projeto. Clique em **Exportar** para baixar:

```txt
index.html
styles.css
assets/
```

Esses arquivos sao o pacote final da landing page.

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

Assets padrao:

```txt
public/assets/defaults/
public/assets/defaults/team/
```

Depoimentos nao tem nomes ou fotos padrao. O editor permite preencher nomes e enviar fotos; se nao houver foto, a landing usa iniciais ou um icone de usuario.

## Publicacao

Extraia o ZIP exportado dentro do `public_html/`:

```txt
public_html/
  index.html
  styles.css
  assets/
```
