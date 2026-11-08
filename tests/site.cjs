/* Testes do site Nascente Odontologia com Playwright.
   Como rodar (na pasta que CONTÉM o repositório, para o caminho /dentista/ funcionar como no GitHub Pages):
     python3 -m http.server 8301 &
     node dentista/tests/site.cjs
   Variáveis opcionais: PORTA (padrão 8301), CAPTURAS=1 para salvar imagens em docs/ e SHOTS_DIR para PNGs extras. */
const { chromium, devices } = require("playwright");
const path = require("path");
const fs = require("fs");

const PORTA = process.env.PORTA || "8301";
const BASE = `http://localhost:${PORTA}/dentista/`;
const CAPTURAS = process.env.CAPTURAS === "1";
const SHOTS_DIR = process.env.SHOTS_DIR || "";
const DOCS = path.join(__dirname, "..", "docs");

const TELAS = [
  { nome: "computador", opcoes: { viewport: { width: 1280, height: 900 } } },
  { nome: "iphone13", opcoes: { ...devices["iPhone 13"] } },
  { nome: "320px", opcoes: { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } }
];

let falhas = 0;
function ok(cond, msg) {
  console.log(`${cond ? "  ok " : "  FALHA"} ${msg}`);
  if (!cond) falhas++;
}

async function semBarras(page) {
  // Só para as capturas de seção: tira o cabeçalho fixo e a faixa de demonstração da frente.
  await page.evaluate(() => {
    document.querySelector(".topo").style.position = "static";
    document.querySelector(".aviso-demo").style.display = "none";
  });
}
async function comBarras(page) {
  await page.evaluate(() => {
    document.querySelector(".topo").style.position = "";
    document.querySelector(".aviso-demo").style.display = "";
  });
}

async function medir(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const rolagemHorizontal = doc.scrollWidth > doc.clientWidth + 1;
    const cortados = [];
    const tudo = document.querySelectorAll("h1, h2, h3, p, a, button, label, summary, dt, dd, li, span, output, legend, th");
    for (const el of tudo) {
      if (el.closest("[hidden]") || el.offsetParent === null && getComputedStyle(el).position !== "fixed") continue;
      const est = getComputedStyle(el);
      if (est.overflow === "hidden" || est.overflowX === "hidden") {
        if (el.scrollWidth > el.clientWidth + 2) cortados.push(`${el.tagName.toLowerCase()}: ${el.textContent.trim().slice(0, 40)}`);
      }
      const r = el.getBoundingClientRect();
      if (r.width && r.right > doc.clientWidth + 1) cortados.push(`fora da tela: ${el.tagName.toLowerCase()} ${el.textContent.trim().slice(0, 40)}`);
    }
    return { rolagemHorizontal, cortados, largura: doc.scrollWidth, cliente: doc.clientWidth };
  });
}

// Foto do hero: carregou, tem a proporção 4:3 e o texto do hero não encosta nela (legibilidade).
async function checarHero(page) {
  return page.evaluate(() => {
    const img = document.querySelector("img.hero-foto");
    if (!img) return { existe: false };
    const r = img.getBoundingClientRect();
    const caixa = img.parentElement.getBoundingClientRect();
    const textos = [...document.querySelectorAll("h1, h1 ~ p, .hero-texto p, .hero-texto a, .hero-texto h1")];
    let sobreposto = 0;
    for (const t of textos) {
      const b = t.getBoundingClientRect();
      if (!b.width || !b.height) continue;
      const w = Math.min(b.right, r.right) - Math.max(b.left, r.left);
      const h = Math.min(b.bottom, r.bottom) - Math.max(b.top, r.top);
      if (w > 1 && h > 1) sobreposto++;
    }
    return {
      existe: true,
      carregou: img.complete && img.naturalWidth === 1440 && img.naturalHeight === 1080,
      alt: (img.getAttribute("alt") || "").length > 20,
      proporcao: Math.round((caixa.width / caixa.height) * 100) / 100,
      cabe: r.left >= -1 && r.right <= document.documentElement.clientWidth + 1,
      sobreposto
    };
  });
}

