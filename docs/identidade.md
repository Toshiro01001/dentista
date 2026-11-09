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

## Design systems aplicados (leva final)

A paleta, as fontes e a regra de ouro continuam as mesmas. O que mudou foi a superfície: a leva final mistura dois design systems do catálogo da Mil e Uma Linhas!, traduzidos para a paleta da Nascente e escritos em CSS e JavaScript próprios (sem biblioteca, sem fonte externa, sem WebGL).

**Dupla**: `spectra-design-system` (claro) e `glass-green-effect-design-system` (escuro).

**Mistura**: as seções claras (#servicos, #agendar, #simulador, #consultorio, #duvidas, #como-funciona) usam os padrões do spectra com Esmalte no lugar do forest-50, Hortelã no lugar do forest-100, Cerrado no lugar do emerald-600 e Grafite no lugar do forest-950, raio 20 px nos blocos e 10 px em botões e campos; a aurora em WebGL do spectra ficou de fora e o Mel continua aparecendo uma vez por tela. A faixa escura (#antes-depois) e o rodapé usam os padrões do glass-green-effect sobre Grafite, com a Hortelã fazendo o papel do teal: luzes ambientes Hortelã a 10% e Mel a 8% em `@keyframes` lentos, cartão com inclinação 3D só com ponteiro fino e brilho Hortelã nos títulos; o cursor de rastro não entrou.

Componentes aplicados:

| Padrão | Origem | Onde |
| --- | --- | --- |
| Light glass card (branco a 60%, blur 12 px, borda branca a 40%, cresce 1% em 700 ms no hover) | spectra | `.simulador-resultado` (sobre um poço Hortelã) e `.agenda-horarios` |
| Raised panel branco com borda Cerrado a 5% e disco de ícone Hortelã de 40 px | spectra | cada `.servico` em #servicos |
| Application media card (foto 4:3 com degradê Grafite, título Outfit 500 Esmalte sobre a foto, disco de vidro branco a 10%, foto cresce 5% no hover) | spectra | os quatro serviços com foto |
| Chip em caixa baixa (Figtree 600, 12 px, Cerrado sobre Hortelã a 50%) + régua de 32 px | spectra | `.chip-linha` antes de cada h2 de seção, no lugar da linha fina de largura total |
| Primary button com véu branco a 20% que sobe em 300 ms, seta que anda 4 px e sombra Cerrado a 20% | spectra | `.botao-cheio` em todo o site |
| Billing toggle well (poço Hortelã a 20%, padding 6 px, aba escolhida Esmalte com sombra) | spectra | `.galeria-casos` em #antes-depois |
| FAQ toggle por `grid-template-rows` 0fr para 1fr em 500 ms, ícone + que gira 90 graus e vira menos, uma aberta por vez | spectra | `.faq-item` em #duvidas (details/summary com animação por JS) |
| Hotspot com halo pulsante e tooltip Esmalte a 95% com blur | spectra | `.hotspot` sobre a coroa do molar no hero |
| Navbar transparente que ganha Esmalte a 95% com blur de 20 px e hairline Hortelã depois de 20 px de rolagem | spectra | `.topo` (classe `.rolado` por JS) |
| Glass pills on media (Grafite a 30% com blur, borda branca a 20%) com ponto Hortelã pulsante no "Depois" | spectra | `.comparador-rotulo` |
| Ambient lights (duas luzes desfocadas de 300 px e 400 px que derivam em 8 s e 10 s) | glass-green-effect | `.luz` em #antes-depois e no rodapé |
| Glow card com inclinação 3D leve (sobe 8 px, 2 graus em X e -2 em Y, brilho Hortelã a 20%) só com ponteiro fino | glass-green-effect | `.comparador-quadro` |
| Text glow (text-shadow 0 0 20 px Hortelã a 35%) e frase de apoio Hortelã a 80% | glass-green-effect | h2 e p da cabeça de #antes-depois e marca do rodapé |
| Entradas slideUp (texto, 800 ms), scaleIn (foto, 600 ms, substitui a ampliação antiga) e ações 100 ms depois; revelação ao rolar (sobe 20 px com fade em 600 ms ao cruzar 12% da tela) | glass-green-effect | #inicio e cada `.secao-cabeca` com seu primeiro bloco |

Tudo isso desliga com `prefers-reduced-motion: reduce`: sem pulso, sem deriva das luzes, sem inclinação, sem revelação (o conteúdo aparece pronto).

### Fotos novas (geradas por IA no Canva, ilustrativas)

Os arquivos em `img/` são as fotos geradas no Canva, convertidas para webp no tamanho certo. Todas são ilustrativas, sem pacientes nem pessoas identificáveis.

| Arquivo | Proporção | Onde |
| --- | --- | --- |
| `img/servico-limpeza-bandeja.webp` | 4:3 | Serviço "Avaliação e limpeza" |
| `img/servico-clareamento-moldeira.webp` | 4:3 | Serviço "Clareamento" |
| `img/servico-alinhadores-gesso.webp` | 4:3 | Serviço "Alinhadores transparentes" |
| `img/servico-implante-modelo.webp` | 4:3 | Serviço "Implantes" |
| `img/consultorio-cadeira.webp` | 3:2 | Acima do endereço em "Quem atende e onde" |
| `img/dentista-radiografia.webp` | 3:4 | Dra. Helena Albuquerque |
| `img/maos-alinhador.webp` | 3:4 | Dra. Marina Tavares |
| `img/sala-espera-calma.webp` | 4:5 | Acima do calendário em "Escolha um horário" |
