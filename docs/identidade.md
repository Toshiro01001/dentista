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

O hero tem um **arco de sorriso em SVG**: oito formas de dente desenhadas como retângulos arredondados distribuídos em um arco, sobre um fundo Hortelã, com um brilho em Mel em um único dente. É geometria, não um sorriso realista. O mesmo desenho, menor, vira o símbolo da marca no cabeçalho.

Na galeria "antes e depois", os sorrisos também são SVG estilizados: lábios em uma forma simples e dentes em retângulos arredondados. Mudam a cor, a inclinação ou o contorno de um dente para mostrar clareamento, alinhamento e restauração. Nada de fotos.

## Movimento

- Um momento orquestrado: na abertura, os oito dentes do hero sobem até o arco, em sequência, em 700 ms.
- Respostas a ações: horário escolhido muda para Mel, o controle deslizante acompanha o dedo, o resultado do simulador muda de valor com uma transição curta.
- Com `prefers-reduced-motion: reduce`, tudo aparece sem animação.

## Regra de ouro

Uma coisa memorável por tela: o arco de dentes no hero, o calendário na agenda, o número em Mel no simulador, o controle deslizante na galeria. O resto fica quieto.
