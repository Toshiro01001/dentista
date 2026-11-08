# Identidade visual: Nascente Odontologia

Estudo curto feito antes do código. Tudo aqui é fictício e serve de demonstração da Mil e Uma Linhas!.

## Nome e posicionamento

**Nascente Odontologia**, consultório odontológico fictício em Cuiabá.

Frase de posicionamento: "Odontologia com calma e sem susto: você vê o plano, as sessões e a faixa de preço antes de sentar na cadeira."

A palavra "nascente" junta duas ideias: água limpa que brota (limpeza, frescor, Cerrado) e o começo de algo (um sorriso novo). Ela evita o vocabulário clínico frio ("odontoclínica", "dental center") e soa como um lugar, não como um procedimento.

## O que faz um consultório parecer limpo, moderno e de confiança

- Muito espaço em branco e poucas cores. Sujeira visual lembra desorganização.
- Formas arredondadas e lisas, como esmalte e alinhador, nunca cantos agressivos.
- Precisão: alinhamentos exatos, grade visível, números claros. Confiança vem de dizer o preço e o prazo.
- Nada de azul-clínico com gradiente. A paleta sai do Cerrado e da porcelana, não do hospital.

## Paleta

| Cor | Hex | Papel | Regra |
| --- | --- | --- | --- |
| Esmalte | `#F7F8F5` | Fundo principal | Branco levemente esverdeado, nunca branco puro, para não ofuscar. |
| Grafite | `#1C2A2A` | Texto principal e fundo do rodapé | Contraste 14,8:1 sobre Esmalte. |
| Cerrado | `#245C4C` | Cor da marca: botões, links, títulos de apoio, foco | Contraste 6,9:1 sobre Esmalte; serve para texto. |
| Hortelã | `#DCEDE3` | Superfícies de apoio (faixas, calendário, blocos) | Sempre com texto Grafite em cima. |
| Mel | `#C97E2E` | Destaque único | Aparece em um lugar por tela: horário escolhido, alça do controle deslizante, número da faixa de preço. Nunca em texto pequeno. |
| Pedra | `#50605D` | Texto secundário, legendas | Contraste 6,3:1 sobre Esmalte. |

## Tipografia

Duas famílias, ambas variáveis, locais em `fonts/`, licença SIL OFL 1.1 (arquivos `LICENSE-Outfit.txt` e `LICENSE-Figtree.txt`).

- **Outfit** (títulos). Geométrica, de formas redondas, lembra o desenho de um alinhador. Pesos 500 e 600, nunca 700 ou mais, para não "gritar".
- **Figtree** (corpo e interface). Humanista, aberta, legível em tamanho pequeno no celular. Pesos 400 e 600.

Escala (base 16 px, razão aproximada 1,25):

| Papel | Tamanho | Fonte e peso |
| --- | --- | --- |
| Título do hero | `clamp(2.4rem, 5.5vw, 4rem)` | Outfit 500, entrelinha 1,05 |
| Título de seção | `clamp(1.75rem, 3.2vw, 2.5rem)` | Outfit 500, entrelinha 1,1 |
| Subtítulo | `1.25rem` | Outfit 500 |
| Corpo | `1rem` até `1.125rem` | Figtree 400, entrelinha 1,55 |
| Legenda | `0.875rem` | Figtree 400, cor Pedra |
| Número grande (faixa de preço) | `clamp(2rem, 4vw, 3rem)` | Outfit 600, cor Mel |

Sem rótulos em caixa alta acima dos títulos. Sem numeração 01/02/03.

## Layout

- Grade de 12 colunas, largura máxima 1120 px, margens laterais 20 px no celular e 48 px no computador.
- Ritmo de espaçamento em múltiplos de 8: 8, 16, 24, 40, 64, 96.
- Alinhamento à esquerda em tudo. Nada centralizado, exceto o calendário.
- Raio de borda 20 px nos blocos grandes e 10 px em botões e campos, ecoando as formas lisas do esmalte.
- Cada seção começa com uma linha fina de 1 px (cor Hortelã) e um título à esquerda; os blocos internos não são cartões iguais. O calendário é uma tabela, o simulador é um painel de dois lados, a galeria é um quadro único.

## Imagem forte

O hero é uma **foto gerada por IA (Canva)**: um molar de porcelana branca, brilhante, em pé sobre um fundo liso verde-menta, com uma sombra curta e macia. Ela é ilustrativa, não é de paciente nem de consultório real. A menta da foto conversa com o Hortelã da paleta, e o dente, sozinho e com muito ar em volta, é a "coisa memorável" da primeira tela. O contêiner tem proporção fixa de 4:3 e cantos de 20 px no celular e 28 px no computador, o mesmo raio dos blocos grandes. Enquanto a foto carrega, o contêiner mostra a cor média dela, para a página não dar salto.

O símbolo da marca no cabeçalho continua sendo um desenho SVG de cinco barras arredondadas (um arco de dentes), com uma em Mel.

Na galeria "antes e depois", os sorrisos são SVG estilizados: lábios em uma forma simples e dentes em retângulos arredondados. Mudam a cor, a inclinação ou o contorno de um dente para mostrar clareamento, alinhamento e restauração. São desenhos, não fotos de pacientes.

### Foto do hero

- **Arquivo**: `img/hero.webp`, 1440 x 1080 px, proporção 4:3.
- **Origem**: gerada por IA no Canva. Fica avisado no README e aqui, porque é uma imagem ilustrativa.
- **Prompt resumido**: "Molar de porcelana branca e brilhante, em pé, fotografado de frente em leve ângulo, centralizado, sobre fundo liso verde-menta. Luz suave de estúdio, sombra curta e macia à direita, muito espaço livre em volta. Estilo editorial de site premium, sem texto, sem pessoas, proporção 4:3."
- **Texto alternativo**: "Molar de porcelana branca e brilhante, em pé sobre um fundo liso verde-menta, com uma sombra suave ao lado."
- **Texto do hero**: fica ao lado da foto no computador e abaixo dela no celular, nunca por cima. Por isso o contraste do texto é o da página (Grafite sobre Esmalte), não depende da foto.

## Movimento

- Um momento orquestrado: na abertura, a foto do hero aparece com uma leve ampliação, em 800 ms.
- Respostas a ações: horário escolhido muda para Mel, o controle deslizante acompanha o dedo, o resultado do simulador muda de valor com uma transição curta.
- Com `prefers-reduced-motion: reduce`, tudo aparece sem animação.

## Regra de ouro

Uma coisa memorável por tela: o dente de porcelana no hero, o calendário na agenda, o número em Mel no simulador, o controle deslizante na galeria. O resto fica quieto.