(async () => {
  const browser = await chromium.launch();
  for (const tela of TELAS) {
    console.log(`\n== ${tela.nome} ==`);
    const contexto = await browser.newContext(tela.opcoes);
    const page = await contexto.newPage();
    const erros = [];
    page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") erros.push(`${m.type()}: ${m.text()}`); });
    page.on("pageerror", (e) => erros.push(`pageerror: ${e.message}`));
    page.on("requestfailed", (r) => erros.push(`request falhou: ${r.url()}`));

    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    const hero = await checarHero(page);
    ok(hero.existe && hero.carregou, "foto do hero carregou (1440x1080)");
    ok(hero.existe && hero.alt, "foto do hero tem alt descritivo");
    ok(hero.existe && Math.abs(hero.proporcao - 1.33) < 0.02, `contêiner do hero em 4:3 (${hero.proporcao})`);
    ok(hero.existe && hero.cabe && hero.sobreposto === 0, `foto cabe na tela e nenhum texto do hero fica sobre ela (${hero.sobreposto} sobreposições)`);

    const m = await medir(page);
    ok(!m.rolagemHorizontal, `sem rolagem horizontal (${m.largura} x ${m.cliente})`);
    ok(m.cortados.length === 0, `sem textos cortados${m.cortados.length ? ": " + m.cortados.join(" | ") : ""}`);

    // Fontes locais carregadas
    const fontes = await page.evaluate(() => document.fonts.check("16px Outfit") && document.fonts.check("16px Figtree"));
    ok(fontes, "fontes Outfit e Figtree carregadas");

    // Menu no celular
    const menuVisivel = await page.locator("[data-menu]").isVisible();
    if (menuVisivel) {
      await page.click("[data-menu]");
      ok(await page.locator("#menu").isVisible(), "menu abre no celular");
      await page.click("#menu a[href='#servicos']");
      ok(!(await page.locator("#menu").isVisible()), "menu fecha ao escolher um link");
    }

    // Agendamento: escolher o primeiro dia livre, o primeiro horário livre, confirmar
    const dias = page.locator(".dia:not(:disabled)");
    let diaCount = await dias.count();
    if (diaCount === 0) { await page.click("[data-mes='1']"); diaCount = await dias.count(); }
    ok(diaCount > 0, `calendário tem ${diaCount} dias disponíveis`);
    let agendou = false;
    for (let i = 0; i < Math.min(diaCount, 6) && !agendou; i++) {
      await dias.nth(i).click();
      const livres = page.locator(".horario:not(:disabled)");
      if (await livres.count() > 0) {
        await livres.first().click();
        await page.fill("#agenda-nome", "Visitante Teste");
        await page.selectOption("#agenda-servico", "Clareamento");
        await page.click("#agenda-form button[type=submit]");
        agendou = await page.locator("#agenda-confirmacao").isVisible();
      }
    }
    ok(agendou, "agendamento simulado confirmado");
    const guardado = await page.evaluate(() => JSON.parse(localStorage.getItem("nascente.agendamentos") || "[]").length);
    ok(guardado === 1, "horário guardado no localStorage");
    if (CAPTURAS && tela.nome !== "320px") {
      await semBarras(page);
      await page.locator("#agendar").screenshot({ path: path.join(DOCS, `funcao-agenda-${tela.nome}.png`) });
      await comBarras(page);
    }

    // Validação: nome vazio
    const diasDeNovo = page.locator(".dia:not(:disabled)");
    await diasDeNovo.first().click();
    const livres2 = page.locator(".horario:not(:disabled)");
    if (await livres2.count() > 0) {
      await livres2.first().click();
      await page.fill("#agenda-nome", "");
      await page.click("#agenda-form button[type=submit]");
      ok((await page.locator("#agenda-erro").textContent()).includes("nome"), "formulário avisa quando falta o nome");
    }

    // Simulador
    await page.selectOption("#sim-tratamento", "restauracao");
    await page.locator("#sim-dentes").fill("4");
    await page.locator("#sim-parcelas").fill("5");
    await page.check("input[name=complexidade][value=moderada]");
    await page.waitForTimeout(300);
    const valor = await page.locator("#sim-valor").textContent();
    const sessoes = await page.locator("#sim-sessoes").textContent();
    ok(/de R\$\u00a01\.125 a R\$\u00a02\.025/.test(valor), `simulador calcula faixa (${valor})`);
    ok(sessoes === "2 sessões", `simulador calcula sessões (${sessoes})`);
    ok((await page.locator("#sim-parcela").textContent()).includes("5 parcelas"), "simulador calcula parcelas");
    await page.selectOption("#sim-tratamento", "limpeza");
    await page.waitForTimeout(300);
    ok(!(await page.locator("#sim-campo-dentes").isVisible()), "campo de dentes some na limpeza");
    if (CAPTURAS && tela.nome !== "320px") {
      await page.selectOption("#sim-tratamento", "alinhadores");
      await page.waitForTimeout(300);
      await semBarras(page);
      await page.locator("#simulador").screenshot({ path: path.join(DOCS, `funcao-simulador-${tela.nome}.png`) });
      await comBarras(page);
    }

    // Antes e depois
    await page.locator("#comparador-controle").fill("80");
    const pos = await page.evaluate(() => getComputedStyle(document.querySelector(".comparador-quadro")).getPropertyValue("--pos").trim());
    ok(pos === "80%", `controle deslizante move a divisão (${pos})`);
    await page.click("#aba-alinhamento");
    ok((await page.locator("#painel-comparador").getAttribute("data-caso")) === "alinhamento", "troca de caso na galeria");
    await page.locator("#comparador-controle").focus();
    await page.keyboard.press("ArrowRight");
    const pos2 = await page.evaluate(() => getComputedStyle(document.querySelector(".comparador-quadro")).getPropertyValue("--pos").trim());
    ok(pos2 === "51%", `controle deslizante responde ao teclado (${pos2})`);
    if (CAPTURAS && tela.nome !== "320px") {
      await page.locator("#comparador-controle").fill("45");
      await semBarras(page);
      await page.locator("#antes-depois").screenshot({ path: path.join(DOCS, `funcao-antes-depois-${tela.nome}.png`) });
      await comBarras(page);
    }

    // Dúvidas
    await page.click(".faq-item:first-child summary");
    ok(await page.locator(".faq-item:first-child p").isVisible(), "pergunta frequente abre");

    // 404
    const r404 = await page.goto(`${BASE}404.html`, { waitUntil: "networkidle" });
    ok(r404.ok(), "404.html carrega");

    ok(erros.length === 0, `console sem erros${erros.length ? ": " + erros.join(" | ") : ""}`);

    if (CAPTURAS) {
      await page.goto(BASE, { waitUntil: "networkidle" });
      await page.waitForTimeout(1600);
      const nomeCapa = tela.nome === "computador" ? "capa-desktop" : tela.nome === "iphone13" ? "capa-celular" : null;
      if (nomeCapa) await page.screenshot({ path: path.join(DOCS, `${nomeCapa}.png`) });
    }
    await contexto.close();
  }

  if (SHOTS_DIR) {
    fs.mkdirSync(SHOTS_DIR, { recursive: true });
    const c1 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p1 = await c1.newPage();
    await p1.goto(BASE, { waitUntil: "networkidle" });
    await p1.waitForTimeout(1600);
    await p1.screenshot({ path: path.join(SHOTS_DIR, "dentista-desk.png") });
    await c1.close();
    const c2 = await browser.newContext({ ...devices["iPhone 13"] });
    const p2 = await c2.newPage();
    await p2.goto(BASE, { waitUntil: "networkidle" });
    await p2.waitForTimeout(1600);
    await p2.screenshot({ path: path.join(SHOTS_DIR, "dentista-cel.png") });
    await c2.close();
  }

  await browser.close();
  console.log(`\n${falhas === 0 ? "Tudo passou." : falhas + " falha(s)."}`);
  process.exit(falhas ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
