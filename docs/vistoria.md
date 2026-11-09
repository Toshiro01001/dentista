# Vistoria de segurança: Nascente Odontologia

Data: 08/11/2026. Site estático de demonstração, publicado no GitHub Pages.

## Resumo

Nenhum dado sai do navegador do visitante. Não há servidor, formulário com envio, cookie, rastreamento, dependência externa ou segredo no repositório.

## Content-Security-Policy

Declarada por `<meta http-equiv="Content-Security-Policy">` em `index.html`:

```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;
font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'
```

- Sem script inline: todo o JavaScript está em `js/app.js`.
- Sem estilo inline: todo o CSS está em `css/estilo.css`. A única alteração de estilo em tempo de execução é a variável `--pos` do comparador, feita por `element.style.setProperty`, que a CSP permite (é CSSOM, não atributo `style`).
- `connect-src 'none'`: nenhum `fetch`, `XMLHttpRequest` ou WebSocket pode sair da página.
- `form-action 'none'`: mesmo que o JavaScript falhe, o formulário de agendamento não consegue enviar nada a lugar nenhum.
- `img-src 'self' data:` existe para o favicon SVG e eventuais imagens em `data:`; hoje são usados o favicon e a foto do hero (`img/hero.webp`), que é um arquivo do próprio site, sem pedido externo.
- O `404.html` usa `script-src 'none'`, pois não tem JavaScript.
- `frame-ancestors` não pode ser declarado por `meta`; o GitHub Pages não permite cabeçalhos HTTP próprios. Risco residual: a página pode ser colocada em um `iframe` por outro site. Como não há sessão nem dado sensível, o impacto é nulo.

Verificado nos testes: com a CSP ativa, não há erro de console em 1280x900, iPhone 13 e 320 px.

## Envio de dados

- Nenhum. O formulário de agendamento tem `novalidate`, é interceptado com `preventDefault()` e só escreve na tela e no `localStorage`.
- Único link externo: `https://mileumalinhas.com.br`, com `rel="noopener"`.
- Sem analytics, sem pixel, sem fontes externas, sem CDN.

## O que fica no localStorage

| Chave | Conteúdo | Quando é gravado | Como apagar |
| --- | --- | --- | --- |
| `nascente.agendamentos` | Lista JSON com `quando`, `nome`, `servico`, `data` e `hora` de cada horário confirmado na simulação | Só depois de o visitante clicar em "Confirmar horário" | Botão "Apagar lista" na própria página, ou limpando os dados do site no navegador |

O nome digitado é escolhido pelo visitante e fica só no aparelho dele. A página avisa isso ao lado da lista. Leitura e gravação estão em `try/catch`: se o navegador bloquear o armazenamento, o site segue funcionando sem guardar.

## Dependências

- Em produção: nenhuma. Zero bibliotecas, zero pacotes.
- Fontes: Outfit e Figtree (SIL Open Font License 1.1), arquivos woff2 do subconjunto latino copiados do pacote `@fontsource-variable`, com as licenças em `fonts/`.
- Só para testes locais: Playwright, instalado fora do repositório. Não há `package.json`.

## Dados no repositório

- Empresa, pessoas, CRO, endereço, telefone, preços e depoimentos são fictícios e marcados como tal na página.
- Nenhuma senha, chave, token ou dado pessoal real.
- `google20db0e080e71c701.html` é um arquivo de verificação de propriedade do Search Console; não dá acesso a nada.

## Riscos residuais

1. `iframe` por terceiros (sem `frame-ancestors`): impacto nulo, não há sessão.
2. Alguém pode copiar o site e apresentá-lo como consultório real: a faixa fixa de demonstração e o rodapé dizem em todas as telas que os dados são fictícios.
3. O `localStorage` é compartilhado por todas as páginas na mesma origem (`toshiro01001.github.io`): outro site publicado no mesmo usuário do GitHub Pages pode ler a chave `nascente.agendamentos`. Por isso a chave tem prefixo próprio e guarda só o que o visitante digitou numa simulação.

## Revisão de 08/11/2026 (leva final de design)

Revisão feita depois de aplicar os design systems da leva final e encaixar as fotos geradas por IA no Canva.

- **CSP:** a política do `index.html` é a mesma de antes da leva (conferida linha a linha). Continua sem `unsafe-inline`, sem `unsafe-eval` e sem origem externa.
- **Script e estilo inline:** nenhum `<script>` inline, nenhum `<style>` e nenhum atributo `style` nas páginas. Os efeitos novos mudam só classes, `textContent` e propriedades CSS pelo CSSOM, que a CSP permite.
- **Recursos externos:** nenhum script, fonte, imagem ou folha de estilo de fora. Os únicos links externos são de navegação comum (mileumalinhas.com.br e o perfil do GitHub).
- **Bibliotecas:** nenhuma entrou. Movimento, vidro, contadores e revelação ao rolar são CSS e JavaScript escritos à mão, desligados com `prefers-reduced-motion`.
- **innerHTML:** nenhum uso no JavaScript.
- **eval e Function:** nenhum uso.
- **Armazenamento:** `localStorage` continua só com o que já existia (`nascente.agendamentos`), sem chave nova nesta leva.
- **Dados pessoais:** nenhum dado pessoal real entrou. Pessoas, empresas, telefones e endereços seguem fictícios. As fotos não retratam pessoas reais.
- **Imagens:** arquivos webp locais em `img/`, com `width`/`height`, `loading="lazy"` e `decoding="async"`. Nenhuma é carregada de outro domínio.
- **Testes:** `tests/site.cjs` passa em 1280x900, iPhone 13 e 320px, sem erro de console e sem rolagem horizontal.
