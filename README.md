# EKOPOD Study Desk

Lokální frontend aplikace pro studium předmětu **EKOPOD** postavená na `React + TypeScript + Vite + Tailwind CSS`. Aplikace běží čistě na klientovi, bez backendu, bez databáze a bez přihlášení. Veškerý obsah se načítá z lokálních souborů ve složce [`content/`](./content).

## Co aplikace umí

- `Flashcards / Potítko` pro aktivní vybavování odpovědi z hlavy
- `Trénink chyb` nad otázkami s nízkou úrovní zvládnutí
- `Simulace zkoušky` s minimalistickým režimem a časovačem
- `Skripta PDF` s navigací po stránkách, zoomem a fit width
- `AI souhrny` jako čtecí markdown režim se sticky obsahem
- `Statistiky` po sadách i kapitolách
- `Nastavení` včetně exportu/importu postupu do JSON
- validaci frontmatteru a ochranu proti chybějícím souborům

## Spuštění

```bash
npm install
npm run dev
```

Produkční build:

```bash
npm run build
```

Testy:

```bash
npm run test
```

## Obsahová struktura

```text
content/
  pdf/
    ekopod-skripta-sample.pdf
  questions/
    set-a/
      010--naklady-a-cleneni.md
      020--bod-zvratu.md
    set-b/
      010--pracovni-pomer.md
    set-c/
      010--cash-flow.md
  summaries/
    010--naklady.md
    020--pracovni-pravo.md
```

Veškeré cesty k obsahu jsou centralizované v [`src/lib/content/paths.ts`](./src/lib/content/paths.ts). Loader a validace jsou v:

- [`src/lib/content/loader.ts`](./src/lib/content/loader.ts)
- [`src/lib/content/parser.ts`](./src/lib/content/parser.ts)
- [`src/lib/content/validator.ts`](./src/lib/content/validator.ts)

## Naming convention

Souborové názvy nejsou jediným zdrojem pravdy, ale doporučená konvence je:

- otázky: `content/questions/<set>/<order>--<slug>.md`
- souhrny: `content/summaries/<order>--<slug>.md`
- PDF: `content/pdf/<nazev>.pdf`

Klíčové je, aby metadata ve frontmatteru odpovídala skutečnému obsahu.

## Formát otázky

Každá otázka je markdown s frontmatterem a sekcemi `##`.

```md
---
id: ekopod-a-010
set: A
chapter: Náklady a výnosy
subchapter: Členění nákladů
title: Jak členíme náklady?
order: 10
tags:
  - naklady
  - rizeni
difficulty: 2
sourcePdfPath: pdf/ekopod-skripta-sample.pdf
sourcePages:
  - 2
  - 3
sourceSections:
  - "1.1"
summaryId: shr-naklady
---
## Otázka
...

## Modelová odpověď
...

## Osnova odpovědi
...

## Detail
...

## Chytáky
...

## Příklady / situace
...

## Ve skriptech
...

## AI souhrn
...
```

### Povinná metadata otázky

- `id`
- `set`
- `chapter`
- `title`
- `order`
- `tags`
- `difficulty`
- `sourcePdfPath`

### Volitelná metadata otázky

- `subchapter`
- `sourcePages`
- `sourceSections`
- `summaryId`

### Rozpoznávané sekce

- `## Otázka`
- `## Modelová odpověď`
- `## Osnova odpovědi`
- `## Detail`
- `## Chytáky`
- `## Příklady / situace`
- `## Ve skriptech`
- `## AI souhrn`

## Formát AI souhrnu

```md
---
id: shr-naklady
title: AI souhrn k nákladům
chapter: Náklady a výnosy
order: 10
tags:
  - naklady
relatedQuestionIds:
  - ekopod-a-010
description: Krátký čtecí tahák.
---
# Hlavní nadpis
...
```

## Chování při chybě obsahu

Aplikace se při chybějícím nebo nevalidním obsahu nesmí rozpadnout.

- chybějící PDF zobrazí čitelné upozornění a fallback režim
- nevalidní frontmatter označí otázku jako nevalidní v UI
- detail problému vypíše do vývojové konzole
- prázdná sada nebo kapitola zobrazí bezpečný empty state
- poškozený lokální progress se automaticky resetuje a uživatel dostane upozornění

## Klávesové zkratky

- `Space` / `Enter`: odhalit odpověď
- `0 / 1 / 2 / 3`: ohodnotit zvládnutí
- `← / →`: předchozí / další
- `D`: otevřít nebo zavřít detail
- `F`: označit oblíbené
- `Esc`: zavřít detail
- `/`: fokus na search input

## Lokální data

Do `localStorage` se ukládá:

- průběžná úroveň zvládnutí po otázkách
- historie hodnocení
- oblíbené
- aktivní session
- nastavení UI

Export a import snapshotu je v sekci `Nastavení`.

## Testy

Základní test suite pokrývá:

- parser a validaci obsahu
- základní flashcard flow: otázka -> odhalení odpovědi -> hodnocení

## Důležité poznámky pro doplnění vlastního obsahu

- Markdown soubory přidávej pouze do `content/questions` a `content/summaries`.
- PDF dej do `content/pdf`.
- Pokud přidáš nový obsah za běhu dev serveru, je bezpečné server restartovat, aby Vite znovu načetl glob importy.
- Názvy kapitol, sad, tagů ani summary vztahy nejsou hardcoded v komponentách; vše se čte z obsahu.

## Hlavní adresáře v kódu

- [`src/components`](./src/components): UI komponenty
- [`src/routes`](./src/routes): jednotlivé režimy aplikace
- [`src/store`](./src/store): lokální persistovaný store
- [`src/lib/content`](./src/lib/content): loader, parser, validace, session logika
- [`src/providers`](./src/providers): content provider
- [`src/types`](./src/types): datové typy

## Stav projektu

Repo obsahuje:

- kompletní spustitelný frontend
- sample markdown content
- sample PDF
- základní testy
- README s konvencemi

Stačí doplnit nebo nahradit obsah ve složce `content/` a spustit `npm run dev`.
