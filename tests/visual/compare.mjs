import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const port = 4178;
const base = `http://127.0.0.1:${port}/`;
const output = resolve(root, 'visual-results');
const fixtures = resolve(root, 'tests/visual/reference');
const expected = JSON.parse(
  await readFile(resolve(root, 'tests/visual/geometry-reference.json'), 'utf8'),
);
const screens = [
  { name: 'catalog', hash: '#/events' },
  { name: 'event', hash: '#/events/semantic-html' },
  { name: 'registration', hash: '#/register/semantic-html' },
];
await mkdir(output, { recursive: true });

const server = spawn(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' },
);
server.stdout.on('data', (chunk) => process.stdout.write(`[vite] ${chunk}`));
server.stderr.on('data', (chunk) => process.stderr.write(`[vite] ${chunk}`));

async function ready() {
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(`Vite завершился: ${server.exitCode}`);
    try {
      const res = await fetch(base);
      if (res.ok) return;
    } catch {
      /* ещё запускается */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Сервер Vite не запустился за 20 секунд');
}

let browser;
try {
  await ready();
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    throw new Error(
      'Браузер Playwright не найден. Запусти: npx playwright install chromium\n' +
        e.message,
    );
  }
  const page = await browser.newPage({
    viewport: { width: 1080, height: 768 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const results = [];
  for (const screen of screens) {
    await page.goto(base + screen.hash, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: resolve(output, `${screen.name}-actual.png`),
      fullPage: false,
      animations: 'disabled',
    });
    const geometry = await page.evaluate(
      (items) =>
        items.map(({ selector, expected }) => {
          const el = document.querySelector(selector);
          if (!el) return { selector, expected, error: 'Элемент не найден' };
          const rect = el.getBoundingClientRect();
          const actual = [rect.x, rect.y, rect.width, rect.height].map(
            (n) => Math.round(n * 10) / 10,
          );
          const delta = actual.map(
            (n, i) => Math.round(Math.abs(n - expected[i]) * 10) / 10,
          );
          return {
            selector,
            expected,
            actual,
            delta,
            maxDelta: Math.max(...delta),
            pass: Math.max(...delta) <= 5,
          };
        }),
      expected[screen.name],
    );
    const overflow = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    }));
    // Canvas handles decoding and pixel comparison in Chromium, no separate image library required.
    const actual64 = (
      await readFile(resolve(output, `${screen.name}-actual.png`))
    ).toString('base64');
    const reference64 = (await readFile(resolve(fixtures, `${screen.name}.png`))).toString(
      'base64',
    );
    const diff = await page.evaluate(
      async ({ actual64, reference64 }) => {
        const decode = (b64) =>
          new Promise((yes, no) => {
            const img = new Image();
            img.onload = () => yes(img);
            img.onerror = no;
            img.src = `data:image/png;base64,${b64}`;
          });
        const [a, b] = await Promise.all([decode(actual64), decode(reference64)]);
        const w = 1080,
          h = 768;
        const ctxImg = (img) => {
          const c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          const ctx = c.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0, w, h);
          return ctx.getImageData(0, 0, w, h);
        };
        const aa = ctxImg(a).data,
          bb = ctxImg(b).data;
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        const out = ctx.createImageData(w, h);
        let changed = 0,
          errorSum = 0;
        for (let i = 0; i < aa.length; i += 4) {
          const d =
            (Math.abs(aa[i] - bb[i]) +
              Math.abs(aa[i + 1] - bb[i + 1]) +
              Math.abs(aa[i + 2] - bb[i + 2])) /
            3;
          errorSum += d;
          if (d > 25) {
            changed++;
            out.data[i] = 245;
            out.data[i + 1] = 60;
            out.data[i + 2] = 80;
            out.data[i + 3] = 255;
          } else {
            out.data[i] = Math.round(bb[i] * 0.7 + 255 * 0.3);
            out.data[i + 1] = Math.round(bb[i + 1] * 0.7 + 255 * 0.3);
            out.data[i + 2] = Math.round(bb[i + 2] * 0.7 + 255 * 0.3);
            out.data[i + 3] = 255;
          }
        }
        ctx.putImageData(out, 0, 0);
        return {
          differencePercent: Math.round((10000 * changed) / (w * h)) / 100,
          meanChannelDifference: Math.round((100 * errorSum) / (w * h)) / 100,
          differenceImage: c.toDataURL('image/png').split(',')[1],
        };
      },
      { actual64, reference64 },
    );
    await writeFile(
      resolve(output, `${screen.name}-diff.png`),
      Buffer.from(diff.differenceImage, 'base64'),
    );
    const summary = {
      screen: screen.name,
      route: screen.hash,
      viewport: '1080 × 768',
      overflow,
      geometry,
      differencePercent: diff.differencePercent,
      meanChannelDifference: diff.meanChannelDifference,
      elementsWithin5px: geometry.filter((x) => x.pass).length,
      totalElements: geometry.length,
      geometryPass: geometry.every((x) => x.pass),
      files: {
        reference: `tests/visual/reference/${screen.name}.png`,
        actual: `${screen.name}-actual.png`,
        diff: `${screen.name}-diff.png`,
      },
    };
    results.push(summary);
    console.log(
      `${screen.name}: ${summary.elementsWithin5px}/${summary.totalElements} элементов ≤5px, визуальное отличие ${summary.differencePercent}%, переполнение: ${overflow.horizontalOverflow ? 'ДА' : 'нет'}`,
    );
  }
  await writeFile(
    resolve(output, 'report.json'),
    JSON.stringify(
      {
        notice:
          'Координаты PDF оценочные; попиксельный процент не равен геометрическому допуску.',
        screens: results,
      },
      null,
      2,
    ),
  );
  const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;');
  const html = `<!doctype html><html lang="ru"><meta charset="utf-8"><title>CampusFlow — визуальная проверка</title><style>body{font:15px/1.5 system-ui;background:#f6f8fc;color:#15223d;margin:30px}main{max-width:1140px;margin:auto}section{background:white;border-radius:12px;padding:18px;margin:18px 0}img{max-width:100%;width:100%;border:1px solid #ccd} .pictures{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}table{border-collapse:collapse;width:100%}td,th{padding:6px;border-bottom:1px solid #ddd;text-align:left}.bad{color:#b21c37;font-weight:bold}.good{color:#08784b}@media(max-width:780px){.pictures{grid-template-columns:1fr}}</style><main><h1>CampusFlow — сравнение с PDF-макетом</h1><p>1080 × 768 CSS px, Chromium, DPR=1. Пиксельные отличия не являются прямым измерением геометрии. Эталон из PDF; координаты элементов в эталоне приблизительные.</p>${results.map((r) => `<section><h2>${r.screen}</h2><p>Элементы в допуске 5 px: <strong class="${r.geometryPass ? 'good' : 'bad'}">${r.elementsWithin5px}/${r.totalElements}</strong>; пикселей, отличающихся по цвету более чем на 25/255: ${r.differencePercent}%; горизонтальное переполнение: ${r.overflow.horizontalOverflow ? 'ДА' : 'нет'}.</p><div class="pictures"><div><h3>Макет</h3><img src="../tests/visual/reference/${r.screen}.png"></div><div><h3>Сайт</h3><img src="${r.screen}-actual.png"></div><div><h3>Разница</h3><img src="${r.screen}-diff.png"></div></div><table><tr><th>Элемент</th><th>Макет X/Y/W/H</th><th>Реализация X/Y/W/H</th><th>Max Δ</th></tr>${r.geometry.map((g) => `<tr><td>${esc(g.selector)}</td><td>${g.expected.join(' / ')}</td><td>${(g.actual || []).join(' / ')}</td><td class="${g.pass ? 'good' : 'bad'}">${g.maxDelta ?? 'нет'}</td></tr>`).join('')}</table></section>`).join('')}</main></html>`;
  await writeFile(resolve(output, 'report.html'), html);
  console.log(`Отчёт: ${resolve(output, 'report.html')}`);
  if (results.some((r) => !r.geometryPass || r.overflow.horizontalOverflow)) {
    console.log('Есть отклонения свыше 5 px: это результат проверки, а не ошибка запуска.');
    // Не делаем процесс неуспешным: отчёт нужен и при несовпадении макета.
  }
} catch (e) {
  console.error(e.stack ?? e);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.kill();
}
