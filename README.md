# EKOPOD Study Desk

Lokální frontend aplikace pro studium předmětu **EKOPOD** postavená na `React + TypeScript + Vite + Tailwind CSS`. Aplikace běží čistě na klientovi, bez backendu, bez databáze a bez přihlášení. Veškerý obsah se načítá z lokálních souborů ve složce [`content/`](./content).

Repo je teď připravený tak, že obsahuje:

- reálné PDF skript `EKOPOD skripta 2024`
- kompletně zpracovanou **sadu A**
- `60` markdown otázek
- `12` markdown souhrnů
- validaci obsahu při načtení
- základní testy parseru, UI flow a integrity obsahových souborů

## Spuštění

```bash
npm install
npm run dev
```

Produkční build:

```bash
npm run build
```

Náhled produkčního buildu:

```bash
npm run preview
```

Testy:

```bash
npm run test
```

Lint:

```bash
npm run lint
```

## Aktuální obsah projektu

```text
content/
  pdf/
    ekopod-skripta-2024.pdf
  questions/
    set-a/
      0101--predmet-podnikove-ekonomiky.md
      0102--podnik-zavod-a-podnikani.md
      ...
      1205--vahy-a-vicekriterialni-hodnoceni.md
  summaries/
    001--podnikova-ekonomika-a-podnik.md
    002--dlouhodoby-majetek-a-odepisovani.md
    ...
    012--metody-mezipodnikoveho-srovnavani.md
```

V projektu je teď cíleně pouze `set-a`. Sady `B` a `C` můžeš doplnit později stejnou strukturou, bez zásahu do kódu aplikace.

## Ověřená struktura předmětu

Sada A je připravená nad těmito 12 kapitolami skript:

1. Podniková ekonomika, podnik, klasifikace podniků
2. Dlouhodobý majetek a jeho odepisování
3. Oběžný majetek (pracovní kapitál)
4. Kapitál podniku – pasiva
5. Investice a jejich hodnocení
6. Náklady podniku
7. Kalkulace nákladů
8. Zisk, výnosy a výkony
9. Cash flow – peněžní tok v podniku
10. Finanční analýza
11. Zakladatelský rozpočet, mimořádné financování
12. Metody mezipodnikového srovnávání

## Naming convention

Souborové názvy nejsou jediným zdrojem pravdy, ale doporučená konvence je:

- otázky: `content/questions/<set>/<order>--<slug>.md`
- souhrny: `content/summaries/<order>--<slug>.md`
- PDF: `content/pdf/<nazev>.pdf`

Příklady:

- `content/questions/set-a/0603--druhove-cleneni-nakladu.md`
- `content/summaries/006--naklady-podniku.md`
- `content/pdf/ekopod-skripta-2024.pdf`

Klíčové je, aby metadata ve frontmatteru odpovídala skutečnému obsahu.

## Formát otázky

Každá otázka je markdown s frontmatterem a sekcemi `##`.

```md
---
id: "ekopod-a-0101"
set: "A"
chapter: "1. Podniková ekonomika, podnik, klasifikace podniků"
subchapter: "1.1 Předmět podnikové ekonomiky"
title: "Co zkoumá podniková ekonomika a proč je pro podnik praktická?"
order: 101
tags:
  - "podniková-ekonomika"
  - "podnik"
  - "řízení"
difficulty: 1
sourcePdfPath: "pdf/ekopod-skripta-2024.pdf"
sourcePages:
  - 9
sourceSections:
  - "1.1"
summaryId: "shr-ekopod-a-01"
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
id: "shr-ekopod-a-01"
title: "Sada A · Kapitola 01"
chapter: "1. Podniková ekonomika, podnik, klasifikace podniků"
order: 100
tags:
  - "podnik"
  - "podniková-ekonomika"
relatedQuestionIds:
  - "ekopod-a-0101"
  - "ekopod-a-0102"
description: "Přehledová osa první kapitoly pro sadu A."
---
# Sada A · Kapitola 01

...
```

## Centralizace cest a validace

Veškeré root cesty k obsahu jsou centralizované v [`src/lib/content/paths.ts`](./src/lib/content/paths.ts).

Loader a validace jsou v:

- [`src/lib/content/loader.ts`](./src/lib/content/loader.ts)
- [`src/lib/content/parser.ts`](./src/lib/content/parser.ts)
- [`src/lib/content/validator.ts`](./src/lib/content/validator.ts)

Aplikace se při chybějícím nebo nevalidním obsahu nerozpadne:

- chybějící PDF zobrazí čitelné upozornění a fallback
- nevalidní frontmatter označí otázku nebo souhrn jako nevalidní
- detail problému vypíše do vývojové konzole
- prázdná sada nebo kapitola zobrazí bezpečný empty state
- poškozený lokální progress se resetuje do použitelného stavu

## Jak doplnit vlastní obsah

1. Nahraj PDF do `content/pdf`.
2. Přidej markdown otázky do `content/questions/<set>/`.
3. Přidej markdown souhrny do `content/summaries/`.
4. Dodrž frontmatter a názvy sekcí.
5. Restartuj `npm run dev`, pokud přidáváš nové soubory za běhu Vite.

Názvy kapitol, sad, tagů ani summary vazby nejsou hardcoded v komponentách. UI se opírá o metadata načtená z obsahu.

## Generování sady A

V repo je pomocný skript:

```bash
python scripts/generate_set_a_content.py
```

Ten znovu vygeneruje:

- `content/questions/set-a`
- `content/summaries`

Skript předpokládá, že PDF `ekopod-skripta-2024.pdf` už leží v `content/pdf`.

## Testy

Základní test suite pokrývá:

- parser a validaci obsahu
- základní flashcard flow
- validitu markdown souborů v `content/questions` a `content/summaries`

## Hlavní adresáře v kódu

- [`src/components`](./src/components): UI komponenty
- [`src/routes`](./src/routes): hlavní režimy aplikace
- [`src/store`](./src/store): lokální persistovaný store
- [`src/lib/content`](./src/lib/content): loader, parser, validace, session logika
- [`src/providers`](./src/providers): content provider
- [`src/types`](./src/types): datové typy

## Poznámka

Repo je připravený tak, aby šlo obsah měnit bez zásahu do kódu. Pro aktuální stav je hotová pouze **sada A**; další sady můžeš doplnit stejným formátem.
