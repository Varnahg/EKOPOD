from __future__ import annotations

from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
CONTENT_ROOT = ROOT / "content"
QUESTIONS_ROOT = CONTENT_ROOT / "questions"
SUMMARIES_ROOT = CONTENT_ROOT / "summaries"
PDF_ROOT = CONTENT_ROOT / "pdf"
PDF_NAME = "ekopod-skripta-2024.pdf"
SAMPLE_PDF_NAME = "ekopod-skripta-sample.pdf"


def q(
    slug: str,
    subchapter: str,
    title: str,
    pages: list[int],
    sections: list[str],
    tags: list[str],
    prompt: str,
    points: list[str],
    detail: str,
    pitfalls: list[str],
    example: str,
    summary_hint: str,
    difficulty: int = 1,
) -> dict[str, object]:
    return {
        "slug": slug,
        "subchapter": subchapter,
        "title": title,
        "pages": pages,
        "sections": sections,
        "tags": tags,
        "prompt": prompt,
        "points": points,
        "detail": detail,
        "pitfalls": pitfalls,
        "example": example,
        "summary_hint": summary_hint,
        "difficulty": difficulty,
    }


CHAPTERS: list[dict[str, object]] = [
    {
        "number": 1,
        "slug": "podnikova-ekonomika-a-podnik",
        "title": "1. Podniková ekonomika, podnik, klasifikace podniků",
        "summary_description": "Přehledová osa první kapitoly pro sadu A.",
        "summary_tags": ["podnik", "podniková-ekonomika", "právní-formy", "klasifikace"],
        "key_points": [
            "Podniková ekonomika zkoumá podnik jako celek, jeho vstupy, výstupy, cíle a vztahy k okolí.",
            "Je potřeba rozlišit podnik, závod, obchodní závod, podnikatele a podnikání.",
            "Podniky se třídí podle právní formy, sektoru, odvětví, působnosti a velikosti.",
        ],
        "memory_chain": [
            "Nejprve si srovnej, co zkoumá podniková ekonomika a proč je praktická.",
            "Pak odděl osobu podnikatele, činnost podnikání a majetkový celek závodu.",
            "Nakonec si ujasni základní klasifikace podniků a proč se používají.",
        ],
        "common_confusions": [
            "Podnik není totéž co podnikání.",
            "Právní forma neříká nic o odvětví nebo sektoru.",
            "Velikost podniku se neurčuje jen počtem zaměstnanců.",
        ],
        "questions": [
            q(
                "predmet-podnikove-ekonomiky",
                "1.1 Předmět podnikové ekonomiky",
                "Co zkoumá podniková ekonomika a proč je pro podnik praktická?",
                [9],
                ["1.1"],
                ["podniková-ekonomika", "podnik", "řízení"],
                "Vysvětli, co je předmětem podnikové ekonomiky a proč je důležitá pro reálné řízení podniku.",
                [
                    "Zkoumá procesy uvnitř podniku a přeměnu vstupů na výstupy.",
                    "Sleduje efektivnost podnikových činností a vztahy podniku k okolí.",
                    "Je praktická, protože pomáhá rozhodovat o výrobě, financování, organizaci i výkonnosti.",
                ],
                "U ústní zkoušky je silné dodat, že nejde jen o teorii. Podniková ekonomika dává návod, jak podnik řídit hospodárně a konkurenceschopně.",
                [
                    "Nepleť si podnikovou ekonomiku s makroekonomií.",
                    "Neomezuj odpověď jen na účetnictví nebo finance.",
                ],
                "Když podnik plánuje výrobu nebo investici, podniková ekonomika propojuje zdroje, cíle, náklady i očekávané výsledky.",
                "Podniková ekonomika = jak podnik funguje, hospodaří a rozhoduje.",
            ),
            q(
                "podnik-zavod-a-podnikani",
                "1.2 Základní pojmy ve vztahu k podniku a podnikání",
                "Jak odlišit podnik, závod, obchodní závod, podnikatele a podnikání?",
                [10, 11],
                ["1.2", "1.2.1", "1.2.2", "1.2.3"],
                ["podnik", "závod", "podnikání"],
                "Stručně vylož základní pojmy kolem podniku a ukaž, co označuje osobu, co činnost a co majetkový celek.",
                [
                    "Podnikatel je osoba, která samostatně podniká na vlastní účet a odpovědnost za účelem zisku.",
                    "Podnikání je soustavná výdělečná činnost směřující k dosažení zisku.",
                    "Obchodní závod je organizovaný soubor jmění sloužící k provozu činnosti; ekonomie často používá širší pojem podnik.",
                ],
                "Pomůže jednoduché schéma: osoba = podnikatel, činnost = podnikání, majetkový celek = závod. Ekonomický pojem podnik je širší než čistě právní terminologie.",
                [
                    "Podnik a podnikatel nejsou totéž.",
                    "Podnikání není jen založení firmy, ale průběžná činnost.",
                ],
                "Jedna s.r.o. je podnikatel, její obchodní závod je soubor majetku a činnost, kterou vykonává, je podnikání.",
                "Osoba = podnikatel, činnost = podnikání, majetkový celek = závod.",
            ),
            q(
                "pravni-formy-podniku",
                "1.3.1 Právní formy společností",
                "Jaké jsou základní právní formy podnikání a v čem se liší?",
                [12, 15],
                ["1.3.1"],
                ["právní-formy", "s.r.o.", "a.s."],
                "Vyjmenuj hlavní právní formy podnikání a stručně řekni, čím se liší z hlediska ručení, kapitálu a vazby společníků na podnik.",
                [
                    "Základní rozdíl je mezi podnikáním fyzické osoby a právnickými osobami, zejména obchodními korporacemi.",
                    "Osobní společnosti mají silnější vazbu na společníky a širší ručení, kapitálové společnosti více oddělují vlastnictví od řízení.",
                    "Právní forma ovlivňuje ručení, požadavky na kapitál, správu firmy i administrativní náročnost.",
                ],
                "V sadě A není nutné memorovat každý detail, ale musí být jasné, proč je právní forma důležitá pro riziko a fungování podniku.",
                [
                    "Nehodnoť právní formy jen podle výše základního kapitálu.",
                    "Nezapomeň zmínit rozdíl mezi osobními a kapitálovými společnostmi.",
                ],
                "Rodinný podnik často volí s.r.o., zatímco rozsáhlejší podnik může fungovat jako a.s. kvůli kapitálovým potřebám.",
                "Právní forma určuje ručení, kapitál a vztah vlastníků k řízení.",
                2,
            ),
            q(
                "sektory-a-cz-nace",
                "1.3.2 a 1.3.3 Třídění podniku podle sektoru a CZ-NACE",
                "Jak se podniky třídí podle sektoru národního hospodářství a podle CZ-NACE?",
                [15, 17],
                ["1.3.2", "1.3.3"],
                ["sektory", "CZ-NACE", "odvětví"],
                "Popiš základní sektorové členění podniků a vysvětli, k čemu slouží klasifikace CZ-NACE.",
                [
                    "Sektorové členění rozlišuje primární, sekundární, terciární a nověji i kvartérní či kvintérní sektor.",
                    "CZ-NACE je klasifikace ekonomických činností podle hlavní ekonomické aktivity subjektu.",
                    "Třídění pomáhá statistice, evidenci, analýze trhu i některým dotačním nebo regulačním pravidlům.",
                ],
                "U přehledové odpovědi ukaž rozdíl mezi širokým pohledem na sektor a detailnějším odvětvovým zařazením přes CZ-NACE.",
                [
                    "Nezaměňuj sektor s právní formou.",
                    "CZ-NACE není velikostní ani kapitálová kategorie.",
                ],
                "Výrobní firma patří do sekundárního sektoru a současně má konkrétní klasifikaci CZ-NACE podle své hlavní činnosti.",
                "Sektor říká, kde podnik působí; CZ-NACE přesněji, co je jeho hlavní činnost.",
            ),
            q(
                "velikost-podniku",
                "1.3.5 Podle velikosti",
                "Podle čeho se určuje velikost podniku?",
                [17, 19],
                ["1.3.5"],
                ["velikost-podniku", "MSP", "účetní-jednotka"],
                "Vysvětli, podle jakých kritérií se určuje velikost podniku a proč existují různé metodiky.",
                [
                    "Velikost podniku se obvykle hodnotí podle počtu zaměstnanců, obratu a bilanční sumy.",
                    "Metodika EU slouží zejména pro podporu a rozlišení mikro, malých a středních podniků.",
                    "České účetnictví používá vlastní velikostní kategorie, které ovlivňují účetní povinnosti a rozsah vykazování.",
                ],
                "Silná odpověď ukáže, že velikost není jen jedno číslo, ale kombinace několika hledisek a také účelu, pro který velikost vyhodnocujeme.",
                [
                    "Nevystačíš si jen s počtem zaměstnanců.",
                    "Nesměšovat metodiku EU s kategoriemi dle českého účetnictví.",
                ],
                "Podnik může mít relativně málo zaměstnanců, ale vysoký obrat, a tím spadnout do jiné kategorie než by naznačoval jen počet lidí.",
                "Velikost podniku = zaměstnanci + obrat + aktiva; metodika závisí na účelu.",
                2,
            ),
        ],
    },
    {
        "number": 2,
        "slug": "dlouhodoby-majetek-a-odepisovani",
        "title": "2. Dlouhodobý majetek a jeho odepisování",
        "summary_description": "Přehled druhů dlouhodobého majetku a logiky odpisů.",
        "summary_tags": ["majetek", "odpisy", "aktiva", "oceňování"],
        "key_points": [
            "Dlouhodobý majetek slouží déle než jeden rok a během používání se opotřebovává.",
            "Dělí se na hmotný, nehmotný a finanční majetek a musí být správně oceněn.",
            "Odpisy postupně přenášejí hodnotu majetku do nákladů a mohou mít účetní i daňový režim.",
        ],
        "memory_chain": [
            "Nejprve si srovnej postavení aktiv v rozvaze a rozdíl proti oběžnému majetku.",
            "Pak odděl DHM, DNM a DFM.",
            "Nakonec vysvětli ocenění a smysl odpisů.",
        ],
        "common_confusions": [
            "Nákup majetku není totéž co náklad období.",
            "Účetní a daňové odpisy neslouží stejnému cíli.",
            "Neodepisuje se všechen dlouhodobý majetek stejně.",
        ],
        "questions": [
            q(
                "aktiva-v-rozvaze-a-dm",
                "2.1 a 2.2 Aktiva v rozvaze a dlouhodobý majetek",
                "Co ukazuje rozvaha a kde v ní stojí dlouhodobý majetek?",
                [21, 22],
                ["2.1", "2.2"],
                ["rozvaha", "aktiva", "dlouhodobý-majetek"],
                "Vysvětli, co rozvaha zobrazuje a jaké místo v ní má dlouhodobý majetek.",
                [
                    "Rozvaha ukazuje na jedné straně strukturu majetku a na druhé zdroje jeho krytí.",
                    "Dlouhodobý majetek je součástí aktiv a slouží podniku déle než jeden rok.",
                    "Od oběžného majetku se liší delší dobou použitelnosti a postupným opotřebováním místo jednorázové spotřeby.",
                ],
                "Pomůže jednoduché schéma: aktiva odpovídají na otázku co podnik má, pasiva odkud na to vzal zdroje. Dlouhodobý majetek patří mezi stěžejní aktiva.",
                [
                    "Nezaměňuj aktiva a pasiva.",
                    "Dlouhodobý majetek není totéž co oběžný majetek.",
                ],
                "Stroj, budova nebo licence se v rozvaze vykazují jako aktiva, protože představují majetek podniku sloužící jeho činnosti.",
                "Rozvaha ukazuje majetek a jeho zdroje; dlouhodobý majetek patří mezi aktiva.",
            ),
            q(
                "druhy-dlouhodobeho-majetku",
                "2.2.1 až 2.2.3 Druhy dlouhodobého majetku",
                "Jaké jsou základní druhy dlouhodobého majetku?",
                [22],
                ["2.2.1", "2.2.2", "2.2.3"],
                ["DHM", "DNM", "DFM"],
                "Rozděl dlouhodobý majetek na hmotný, nehmotný a finanční a u každého uveď podstatu.",
                [
                    "Dlouhodobý hmotný majetek tvoří budovy, stroje, zařízení nebo dopravní prostředky.",
                    "Dlouhodobý nehmotný majetek zahrnuje například software, licence, patenty nebo goodwill.",
                    "Dlouhodobý finanční majetek představují dlouhodobé cenné papíry, podíly nebo zápůjčky s delší splatností.",
                ],
                "U přehledové odpovědi je nejdůležitější ukázat, že nejde jen o fyzické věci. I nehmotná práva a dlouhodobé finanční investice patří do dlouhodobého majetku.",
                [
                    "Nezařazuj zásoby mezi dlouhodobý majetek.",
                    "Neomezuj nehmotný majetek jen na software.",
                ],
                "Výrobní hala je DHM, patent DNM a dlouhodobý podíl v jiné společnosti DFM.",
                "Dlouhodobý majetek může být hmotný, nehmotný i finanční.",
            ),
            q(
                "ocenovani-dlouhodobeho-majetku",
                "2.3 Oceňování dlouhodobého majetku",
                "Jak se oceňuje dlouhodobý majetek a proč je to důležité?",
                [23],
                ["2.3"],
                ["oceňování", "pořizovací-cena", "vlastní-náklady"],
                "Řekni, jakými základními způsoby se oceňuje dlouhodobý majetek a proč správné ocenění hraje důležitou roli.",
                [
                    "Používá se pořizovací cena, reprodukční pořizovací cena, vlastní náklady nebo nominální hodnota podle charakteru majetku.",
                    "Správné ocenění je důležité pro věrný obraz majetku v účetnictví.",
                    "Na vstupní ocenění navazují odpisy i další finanční a daňové souvislosti.",
                ],
                "V sadě A stačí držet hlavní logiku: majetek se musí ocenit tak, aby účetnictví odpovídalo realitě a aby z něj bylo možné správně odpisovat.",
                [
                    "Není pravda, že všechen majetek má jen jednu univerzální vstupní cenu.",
                    "Nezapomeň propojit ocenění s odpisy a vykazováním.",
                ],
                "Kupovaný stroj se oceňuje pořizovací cenou, darovaný majetek může vyžadovat reprodukční pořizovací cenu.",
                "Vstupní ocenění určuje, z jaké hodnoty se majetek dále vykazuje a odpisuje.",
            ),
            q(
                "podstata-odpisu",
                "2.4.1 Podstata odpisů obecně",
                "Jaká je podstata odpisů dlouhodobého majetku?",
                [23, 24],
                ["2.4", "2.4.1"],
                ["odpisy", "opotřebení", "náklady"],
                "Vysvětli, co odpisy vyjadřují a proč se používají u dlouhodobého majetku.",
                [
                    "Odpisy vyjadřují postupné opotřebení dlouhodobého majetku během jeho používání.",
                    "Přenášejí hodnotu majetku do nákladů postupně v čase, ne jednorázově při pořízení.",
                    "Pomáhají správně rozložit náklady do období, kdy majetek podniku skutečně slouží.",
                ],
                "Tohle je oblíbená zkoušková otázka. Jedna věta, která funguje: odpis není výdaj, ale účetní vyjádření postupné spotřeby hodnoty majetku.",
                [
                    "Nezaměňuj odpis se splátkou úvěru.",
                    "Neříkej, že odpis automaticky znamená odtok peněz v daném období.",
                ],
                "Výrobní linka stojí velkou částku při pořízení, ale do nákladů vstupuje postupně přes odpisy po dobu používání.",
                "Odpis = postupné přenášení hodnoty majetku do nákladů.",
            ),
            q(
                "ucetni-a-danove-odpisy",
                "2.4.2 a 2.4.3 Účetní a daňové odpisy, neodepisovaný majetek",
                "Jaký je rozdíl mezi účetními a daňovými odpisy a co se neodepisuje?",
                [26, 28],
                ["2.4.2", "2.4.3"],
                ["účetní-odpisy", "daňové-odpisy", "neodepisovaný-majetek"],
                "Porovnej účetní a daňové odpisy a stručně vysvětli, proč se některý majetek neodepisuje.",
                [
                    "Účetní odpisy mají co nejvěrněji zachytit opotřebení majetku v účetnictví.",
                    "Daňové odpisy vycházejí ze zákonných pravidel a slouží pro daňový základ.",
                    "Některé položky, například typicky pozemky, se standardně neodepisují, protože se jejich hodnota neopotřebovává stejným způsobem.",
                ],
                "V přehledové odpovědi nemusíš zabíhat do všech technických detailů. Důležité je oddělit ekonomický smysl účetních odpisů od pravidel daňových odpisů.",
                [
                    "Účetní a daňové odpisy nemusí být stejné.",
                    "Neodepisovaný majetek neznamená bezcenný majetek.",
                ],
                "Podnik může účetně odepisovat majetek podle skutečného využití, ale daňově jen podle zákonných pravidel.",
                "Účetní odpisy = věrný obraz, daňové odpisy = zákonný daňový režim.",
                2,
            ),
        ],
    },
    {
        "number": 3,
        "slug": "obezny-majetek-a-pracovni-kapital",
        "title": "3. Oběžný majetek (pracovní kapitál)",
        "summary_description": "Přehled oběžného majetku, zásob a provozních cyklů.",
        "summary_tags": ["oběžný-majetek", "pracovní-kapitál", "zásoby", "OCP"],
        "key_points": [
            "Oběžný majetek tvoří zásoby, pohledávky, krátkodobý finanční majetek a peněžní prostředky.",
            "Jeho úlohou je zajistit plynulý provoz i likviditu podniku.",
            "Důležitá je velikost zásob, provozní cyklus a způsob financování oběžných aktiv.",
        ],
        "memory_chain": [
            "Nejprve si srovnej, co všechno do oběžného majetku patří.",
            "Pak se zaměř na zásoby, jejich funkce a oceňování.",
            "Nakonec vysvětli provozní cyklus, OCP a financování provozu.",
        ],
        "common_confusions": [
            "Oběžný majetek není totéž co dlouhodobý majetek.",
            "Cash conversion cycle není výkaz cash flow.",
            "Zásoby nejsou jen materiál ve skladu.",
        ],
        "questions": [
            q(
                "co-tvori-obezny-majetek",
                "3.1 Věcné členění oběžného majetku",
                "Co tvoří oběžný majetek a proč je důležitý?",
                [31, 32],
                ["3.1"],
                ["oběžný-majetek", "pracovní-kapitál", "aktiva"],
                "Vymez oběžný majetek a uveď, jaké hlavní položky do něj patří.",
                [
                    "Oběžný majetek je krátkodobý majetek, který se spotřebovává nebo rychle obrací v provozu.",
                    "Patří sem zásoby, pohledávky, krátkodobý finanční majetek a peněžní prostředky.",
                    "Je důležitý pro plynulý provoz podniku a pro jeho likviditu.",
                ],
                "U přehledové odpovědi stačí zdůraznit rozdíl proti dlouhodobému majetku: oběžný majetek se v podniku rychleji mění a vstupuje do každodenního provozu.",
                [
                    "Nezařazuj mezi oběžný majetek budovy nebo stroje.",
                    "Neomezuj oběžný majetek jen na hotovost a zásoby.",
                ],
                "V obchodní firmě tvoří oběžný majetek například zboží na skladě, pohledávky za odběrateli i peníze na bankovním účtu.",
                "Oběžný majetek zajišťuje běžný provoz a rychle se obrací.",
            ),
            q(
                "zasoby-a-jejich-funkce",
                "3.1 a 3.3 Zásoby a jejich význam",
                "Jaké druhy zásob podnik sleduje a jaké mají funkce?",
                [31, 33],
                ["3.1", "3.3"],
                ["zásoby", "funkce-zásob", "řízení-zásob"],
                "Popiš základní druhy zásob a řekni, proč je podnik drží, ale zároveň nemůže držet bez omezení.",
                [
                    "Mezi zásoby patří materiál, nedokončená výroba, polotovary, hotové výrobky, zboží a v některých podnicích i zvířata.",
                    "Zásoby zajišťují kontinuitu výroby a prodeje, mají provozní, likvidní i rezervní funkci.",
                    "Příliš velké zásoby ale vážou kapitál, zvyšují náklady a mohou se znehodnotit.",
                ],
                "Silná odpověď vždy spojuje přínos a náklad. Zásoby chrání provoz, ale současně blokují peníze, které by šlo použít jinak.",
                [
                    "Neříkej, že více zásob je vždy lepší.",
                    "Nezapomeň, že zásobou není jen materiál pro výrobu.",
                ],
                "Podnik si drží pojistnou zásobu materiálu kvůli výkyvům dodávek, ale nesmí ji nechat přerůst do zbytečně drahého skladu.",
                "Zásoby chrání provoz, ale současně vážou kapitál.",
            ),
            q(
                "ocenovani-obezneho-majetku",
                "3.2 Oceňování oběžného majetku",
                "Jak se oceňuje oběžný majetek?",
                [33],
                ["3.2"],
                ["oceňování", "zásoby", "pohledávky"],
                "Shrň, jak se oceňují zásoby, pohledávky a peněžní prostředky a proč je to důležité.",
                [
                    "Zásoby se oceňují podobně jako dlouhodobý majetek, například pořizovací cenou, reprodukční pořizovací cenou nebo vlastními náklady.",
                    "Pohledávky se obvykle oceňují jmenovitou hodnotou nebo pořizovací cenou při nabytí.",
                    "Peněžní prostředky a krátkodobý finanční majetek se vedou v peněžním vyjádření a u cizích měn se přepočítávají.",
                ],
                "Na úrovni sady A stačí chápat, že ocenění ovlivňuje věrný obraz majetku a tím i další analýzy, například likviditu nebo výsledek hospodaření.",
                [
                    "Nepřehlížej, že oběžný majetek se mění rychleji než dlouhodobý.",
                    "Neříkej, že všechen oběžný majetek má stejný způsob ocenění.",
                ],
                "Když podnik nadhodnotí zásoby nebo pohledávky, může si opticky vylepšit majetkovou i finanční situaci.",
                "Ocenění oběžného majetku ovlivňuje, jak realisticky podnik vypadá v účetnictví.",
            ),
            q(
                "provozni-cyklus-a-ocp",
                "3.4 a 3.5 Provozní cyklus a obratový cyklus peněz",
                "Co je provozní cyklus a obratový cyklus peněz?",
                [34, 35],
                ["3.4", "3.5", "3.5.1"],
                ["provozní-cyklus", "OCP", "cash-conversion-cycle"],
                "Vysvětli, jak v podniku obíhají peníze přes zásoby a pohledávky a proč to podnik musí sledovat.",
                [
                    "Provozní cyklus popisuje cestu peněz do zásob, výroby, prodeje a pohledávek a zpět do peněžních prostředků.",
                    "Obratový cyklus peněz měří dobu, po kterou jsou peníze v provozu vázány, než se vrátí jako inkaso.",
                    "Čím delší je cyklus, tím větší potřebu financování pracovního kapitálu podnik má.",
                ],
                "Pomůže jednoduché schéma: peníze -> zásoby -> výroba nebo prodej -> pohledávka -> inkaso. Pak dodej, že délka tohoto cyklu rozhoduje o tlaků na financování provozu.",
                [
                    "Nezaměňuj OCP s výkazem cash flow.",
                    "Nezapomeň, že delší cyklus znamená vyšší kapitálovou potřebu.",
                ],
                "Firma zaplatí materiál dnes, ale odběratel zaplatí až za dva měsíce; mezitím musí podnik provoz nějak financovat.",
                "Čím déle peníze obíhají přes zásoby a pohledávky, tím větší tlak je na financování provozu.",
                2,
            ),
            q(
                "financovani-obeznych-aktiv",
                "3.6 a 3.7 Financování oběžných aktiv a management zásob",
                "Jak se financuje oběžný majetek a proč podnik řídí zásoby diferencovaně?",
                [37, 40],
                ["3.6", "3.7"],
                ["financování", "management-zásob", "ABC"],
                "Shrň, jak podnik financuje oběžná aktiva a proč při řízení zásob rozlišuje jejich význam.",
                [
                    "Oběžná aktiva mohou být kryta stabilnějšími dlouhodobými zdroji i krátkodobými závazky podle charakteru potřeby.",
                    "Řízení zásob hledá rovnováhu mezi dostupností zásob a náklady na jejich držení.",
                    "Různě významné zásoby se sledují různě pečlivě, aby podnik věnoval největší pozornost položkám s největším dopadem.",
                ],
                "Na přehledové úrovni stačí chápat, že ne všechno lze řídit stejně podrobně. Klíčové a drahé položky si zaslouží víc pozornosti než marginální zásoby.",
                [
                    "Neříkej, že provoz lze bezpečně financovat jen krátkodobě.",
                    "Nezapomeň, že důležitost zásob se liší podle jejich hodnoty a významu pro provoz.",
                ],
                "Podnik detailně hlídá kritické zásoby s vysokým podílem na spotřebě, zatímco drobné běžné položky spravuje jednodušeji.",
                "Financování provozu a řízení zásob rozhoduje o likviditě i hospodárnosti.",
                2,
            ),
        ],
    },
    {
        "number": 4,
        "slug": "kapital-podniku-pasiva",
        "title": "4. Kapitál podniku – pasiva",
        "summary_description": "Přehled zdrojů financování podniku a jejich ceny.",
        "summary_tags": ["kapitál", "pasiva", "WACC", "finanční-páka"],
        "key_points": [
            "Pasiva vyjadřují zdroje krytí majetku podniku.",
            "Podnik používá vlastní a cizí zdroje, které se liší rizikem, cenou i splatností.",
            "Kapitálová struktura, finanční páka a náklady kapitálu ovlivňují výkonnost i stabilitu podniku.",
        ],
        "memory_chain": [
            "Nejprve ukaž, co jsou pasiva a jak souvisejí s aktivy.",
            "Pak odděl vlastní a cizí zdroje a jejich členění.",
            "Nakonec vysvětli cenu kapitálu, finanční páku a kapitálovou strukturu.",
        ],
        "common_confusions": [
            "Pasiva nejsou majetek, ale zdroje jeho krytí.",
            "Cizí kapitál není automaticky špatný, ale nese splatnost a riziko.",
            "WACC není jen úrok z jednoho úvěru.",
        ],
        "questions": [
            q(
                "co-jsou-pasiva",
                "4.1 Dělení kapitálových zdrojů",
                "Co jsou pasiva a jak souvisejí s kapitálem podniku?",
                [43],
                ["4.1"],
                ["pasiva", "kapitál", "zdroje-financování"],
                "Vysvětli, co v podniku znamenají pasiva a proč je spojujeme se zdroji financování aktiv.",
                [
                    "Pasiva ukazují, z čeho byl majetek pořízen, tedy jaké zdroje kryjí aktiva podniku.",
                    "Zahrnují vlastní zdroje i cizí zdroje financování.",
                    "Pomáhají hodnotit finanční strukturu, zadlužení a stabilitu podniku.",
                ],
                "Silná odpověď propojí rozvahu: aktiva říkají co podnik má, pasiva odkud vzal prostředky na pořízení tohoto majetku.",
                [
                    "Nezaměňuj pasiva s aktivy.",
                    "Neříkej, že pasiva jsou pouze dluhy.",
                ],
                "Výrobní hala je aktivum, ale v pasivech se ukáže, jestli byla kryta vlastním kapitálem nebo úvěrem.",
                "Pasiva odpovídají na otázku, z čeho je majetek financován.",
            ),
            q(
                "vlastni-a-cizi-zdroje",
                "4.1.1 až 4.1.3 Členění zdrojů",
                "Jak se dělí vlastní a cizí zdroje financování?",
                [44, 45],
                ["4.1.1", "4.1.2", "4.1.3"],
                ["vlastní-kapitál", "cizí-kapitál", "splatnost"],
                "Rozděl zdroje financování podniku podle původu, vlastnictví a splatnosti.",
                [
                    "Vlastní kapitál tvoří zdroje patřící vlastníkům a nese podnikatelské riziko.",
                    "Cizí kapitál představují půjčené zdroje, které mají cenu a obvykle i splatnost.",
                    "Zdroje lze dále dělit podle původu na interní a externí a podle splatnosti na krátkodobé a dlouhodobé.",
                ],
                "V sadě A jde hlavně o srozumitelné třídění. Každé hledisko vysvětluje jinou vlastnost zdroje: odkud je, komu patří a kdy se musí vrátit.",
                [
                    "Neomezuj cizí kapitál jen na bankovní úvěr.",
                    "Nezapomeň na hledisko splatnosti zdrojů.",
                ],
                "Dodavatelský úvěr je cizí zdroj krátkodobý, zatímco nerozdělený zisk je interně vytvořený vlastní zdroj.",
                "Vlastní kapitál nese riziko, cizí kapitál má cenu a splatnost.",
            ),
            q(
                "financni-paka",
                "4.2 Finanční páka",
                "Co je finanční páka a kdy působí pozitivně či negativně?",
                [46],
                ["4.2"],
                ["finanční-páka", "zadlužení", "rentabilita"],
                "Jednoduše vysvětli princip finanční páky a podmínku, kdy dluh zvyšuje nebo snižuje výnosnost vlastního kapitálu.",
                [
                    "Finanční páka vyjadřuje, jak použití cizího kapitálu ovlivní výnosnost vlastního kapitálu.",
                    "Působí pozitivně, pokud výnosnost aktiv převyšuje cenu cizího kapitálu.",
                    "Při nevhodném zadlužení naopak zvyšuje finanční riziko a může výnosnost zhoršit.",
                ],
                "Pomáhá krátká věta: dluh se vyplatí jen tehdy, když na investovaných prostředcích podnik vydělá víc, než kolik za dluh platí.",
                [
                    "Vyšší zadlužení není automaticky výhodou.",
                    "Nezapomeň zmínit i růst rizika spojený s dluhem.",
                ],
                "Podnik si půjčí za 6 %, ale vydělává na aktivech 10 %; rozdíl může zvýšit výnosnost vlastního kapitálu.",
                "Finanční páka funguje jen tehdy, když výnos z aktiv převýší cenu dluhu.",
                2,
            ),
            q(
                "naklady-na-kapital",
                "4.3 a 4.4 Náklady na kapitál a vztah IRR a WACC",
                "Co jsou náklady na kapitál a proč je důležitý WACC?",
                [47, 49],
                ["4.3", "4.3.1", "4.3.2", "4.4"],
                ["náklady-na-kapitál", "WACC", "IRR"],
                "Shrň, co znamenají náklady na vlastní a cizí kapitál a proč se při investicích sleduje WACC.",
                [
                    "Cizí kapitál má cenu například v podobě úroku, vlastní kapitál v podobě požadovaného výnosu vlastníků.",
                    "WACC je vážený průměr nákladů na celý kapitál podniku.",
                    "Při hodnocení investic se WACC používá jako minimální požadovaná výnosnost, se kterou se porovnává výnos projektu nebo IRR.",
                ],
                "V sadě A není nutné počítat vzorce. Musí ale být jasné, že kapitál není zdarma a že investice má vydělat alespoň to, co kapitál stojí.",
                [
                    "WACC není jen úrok z úvěru.",
                    "Vlastní kapitál také není bez nákladů.",
                ],
                "Když projekt vydělává méně než vážené náklady kapitálu, podnik tím vlastníkům hodnotu nepřidává.",
                "WACC je hranice, kterou by měla investice překonat.",
                2,
            ),
            q(
                "kapitalova-struktura",
                "4.5 a 4.6 Kapitálová struktura a použití cizího kapitálu",
                "Co je kapitálová struktura a jaké jsou výhody a nevýhody cizího kapitálu?",
                [50, 52],
                ["4.5", "4.5.1", "4.6", "4.6.1", "4.6.2"],
                ["kapitálová-struktura", "cizí-kapitál", "bilanční-pravidla"],
                "Vysvětli, proč podnik hledá vhodnou kombinaci vlastního a cizího kapitálu a jak s tím souvisí bilanční pravidla.",
                [
                    "Kapitálová struktura vyjadřuje poměr vlastních a cizích zdrojů financování podniku.",
                    "Cizí kapitál může být levnější a umožnit rychlejší rozvoj, ale přináší splatnost a tlak na stabilitu.",
                    "Bilanční pravidla upozorňují, že dlouhodobý majetek má být kryt dostatečně stabilními zdroji.",
                ],
                "Dobrá přehledová odpověď ukáže, že neexistuje jedno univerzální číslo. Optimální struktura závisí na oboru, stabilitě příjmů a riziku.",
                [
                    "Neříkej, že nejlepší je vždy co nejvíce vlastního kapitálu.",
                    "Nezapomeň na soulad mezi dobou vázanosti majetku a zdrojů jeho krytí.",
                ],
                "Výrobní podnik s velkým dlouhodobým majetkem potřebuje stabilnější financování než obchod s rychlou obrátkou zásob.",
                "Kapitálová struktura hledá rovnováhu mezi cenou kapitálu, výnosem a rizikem.",
                2,
            ),
        ],
    },
    {
        "number": 5,
        "slug": "investice-a-jejich-hodnoceni",
        "title": "5. Investice a jejich hodnocení",
        "summary_description": "Přehled investic, investičních projektů a hodnocení jejich přínosu.",
        "summary_tags": ["investice", "projekt", "NPV", "IRR"],
        "key_points": [
            "Investice jsou výdaje směřující k budoucím přínosům v delším časovém horizontu.",
            "Podnik investice třídí podle majetku i podle vztahu k rozvoji podniku.",
            "Investice je nutné plánovat, financovat a hodnotit statickými i dynamickými metodami.",
        ],
        "memory_chain": [
            "Nejdřív vylož, co je investice v makro a podnikovém pojetí.",
            "Pak ukaž typy investic a fáze investičního projektu.",
            "Nakonec vysvětli financování a hodnocení investic.",
        ],
        "common_confusions": [
            "Investice není běžná provozní spotřeba.",
            "Statické metody neberou časovou hodnotu peněz.",
            "Výhodné financování ještě samo o sobě nedělá investici dobrou.",
        ],
        "questions": [
            q(
                "co-je-investice",
                "5.1 Klasifikace investic",
                "Co je investice v makroekonomickém a podnikovém pojetí?",
                [54, 55],
                ["5.1", "5.1.1", "5.1.2"],
                ["investice", "makroekonomie", "podnikové-pojetí"],
                "Vymez pojem investice a ukaž rozdíl mezi makroekonomickým a podnikovým pohledem.",
                [
                    "Makroekonomicky jde o tvorbu kapitálových statků a budoucí růst produkční kapacity ekonomiky.",
                    "Podnikově se investice chápe jako rozsáhlejší výdaj s očekávaným budoucím peněžním nebo jiným přínosem v delším období.",
                    "Investice je spojena s časem, rizikem a očekáváním budoucího efektu.",
                ],
                "Na zkoušce funguje jednoduché rozlišení: makro pohled řeší ekonomiku jako celek, podnikový pohled konkrétní rozhodnutí firmy o dlouhodobém výdaji.",
                [
                    "Neoznačuj každou běžnou spotřebu za investici.",
                    "Nezapomeň na delší časový horizont a budoucí přínos.",
                ],
                "Nákup nové výrobní linky je podnikovou investicí, která má firmě přinášet přínosy více let.",
                "Investice = dnešní výdaj kvůli budoucímu přínosu.",
            ),
            q(
                "cleneni-investic",
                "5.2 Členění investic",
                "Jak lze investice členit?",
                [55, 56],
                ["5.2", "5.2.1", "5.2.2"],
                ["členění-investic", "hmotné-investice", "rozvojové-investice"],
                "Shrň hlavní způsoby členění investic a proč podnik rozlišuje obnovovací, rozvojové nebo regulatorní investice.",
                [
                    "Investice lze členit účetně podle druhu majetku na hmotné, nehmotné a finanční.",
                    "Z hlediska rozvoje podniku se rozlišují například regulatorní, obnovovací a rozvojové investice.",
                    "Členění pomáhá určit účel investice, její přínos a vhodný způsob hodnocení.",
                ],
                "Silná odpověď propojí druh majetku s tím, k čemu má investice sloužit. Přehledová sada A chce hlavně orientaci v logice členění.",
                [
                    "Neomezuj členění investic jen na hmotné vs. nehmotné.",
                    "Nezapomeň na vztah investice k růstu nebo udržení provozu.",
                ],
                "Výměna starého stroje je typicky obnovovací investice, zatímco nová výrobní hala rozvojová.",
                "Investice se třídí podle toho, do čeho směřují a jaký mají cíl.",
            ),
            q(
                "investicni-cinnost-a-faze-projektu",
                "5.3 až 5.5 Charakteristika investiční činnosti a fáze projektu",
                "Jaké jsou základní rysy investiční činnosti a fáze investičního projektu?",
                [56, 63],
                ["5.3", "5.5", "5.5.1", "5.5.2", "5.5.3"],
                ["investiční-projekt", "fáze", "riziko"],
                "Popiš, proč je investiční činnost specifická a jaké fáze má investiční projekt.",
                [
                    "Investiční činnost je dlouhodobá, kapitálově náročná a zatížená nejistotou i rizikem.",
                    "Investiční projekt prochází předinvestiční, investiční a provozní fází.",
                    "Správná příprava projektu je zásadní, protože investiční rozhodnutí bývají obtížně vratná.",
                ],
                "Pomůže, když výklad postavíš na čase: nejdřív se projekt připravuje a hodnotí, potom realizuje a nakonec sleduje v provozu.",
                [
                    "Neredukuj investici jen na okamžik pořízení majetku.",
                    "Nezapomeň na faktor času, rizika a obtížnou vratnost investičních rozhodnutí.",
                ],
                "Nejprve se posuzuje proveditelnost nové provozovny, pak se provozovna zřídí a následně se vyhodnocuje, zda přináší plánované efekty.",
                "Investice je dlouhá hra: příprava, realizace, provoz.",
                2,
            ),
            q(
                "financovani-investic",
                "5.4 Financování investic a 5.6.3 požadovaná míra zhodnocení",
                "Jak souvisí financování investic s požadovanou mírou výnosnosti?",
                [59, 73],
                ["5.4", "5.6.3"],
                ["financování-investic", "požadovaná-výnosnost", "kapitál"],
                "Vysvětli, proč podnik při investici řeší nejen přínosy projektu, ale i cenu zdrojů, z nichž investici zaplatí.",
                [
                    "Investice mohou být financovány vlastními i cizími zdroji.",
                    "Každý zdroj kapitálu má svou cenu a vytváří minimální požadovanou výnosnost projektu.",
                    "Podnik proto porovnává očekávaný výnos investice s požadovanou mírou zhodnocení.",
                ],
                "Tohle je důležité propojení s kapitolou o kapitálu: dobrá investice není ta, která jen něco vydělá, ale ta, která vydělá víc než kolik stojí kapitál.",
                [
                    "Neříkej, že stačí jakýkoli kladný účetní výsledek investice.",
                    "Nezapomeň, že i vlastní kapitál má svou cenu.",
                ],
                "Projekt s výnosem 5 % může být slabý, pokud financování podniku stojí 7 %.",
                "Investice musí pokrýt cenu kapitálu, jinak hodnotu nevytváří.",
                2,
            ),
            q(
                "hodnoceni-investic",
                "5.6 Hodnocení investic",
                "Jaký je rozdíl mezi statickými a dynamickými metodami hodnocení investic?",
                [64, 69],
                ["5.6", "5.6.1", "5.6.2"],
                ["hodnocení-investic", "statické-metody", "dynamické-metody"],
                "Porovnej statické a dynamické metody hodnocení investic a řekni, proč podnik potřebuje obě skupiny chápat odlišně.",
                [
                    "Statické metody jsou jednodušší a obvykle neberou v úvahu časovou hodnotu peněz.",
                    "Dynamické metody zohledňují faktor času a jsou vhodnější pro delší či významnější projekty.",
                    "Obě skupiny metod mají pomoci rozhodnout, zda je investice ekonomicky přijatelná.",
                ],
                "V sadě A není nutné počítat vzorce. Důležité je vědět, proč jsou dynamické metody ekonomicky přesnější a kdy samotná jednoduchost statických metod nestačí.",
                [
                    "Nezapomeň zmínit časovou hodnotu peněz.",
                    "Neříkej, že statické a dynamické metody dávají vždy stejně použitelný výsledek.",
                ],
                "Projekt s dlouhou návratností může vypadat přijatelně staticky, ale po zohlednění času a diskontu být výrazně slabší.",
                "Dynamické metody jsou přesnější, protože respektují časovou hodnotu peněz.",
                2,
            ),
        ],
    },
    {
        "number": 6,
        "slug": "naklady-podniku",
        "title": "6. Náklady podniku",
        "summary_description": "Základní mapa nákladů a jejich členění pro řízení podniku.",
        "summary_tags": ["náklady", "fixní", "variabilní", "manažerské-účetnictví"],
        "key_points": [
            "Náklady jsou spotřeba ekonomických zdrojů vynaložená na činnost podniku.",
            "Podnik je sleduje ve finančním i manažerském pojetí a člení je podle různých hledisek.",
            "Pro řízení jsou klíčové zejména druhové, kalkulační a objemové klasifikace nákladů.",
        ],
        "memory_chain": [
            "Nejprve si ujasni, co je náklad a proč je podnik potřebuje řídit.",
            "Pak odliš finanční a manažerské pojetí.",
            "Nakonec projdi hlavní klasifikace, zejména druhové, kalkulační a fixní/variabilní náklady.",
        ],
        "common_confusions": [
            "Náklad není totéž co výdaj.",
            "Fixní náklad neznamená navždy absolutně neměnný náklad.",
            "Jedno členění nákladů nestačí pro všechny manažerské otázky.",
        ],
        "questions": [
            q(
                "co-jsou-naklady-a-proc-je-ridit",
                "6. Úvod ke kapitole o nákladech",
                "Co jsou náklady podniku a proč je podnik musí řídit?",
                [76],
                ["6.1"],
                ["náklady", "řízení-nákladů", "zisk"],
                "Definuj náklady podniku a vysvětli, proč je jejich řízení důležité pro úspěch podnikání.",
                [
                    "Náklady představují spotřebu prostředků vynaložených na výrobu produktů nebo poskytování služeb.",
                    "Mají přímý vliv na hospodářský výsledek a tím i na ziskovost podniku.",
                    "Řízení nákladů pomáhá plánovat výrobu, stanovovat ceny a reagovat na tlak konkurence.",
                ],
                "Dobrý výklad zdůrazní, že řízení nákladů neznamená jen bezhlavé snižování, ale dlouhodobé strategické usměrňování nákladových položek.",
                [
                    "Řízení nákladů není jen škrtání všeho možného.",
                    "Neomezuj význam nákladů jen na účetnictví.",
                ],
                "Podnik pod tlakem konkurence často nemůže jen zvyšovat cenu, a proto musí lépe rozumět struktuře a chování svých nákladů.",
                "Náklady rozhodují o zisku, a proto je podnik musí aktivně řídit.",
            ),
            q(
                "financni-a-manazerske-pojeti-nakladu",
                "6. Úvod a 6.1 Klasifikace nákladů",
                "Jaký je rozdíl mezi finančním a manažerským pojetím nákladů?",
                [76, 77],
                ["6.1"],
                ["finanční-pojetí", "manažerské-pojetí", "explicitní", "implicitní"],
                "Porovnej finanční a manažerské pojetí nákladů a ukaž, proč manažerské pojetí pracuje i s implicitními náklady.",
                [
                    "Finanční pojetí sleduje účetně zachycené explicitní náklady a je důležité pro výkaznictví a daně.",
                    "Manažerské pojetí řeší i rozhodovací pohled a zahrnuje například oportunitní či implicitní náklady.",
                    "Manažerské pojetí proto lépe podporuje volbu budoucích variant a ekonomický zisk.",
                ],
                "Sem se dobře hodí i rozlišení nákladu a výdaje: náklad je účetní kategorie, výdaj peněžní. Manažerské pojetí jde navíc ještě dál a uvažuje i obětované alternativy.",
                [
                    "Nezaměňuj náklad a výdaj.",
                    "Neříkej, že implicitní náklady jsou v účetnictví běžně zaúčtované.",
                ],
                "Když podnik použije vlastní kapitál, účetnictví nemusí zachytit ušlý úrok, ale ekonomické pojetí ho vnímá jako náklad alternativy.",
                "Finanční pojetí sleduje vykázané náklady, manažerské i obětované alternativy.",
                2,
            ),
            q(
                "druhove-cleneni-nakladu",
                "6.1.1 Druhové členění nákladů",
                "Co je druhové členění nákladů?",
                [78],
                ["6.1.1"],
                ["druhové-členění", "spotřeba-vstupů", "náklady"],
                "Vysvětli druhové členění nákladů a řekni, na jakou otázku toto členění odpovídá.",
                [
                    "Druhové členění sleduje náklady podle věcné ekonomické podstaty spotřebovaných vstupů.",
                    "Typicky zahrnuje materiál, energii, mzdy, odpisy, finanční náklady a externí služby.",
                    "Odpovídá hlavně na otázku, co bylo spotřebováno.",
                ],
                "U zkoušky si můžeš pamatovat jednoduchou pomůcku: druhové členění = jaký vstup podnik spotřeboval. Je to základní klasifikace používaná i ve výkaznictví.",
                [
                    "Nezaměňuj druhové členění s přiřazením nákladů ke konkrétnímu výrobku.",
                    "Neomezuj druhové náklady jen na materiál a mzdy.",
                ],
                "Spotřeba elektřiny a odpis stroje jsou druhově jiné náklady, i když oba souvisejí s výrobou.",
                "Druhové členění odpovídá na otázku: co se spotřebovalo?",
            ),
            q(
                "vykaz-a-kalkulacni-cleneni",
                "6.1.2 a 6.1.3 Náklady dle oblastí a kalkulační členění",
                "Jaký je rozdíl mezi náklady ve výkazu zisku a ztráty a kalkulačním členěním nákladů?",
                [79, 80],
                ["6.1.2", "6.1.3"],
                ["výkaz-zisku-a-ztráty", "kalkulační-členění", "výkony"],
                "Porovnej členění nákladů podle oblastí ve výsledovce a kalkulační členění nákladů.",
                [
                    "Výsledovka sleduje náklady z pohledu účetního vykazování výsledku hospodaření.",
                    "Kalkulační členění přiřazuje náklady ke konkrétním výkonům, výrobkům nebo zakázkám.",
                    "Kalkulační pohled je proto důležitý pro tvorbu ceny, kontrolu rentability a rozhodování o sortimentu.",
                ],
                "Tady je dobré ukázat, že stejné náklady se mohou sledovat jinak podle toho, jestli řešíme účetní výkaz nebo ekonomiku konkrétního výkonu.",
                [
                    "Neříkej, že kalkulační členění je jen jiné jméno pro druhové členění.",
                    "Nezapomeň na vazbu ke konkrétnímu výkonu.",
                ],
                "Mzda může být ve výsledovce osobním nákladem, ale v kalkulaci zároveň přímým nákladem konkrétní zakázky.",
                "Výsledovka řeší účetní pohled, kalkulace vztah nákladů ke konkrétním výkonům.",
                2,
            ),
            q(
                "fixni-a-variabilni-naklady",
                "6.1.4 Náklady podle závislosti na objemu výkonů",
                "Jaký je rozdíl mezi fixními a variabilními náklady?",
                [80, 81],
                ["6.1.4"],
                ["fixní-náklady", "variabilní-náklady", "objem-výkonů"],
                "Vysvětli rozdíl mezi fixními a variabilními náklady a proč je tento pohled důležitý pro řízení podniku.",
                [
                    "Variabilní náklady se mění se změnou objemu výkonů, fixní zůstávají v určitém rozsahu činnosti relativně stejné.",
                    "Toto členění je klíčové pro bod zvratu, krátkodobé rozhodování i plánování kapacity.",
                    "Fixnost a variabilita jsou vztahové pojmy závislé na čase a rozsahu činnosti.",
                ],
                "Silná odpověď neřekne jen definici, ale i manažerské využití: právě tohle členění umožňuje počítat příspěvek na úhradu a chápat dopad změny objemu výroby.",
                [
                    "Fixní náklady nejsou absolutně neměnné navždy.",
                    "Nezapomeň zmínit využití pro rozhodování a plánování.",
                ],
                "Nájem haly bývá v krátkém období fixní, zatímco spotřeba materiálu se většinou mění podle množství výroby.",
                "Fixní a variabilní náklady ukazují, jak se náklad chová při změně výkonu.",
            ),
        ],
    },
    {
        "number": 7,
        "slug": "kalkulace-nakladu",
        "title": "7. Kalkulace nákladů",
        "summary_description": "Základní orientace v kalkulacích úplných a neúplných nákladů.",
        "summary_tags": ["kalkulace", "úplné-náklady", "přirážková-kalkulace", "příspěvek-na-úhradu"],
        "key_points": [
            "Kalkulace přiřazuje náklady ke konkrétním výkonům podniku.",
            "Úplné kalkulace pracují s přímými i nepřímými náklady a používají různé techniky rozvrhu.",
            "Neúplné kalkulace pomáhají zejména při krátkodobém manažerském rozhodování.",
        ],
        "memory_chain": [
            "Nejprve vysvětli funkci kalkulace v podniku.",
            "Pak ukaž kalkulaci úplných nákladů a základní techniky.",
            "Nakonec shrň limity úplných kalkulací a smysl kalkulace neúplných nákladů.",
        ],
        "common_confusions": [
            "Kalkulace není totéž co účetní výkaz nákladů.",
            "Úplná kalkulace nemusí být nejlepší pro každé krátkodobé rozhodnutí.",
            "Neúplná kalkulace neignoruje náklady, ale jinak pracuje s fixní složkou.",
        ],
        "questions": [
            q(
                "funkce-kalkulace",
                "7.1 Funkce kalkulace",
                "Jaké jsou funkce kalkulace nákladů?",
                [84],
                ["7.1"],
                ["funkce-kalkulace", "cena", "řízení"],
                "Vysvětli, proč podnik kalkuluje náklady a jaké hlavní funkce kalkulace plní.",
                [
                    "Kalkulace přiřazuje náklady jednotlivým výkonům podniku.",
                    "Slouží pro řízení nákladů, plánování, kontrolu a tvorbu cen.",
                    "Pomáhá i při rozhodování o struktuře výkonů a vztazích mezi útvary podniku.",
                ],
                "U zkoušky pomáhá navázat kalkulaci na praxi: bez ní podnik neví, kolik výkon stojí, jakou cenu může nabídnout a kde má nákladové rezervy.",
                [
                    "Neomezuj kalkulaci jen na technický výpočet.",
                    "Nezapomeň na vazbu ke stanovení cen a vnitropodnikovému řízení.",
                ],
                "Zakázková firma bez kalkulace nepozná, jestli nabízená cena zakázky pokrývá náklady a přinese zisk.",
                "Kalkulace říká, kolik výkon stojí a jak s tím podnik může pracovat.",
            ),
            q(
                "uplne-naklady-a-prime-neprime",
                "7.2 Kalkulace úplných nákladů",
                "Co je kalkulace úplných nákladů a jak rozlišuje přímé a nepřímé náklady?",
                [85],
                ["7.2"],
                ["úplné-náklady", "přímé-náklady", "nepřímé-náklady"],
                "Popiš základní princip kalkulace úplných nákladů a roli přímých a nepřímých nákladů.",
                [
                    "Kalkulace úplných nákladů přiřazuje výkonu všechny náklady, tedy přímé i nepřímé.",
                    "Přímé náklady mají jasnou vazbu na konkrétní kalkulační jednici.",
                    "Nepřímé náklady je třeba rozvrhnout pomocí vhodných klíčů nebo přirážek.",
                ],
                "Tohle je klíčový základ celé kapitoly. Přímé náklady se přiřazují snadno, nepřímé vytvářejí hlavní problém přesnosti kalkulace.",
                [
                    "Úplná kalkulace neznamená jen součet přímých nákladů.",
                    "Nepřímé náklady nelze přiřadit bez rozvrhové logiky.",
                ],
                "Materiál na výrobek je obvykle přímý náklad, ale výrobní režie se musí rozpočítat podle zvoleného klíče.",
                "Úplná kalkulace přiděluje výkonu i režii, ne jen přímou spotřebu.",
            ),
            q(
                "kalkulacni-vzorec",
                "7.2 Typový kalkulační vzorec",
                "Co ukazuje typový kalkulační vzorec?",
                [86],
                ["7.2"],
                ["kalkulační-vzorec", "režie", "cena-výkonu"],
                "Vysvětli, co vyjadřuje typový kalkulační vzorec a jak se v něm skládají nákladové položky až k ceně výkonu.",
                [
                    "Kalkulační vzorec systematicky skládá přímé náklady, výrobní režii, správní režii a další složky až k úplným nákladům výkonu.",
                    "Ukazuje, jak se z jednotlivých položek vytvoří vlastní náklady výkonu a případně cena výkonu se ziskovou přirážkou.",
                    "Pomáhá zpřehlednit strukturu nákladů a kontrolovat, kde se náklady ve výkonu vytvářejí.",
                ],
                "Na úrovni sady A stačí chápat logiku skládání položek, nikoli memorovat každou variantu tabulky do detailu.",
                [
                    "Nepleť si kalkulační vzorec s výsledovkou.",
                    "Nezapomeň, že režijní složky se ke kalkulaci připojují postupně.",
                ],
                "Podnik díky kalkulačnímu vzorci vidí, jak se k přímému materiálu a mzdám přidává výrobní i správní režie a jak to ovlivní cenu výkonu.",
                "Kalkulační vzorec ukazuje, jak se z dílčích nákladů stane úplný náklad výkonu.",
                2,
            ),
            q(
                "techniky-uplnych-kalkulaci",
                "7.2.1 až 7.2.4 Kalkulační techniky",
                "Jaké jsou základní techniky kalkulace úplných nákladů?",
                [87, 88],
                ["7.2.1", "7.2.2", "7.2.3", "7.2.4"],
                ["dělením", "poměrová-čísla", "přirážková-kalkulace"],
                "Vyjmenuj základní techniky kalkulace úplných nákladů a u každé naznač, kdy se používá.",
                [
                    "Kalkulace dělením se hodí pro jednoduchou stejnorodou výrobu.",
                    "Kalkulace poměrovými čísly se používá tam, kde jsou výkony příbuzné, ale ne zcela stejné.",
                    "Přirážková kalkulace rozvrhuje nepřímé náklady pomocí přirážek a hodí se pro pestřejší výrobu.",
                ],
                "U této otázky není cílem rozepisovat celé algoritmy, ale ukázat vazbu mezi charakterem výroby a zvolenou technikou kalkulace.",
                [
                    "Není jedna univerzální technika pro všechny typy výroby.",
                    "Nezapomeň, že volba techniky ovlivňuje přesnost i pracnost kalkulace.",
                ],
                "Sériová výroba jednoho produktu často používá dělení, zatímco zakázková výroba spíše přirážkovou kalkulaci.",
                "Technika kalkulace se volí podle typu výkonu a struktury nákladů.",
            ),
            q(
                "neuplne-kalkulace",
                "7.2.5 a 7.3 Limity úplných kalkulací a kalkulace neúplných nákladů",
                "Jaké mají úplné kalkulace limity a kdy pomáhá kalkulace neúplných nákladů?",
                [90, 91],
                ["7.2.5", "7.3"],
                ["neúplné-náklady", "příspěvek-na-úhradu", "manažerské-rozhodování"],
                "Vysvětli, proč úplná kalkulace nemusí být nejlepší pro krátkodobá rozhodnutí a co přináší kalkulace neúplných nákladů.",
                [
                    "Úplná kalkulace může zkreslit rozhodování tím, jak rozvrhuje nepřímé a fixní náklady.",
                    "Kalkulace neúplných nákladů se soustředí hlavně na náklady, které se rozhodnutím skutečně mění.",
                    "Pomáhá sledovat příspěvek výkonu na úhradu fixních nákladů a zisku.",
                ],
                "Nejsilnější je ukázat rozdíl v účelu: úplná kalkulace je dobrá pro celkový přehled a ocenění, neúplná pro operativní rozhodování o variantách.",
                [
                    "Neříkej, že neúplná kalkulace znamená nepořádek nebo chybu.",
                    "Fixní náklady nezmizí, jen se v rozhodování sledují jinak.",
                ],
                "Jednorázová zakázka může být zajímavá, i když v úplné kalkulaci nevypadá dobře, protože při neúplné kalkulaci stále přispívá na úhradu fixních nákladů.",
                "Neúplná kalkulace se hodí tam, kde řešíme, co se rozhodnutím opravdu změní.",
                2,
            ),
        ],
    },
    {
        "number": 8,
        "slug": "zisk-vynosy-a-vykony",
        "title": "8. Zisk, výnosy a výkony",
        "summary_description": "Přehled hospodářského výsledku, výnosů, výkonů a funkcí zisku.",
        "summary_tags": ["zisk", "výnosy", "výkony", "přidaná-hodnota"],
        "key_points": [
            "Výsledovka ukazuje hospodářský výsledek jako rozdíl výnosů a nákladů za období.",
            "Zisk je důležitý, ale sám o sobě nemusí věrně vystihovat finanční zdraví podniku.",
            "Je nutné odlišit zisk, příjem, výnosy, výkony a přidanou hodnotu.",
        ],
        "memory_chain": [
            "Nejprve vysvětli výsledovku a hospodářský výsledek.",
            "Pak ukaž, proč může být výsledek hospodaření zkreslený.",
            "Nakonec odliš zisk, výnosy, výkony a přidanou hodnotu.",
        ],
        "common_confusions": [
            "Zisk není totéž co příjem ani cash flow.",
            "Výnosy a výkony nejsou plně zaměnitelné pojmy.",
            "Kladný účetní výsledek nemusí znamenat zdravý provozní stav firmy.",
        ],
        "questions": [
            q(
                "vysledovka-a-hospodarsky-vysledek",
                "8.1 Hospodářský výsledek",
                "Co ukazuje výsledovka a co je hospodářský výsledek?",
                [94],
                ["8.1"],
                ["výsledovka", "hospodářský-výsledek", "zisk"],
                "Vysvětli, co zobrazuje výkaz zisku a ztráty a jak vzniká hospodářský výsledek.",
                [
                    "Výsledovka zachycuje finanční výkonnost podniku za určité období, na rozdíl od rozvahy, která ukazuje stavy k určitému datu.",
                    "Hospodářský výsledek vzniká jako rozdíl mezi výnosy a náklady.",
                    "Může být kladný jako zisk nebo záporný jako ztráta a je důležitým ukazatelem kvality podnikání.",
                ],
                "Na přehledové úrovni je klíčové odlišit tokový charakter výsledovky od stavového charakteru rozvahy.",
                [
                    "Nezaměňuj rozvahu a výsledovku.",
                    "Zisk a ztráta jsou jen dvě možné podoby hospodářského výsledku.",
                ],
                "Analytik si často nejdřív všimne velikosti tržeb a hospodářského výsledku, protože rychle napoví o velikosti a výkonnosti firmy.",
                "Výsledovka ukazuje výkon za období; hospodářský výsledek je rozdíl výnosů a nákladů.",
            ),
            q(
                "zisk-vs-prijem-a-zkresleni",
                "8.1 Výsledek hospodaření a jeho zkreslení",
                "Jak odlišit zisk od příjmu a proč může být hospodářský výsledek zkreslený?",
                [95, 96],
                ["8.1"],
                ["zisk", "příjem", "zkreslení"],
                "Porovnej zisk a příjem a uveď hlavní důvody, proč může účetní hospodářský výsledek zkreslovat realitu.",
                [
                    "Zisk je rozdíl výnosů a nákladů, zatímco příjem znamená skutečný přítok peněz.",
                    "Hospodářský výsledek může být zkreslen nepeněžními operacemi, mimořádnými vlivy nebo problematickými aktivy.",
                    "Proto samotné číslo zisku nestačí bez hlubší interpretace.",
                ],
                "Tohle je silné propojení s cash flow. U zkoušky klidně řekni, že zisk je účetní výsledek, ale ne vždy okamžitá hotovost a ne vždy čistý obraz provozu.",
                [
                    "Neříkej, že zisk je totéž co peníze na účtu.",
                    "Nezapomeň na vliv nepeněžních či mimořádných operací.",
                ],
                "Firma může vykázat zisk díky rozpuštění rezerv nebo prodeji majetku, i když její běžná provozní činnost slábne.",
                "Zisk je účetní výsledek; příjem je skutečný přítok peněz.",
                2,
            ),
            q(
                "funkce-a-rozdeleni-zisku",
                "8.1.1 a 8.1.2 Funkce a rozdělení zisku",
                "Jaké má zisk funkce a jak se v podniku rozděluje?",
                [96],
                ["8.1.1", "8.1.2"],
                ["funkce-zisku", "rozdělení-zisku", "dividendy"],
                "Shrň hlavní funkce zisku a základní možnosti, jak s ním podnik po skončení období naloží.",
                [
                    "Zisk plní kriteriální, rozvojovou, rozdělovací a motivační funkci.",
                    "Může být použit na investice, fondy, krytí ztrát, splátky závazků nebo výplaty vlastníkům.",
                    "Rozhodnutí o rozdělení zisku ovlivňuje další rozvoj i finanční stabilitu podniku.",
                ],
                "U přehledové odpovědi pomáhá ukázat, že zisk není jen odměna vlastníkům. Je také zdrojem samofinancování a rozvoje firmy.",
                [
                    "Neříkej, že celý zisk se automaticky vyplácí vlastníkům.",
                    "Nezapomeň na rozvojovou a motivační funkci zisku.",
                ],
                "Podnik může část zisku ponechat na investice a část použít jako dividendy nebo podíly na zisku.",
                "Zisk odměňuje vlastníky i financuje další rozvoj podniku.",
            ),
            q(
                "vynosy-a-vykony",
                "8.2 a 8.3 Výnosy a výkony",
                "Jak odlišit výnosy a výkony?",
                [97, 98],
                ["8.2", "8.3"],
                ["výnosy", "výkony", "tržby"],
                "Vysvětli rozdíl mezi výnosy a výkony a proč je vhodné tyto pojmy neplést.",
                [
                    "Výnosy jsou širší účetní kategorií zachycující přínosy do hospodářského výsledku.",
                    "Výkony jsou více spojeny s vlastní produkcí, tržbami a změnami stavu výkonů.",
                    "Rozlišení pomáhá lépe chápat, z čeho podnik svůj výsledek vytváří.",
                ],
                "V sadě A stačí vědět, že výnos je širší pojem, zatímco výkony mají bližší vazbu na vlastní činnost podniku.",
                [
                    "Nepoužívej výnosy a výkony jako úplná synonyma.",
                    "Neomezuj výkony jen na fyzické výrobky; patří sem i služby a změny stavu výkonů.",
                ],
                "Tržba z prodeje výrobku je zároveň výnosem i výkonem, ale ne každý výnos musí vzniknout z hlavního výkonu podniku.",
                "Výnosy jsou širší pojem, výkony se víc vážou na vlastní produkci podniku.",
                2,
            ),
            q(
                "pridana-hodnota-a-kategorie-zisku",
                "8.4 a 8.5 Přidaná hodnota a kategorie zisku",
                "Co je přidaná hodnota a proč sledujeme různé kategorie zisku?",
                [99, 100],
                ["8.4", "8.5"],
                ["přidaná-hodnota", "kategorie-zisku", "výsledek"],
                "Shrň pojem přidaná hodnota a vysvětli, proč se při hodnocení podniku sledují i různé úrovně zisku.",
                [
                    "Přidaná hodnota vyjadřuje novou hodnotu, kterou podnik vytváří nad hodnotu nakoupených vstupů.",
                    "Různé kategorie zisku pomáhají odlišit provozní výsledek od jiných vlivů nebo finančních položek.",
                    "To zlepšuje interpretaci skutečné výkonnosti podniku.",
                ],
                "U přehledové odpovědi ukaž, že přidaná hodnota není zisk, ale širší pohled na to, co podnik skutečně vytvořil vlastní činností.",
                [
                    "Neztotožňuj přidanou hodnotu se ziskem.",
                    "Jedno číslo zisku bez struktury nemusí říct dost o výkonu firmy.",
                ],
                "Podnik může mít slušnou přidanou hodnotu, ale konečný zisk bude záviset i na režii, odpisování, financování a dalších faktorech.",
                "Přidaná hodnota ukazuje vytvořenou novou hodnotu; kategorie zisku zpřesňují pohled na výkonnost.",
                2,
            ),
        ],
    },
    {
        "number": 9,
        "slug": "cash-flow-penezni-tok-v-podniku",
        "title": "9. Cash flow – peněžní tok v podniku",
        "summary_description": "Přehled peněžních toků, struktury výkazu cash flow a metod jeho sestavení.",
        "summary_tags": ["cash-flow", "likvidita", "přímá-metoda", "nepřímá-metoda"],
        "key_points": [
            "Cash flow sleduje skutečné pohyby peněz a doplňuje rozvahu i výsledovku.",
            "Je klíčové pro posouzení likvidity, schopnosti splácet a financovat provoz i investice.",
            "Výkaz cash flow se člení na provozní, investiční a finanční část a lze ho sestavit přímou i nepřímou metodou.",
        ],
        "memory_chain": [
            "Nejprve vysvětli, proč podnik sleduje cash flow vedle zisku.",
            "Pak si srovnej peněžní prostředky, ekvivalenty a typy transakcí.",
            "Nakonec popiš strukturu výkazu a rozdíl mezi přímou a nepřímou metodou.",
        ],
        "common_confusions": [
            "Cash flow není totéž co zisk.",
            "Výkaz cash flow nesleduje jen hotovost v pokladně.",
            "Přímá a nepřímá metoda neznamenají dva různé výsledky, ale dvě cesty sestavení.",
        ],
        "questions": [
            q(
                "proc-je-cash-flow-dulezite",
                "9.1 Základní pojmy a operace ve výkazu CF",
                "Proč podnik sleduje cash flow vedle zisku?",
                [104, 105],
                ["9.1"],
                ["cash-flow", "zisk", "likvidita"],
                "Vysvětli, co je cash flow a proč podnik potřebuje tuto informaci i tehdy, když zná svůj účetní zisk.",
                [
                    "Cash flow zachycuje skutečný tok peněžních prostředků a peněžních ekvivalentů.",
                    "Doplňuje účetní výkazy založené na akruálním principu, které nezachycují vždy okamžitý pohyb peněz.",
                    "Pomáhá hodnotit likviditu, schopnost splácet závazky a financovat budoucí potřeby podniku.",
                ],
                "Na zkoušce funguje jednoduché srovnání: výsledovka ukáže výsledek hospodaření, cash flow ukáže peněžní realitu.",
                [
                    "Kladný zisk automaticky neznamená kladné cash flow.",
                    "Cash flow není jen informace o zůstatku na účtu.",
                ],
                "Firma může mít vysoké tržby na fakturu a účetní zisk, ale přitom akutní nedostatek hotovosti.",
                "Cash flow ukazuje peníze v pohybu, ne jen účetní výsledek.",
            ),
            q(
                "penezni-prostredky-a-ekvivalenty",
                "9.1.1 Peněžní prostředky",
                "Co patří mezi peněžní prostředky a peněžní ekvivalenty?",
                [105, 106],
                ["9.1.1"],
                ["peněžní-prostředky", "peněžní-ekvivalenty", "likvidita"],
                "Uveď, co výkaz cash flow sleduje jako peněžní prostředky a co považuje za peněžní ekvivalenty.",
                [
                    "Peněžní prostředky zahrnují hotovost, bankovní účty, peníze na cestě a podobné okamžitě použitelné položky.",
                    "Peněžní ekvivalenty jsou vysoce likvidní krátkodobá finanční aktiva snadno směnitelná za známou částku peněz.",
                    "Smyslem je zachytit prostředky, které podnik může rychle použít pro úhradu potřeb a závazků.",
                ],
                "U přehledové odpovědi stačí ukázat, že cash flow neřeší jen fyzickou hotovost, ale i velmi likvidní finanční položky.",
                [
                    "Neomezuj peněžní prostředky jen na pokladnu.",
                    "Nezařazuj mezi ekvivalenty nelikvidní nebo dlouhodobá aktiva.",
                ],
                "Krátkodobý vysoce likvidní cenný papír může být peněžním ekvivalentem, ale dlouhodobá investice už ne.",
                "Výkaz cash flow sleduje peníze a aktiva, která se na peníze rychle a bezpečně mění.",
            ),
            q(
                "cash-flow-vs-zisk-a-transakce",
                "9.1.2 Základní typy hospodářských transakcí",
                "Proč se cash flow liší od zisku a jaké typy transakcí to způsobují?",
                [105, 106],
                ["9.1.2"],
                ["akruální-princip", "transakce", "cash-flow-vs-zisk"],
                "Vysvětli hlavní důvody, proč se cash flow liší od zisku, a ukaž roli různých typů hospodářských transakcí.",
                [
                    "Účetnictví zachycuje výnosy a náklady v období jejich vzniku, ne nutně při pohybu peněz.",
                    "Rozdíl vytvářejí transakce finančně účinné, ale neziskové, ziskové, ale nefinanční i transakce, které jsou ziskové i finanční současně.",
                    "Právě proto cash flow odstraňuje nesoulad mezi účetním výsledkem a skutečnými peněžními toky.",
                ],
                "Tohle není otázka na detailní klasifikaci všech případů, ale na pochopení, že účetní a peněžní toková realita se často časově rozcházejí.",
                [
                    "Nezapomeň na prodej a nákup na fakturu.",
                    "Odpis je náklad, ale není peněžním výdajem.",
                ],
                "Podnik prodá zboží na fakturu a vytvoří výnos, ale peníze dostane až později; právě tady vzniká rozdíl mezi ziskem a cash flow.",
                "Cash flow a zisk se liší, protože účetní vznik operace a peněžní pohyb nejsou totéž.",
                2,
            ),
            q(
                "struktura-vykazu-cash-flow",
                "9.2 Struktura výkazu cash flow",
                "Jak je strukturován výkaz cash flow?",
                [108],
                ["9.2"],
                ["struktura-cash-flow", "provozní-činnost", "finanční-činnost"],
                "Popiš základní části výkazu cash flow a řekni, co každá z nich ukazuje.",
                [
                    "Provozní část zachycuje peněžní toky z běžné činnosti podniku.",
                    "Investiční část ukazuje toky spojené s pořízením a prodejem dlouhodobého majetku nebo investic.",
                    "Finanční část sleduje změny ve zdrojích financování, například úvěry, vklady nebo výplaty vlastníkům.",
                ],
                "Pomáhá jednoduchá pomůcka: provoz = běžný business, investice = majetek, finance = zdroje krytí.",
                [
                    "Nezaměňuj investiční peněžní toky s provozními tržbami.",
                    "Nezapomeň, že finanční část se týká změn ve financování podniku.",
                ],
                "Inkaso od odběratele patří do provozní části, nákup stroje do investiční a přijetí úvěru do finanční.",
                "Cash flow se dělí na provozní, investiční a finanční část.",
            ),
            q(
                "prima-a-neprima-metoda-cf",
                "9.3 Metody vykazování cash flow",
                "Jaký je rozdíl mezi přímou a nepřímou metodou sestavení cash flow?",
                [109, 112],
                ["9.3", "9.3.1", "9.3.2", "9.3.3"],
                ["přímá-metoda", "nepřímá-metoda", "cash-flow"],
                "Porovnej přímou a nepřímou metodu sestavení cash flow a ukaž, odkud každá z nich vychází.",
                [
                    "Přímá metoda pracuje přímo s peněžními příjmy a výdaji.",
                    "Nepřímá metoda vychází z výsledku hospodaření a upravuje ho o nepeněžní položky a změny pracovního kapitálu.",
                    "Obě metody směřují ke stejnému cíli, ale používají odlišný postup sestavení provozní části výkazu.",
                ],
                "V sadě A není potřeba rozepisovat celý výkaz. Důležitá je logika, odkud se začíná a proč je v praxi častá nepřímá metoda.",
                [
                    "Neříkej, že přímá a nepřímá metoda dávají dva různé výsledky cash flow.",
                    "Nezapomeň, že rozdíl je hlavně v provozní části výkazu.",
                ],
                "Nepřímá metoda vezme účetní výsledek a upraví ho například o odpisy nebo změny pohledávek a závazků.",
                "Přímá metoda sleduje příjmy a výdaje, nepřímá upravuje účetní výsledek.",
                2,
            ),
        ],
    },
    {
        "number": 10,
        "slug": "financni-analyza",
        "title": "10. Finanční analýza",
        "summary_description": "Přehled cílů, podkladů a základních metod finanční analýzy.",
        "summary_tags": ["finanční-analýza", "ukazatele", "horizontalní-analýza", "vertikální-analýza"],
        "key_points": [
            "Finanční analýza hodnotí finanční zdraví, výkonnost a stabilitu podniku.",
            "Vychází z účetních výkazů i dalších finančních a nefinančních informací.",
            "Používá základní rozbory, poměrové ukazatele a souhrnné modely, ale vyžaduje opatrnou interpretaci.",
        ],
        "memory_chain": [
            "Nejdřív vysvětli smysl finanční analýzy a komu slouží.",
            "Pak uveď její podklady a limity účetních výkazů.",
            "Nakonec projdi hlavní analytické metody a ukazatele.",
        ],
        "common_confusions": [
            "Finanční analýza není jen mechanický výpočet ukazatelů.",
            "Jedno dobré číslo nestačí bez srovnání a interpretace.",
            "Účetní výkazy jsou důležité, ale mají svá omezení.",
        ],
        "questions": [
            q(
                "co-je-financni-analyza",
                "10.1 Úkoly finanční analýzy",
                "Co je finanční analýza a k čemu slouží?",
                [115],
                ["10.1"],
                ["finanční-analýza", "výkonnost", "stabilita"],
                "Vymez finanční analýzu a vysvětli, jaké hlavní úkoly v podniku nebo vůči jeho okolí plní.",
                [
                    "Finanční analýza hodnotí finanční zdraví, výkonnost a stabilitu podniku.",
                    "Pomáhá odhalit silné a slabé stránky a podporuje manažerské rozhodování.",
                    "Slouží i externím subjektům, například bankám nebo investorům, při posouzení bonity a perspektivy firmy.",
                ],
                "U přehledové odpovědi se vyplatí zdůraznit, že finanční analýza není samoúčelné počítání, ale nástroj pro řízení a rozhodování.",
                [
                    "Neomezuj finanční analýzu jen na interní použití.",
                    "Nezapomeň na výhled do budoucna, nejen popis minulosti.",
                ],
                "Banka potřebuje finanční analýzu kvůli úvěru, management kvůli řízení majetku, zdrojů a plánování budoucích kroků.",
                "Finanční analýza ukazuje, jak je podnik výkonný, stabilní a důvěryhodný.",
            ),
            q(
                "podklady-a-uzivatele",
                "10.1.1 Podklady ke zpracování finanční analýzy",
                "Z jakých podkladů finanční analýza vychází a kdo ji používá?",
                [116, 117],
                ["10.1.1"],
                ["podklady", "uživatelé", "účetní-výkazy"],
                "Uveď hlavní podklady finanční analýzy a základní skupiny interních a externích uživatelů.",
                [
                    "Základním podkladem jsou rozvaha, výkaz zisku a ztráty, cash flow a příloha k účetní závěrce.",
                    "Důležité mohou být i výroční zprávy, tržní data a informace o odvětví.",
                    "Analýzu používají interní uživatelé jako management a zaměstnanci i externí uživatelé jako banky, investoři, dodavatelé nebo stát.",
                ],
                "Silná odpověď ukáže, že různí uživatelé sledují různé věci: banka bonitu, investor výnos a riziko, management řídicí informace.",
                [
                    "Neomezuj zdroje jen na rozvahu.",
                    "Nezapomeň, že uživatelé mají různé informační cíle.",
                ],
                "Investor se zaměřuje na výnos a perspektivu, banka na schopnost splácet a management na možnosti zlepšení výkonu.",
                "Finanční analýza stojí na výkazech, ale používají ji velmi různé skupiny uživatelů.",
            ),
            q(
                "limity-ucetnich-vykazu",
                "10.1.3 Limity účetních výkazů",
                "Jaké mají účetní výkazy limity pro finanční analýzu?",
                [118],
                ["10.1.3"],
                ["limity-výkazů", "interpretace", "účetnictví"],
                "Vysvětli, proč je třeba číst účetní výkazy při finanční analýze kriticky.",
                [
                    "Účetní výkazy jsou základním zdrojem dat, ale mohou být ovlivněny použitými účetními pravidly, oceňováním a časovým rozlišením.",
                    "Samotná data bez kontextu neukazují vše o skutečné ekonomické situaci podniku.",
                    "Finanční analýza proto musí čísla nejen spočítat, ale i správně interpretovat a srovnávat.",
                ],
                "Tohle je důležitá pojistka proti mechanickému myšlení. Účetní výkazy jsou nezbytné, ale nejsou bezchybné zrcadlo reality.",
                [
                    "Neber čísla z výkazů jako absolutní pravdu bez kontextu.",
                    "Nezapomeň, že stejný ukazatel může mít v různých podnicích odlišný význam.",
                ],
                "Jednorázový prodej majetku může krátkodobě zlepšit výsledek, ale nemusí vypovídat o běžné provozní kvalitě firmy.",
                "Čísla je třeba číst kriticky, ne jen mechanicky přebírat.",
                2,
            ),
            q(
                "horizontalni-a-vertikalni-analyza",
                "10.2.1 a 10.2.2 Horizontální a vertikální rozbor",
                "Jaký je rozdíl mezi horizontální a vertikální analýzou?",
                [120],
                ["10.2.1", "10.2.2"],
                ["horizontální-analýza", "vertikální-analýza", "rozbor"],
                "Porovnej horizontální a vertikální analýzu účetních výkazů.",
                [
                    "Horizontální analýza sleduje vývoj položek v čase a změny mezi obdobími.",
                    "Vertikální analýza ukazuje strukturu výkazu v jednom období, tedy podíly jednotlivých položek na celku.",
                    "Společně pomáhají odhalit trendy i změny struktury majetku, kapitálu, nákladů nebo výnosů.",
                ],
                "Jednoduchá mnemotechnika: horizontální = časový vývoj, vertikální = struktura uvnitř výkazu.",
                [
                    "Nezaměňuj horizontální analýzu s poměrovými ukazateli.",
                    "Vertikální analýza neřeší časovou změnu, ale podíly v jednom období.",
                ],
                "Horizontální rozbor ukáže, že zásoby meziročně vzrostly, vertikální, jak velký podíl mají zásoby na aktivech.",
                "Horizontální analýza sleduje čas, vertikální strukturu.",
            ),
            q(
                "pomerove-a-souhrnne-ukazatele",
                "10.2.3 a 10.2.4 Poměrové ukazatele a soustavy ukazatelů",
                "K čemu slouží poměrové a souhrnné ukazatele finanční analýzy?",
                [121, 125],
                ["10.2.3", "10.2.4"],
                ["poměrové-ukazatele", "souhrnné-ukazatele", "rentabilita"],
                "Shrň význam poměrových ukazatelů a soustav ukazatelů ve finanční analýze.",
                [
                    "Poměrové ukazatele převádějí údaje z výkazů do vztahů, které lépe ukazují likviditu, zadluženost, aktivitu nebo rentabilitu.",
                    "Souhrnné ukazatele a soustavy propojují více dílčích ukazatelů do celkového obrazu finanční situace.",
                    "Skutečný smysl mají hlavně při srovnání v čase, s odvětvím a s konkurencí.",
                ],
                "Na úrovni sady A není nutné znát všechny vzorce. Podstatné je chápat, že jeden ukazatel nikdy nestačí a že soustavy se snaží spojit více pohledů dohromady.",
                [
                    "Nevyvozuj závěr z jediného ukazatele bez kontextu.",
                    "Souhrnný ukazatel nenahrazuje kritické myšlení analytika.",
                ],
                "Vyšší zadluženost může být přijatelná v jednom odvětví, ale riziková v jiném; proto je nutné ukazatele porovnávat.",
                "Ukazatele převádějí výkazy do vztahů o výkonnosti a riziku, ale musí se správně interpretovat.",
                2,
            ),
        ],
    },
    {
        "number": 11,
        "slug": "zakladatelsky-rozpocet-a-mimoradne-financovani",
        "title": "11. Zakladatelský rozpočet, mimořádné financování",
        "summary_description": "Přehled klíčových rozhodnutí při zahájení podnikání a jejich finančního zajištění.",
        "summary_tags": ["zakladatelský-rozpočet", "zahájení-podnikání", "financování", "právní-forma"],
        "key_points": [
            "Před zahájením podnikání je nutné promyslet obor, právní formu, umístění a vlastní připravenost.",
            "Zakladatelský rozpočet převádí podnikatelský záměr do potřeby majetku a zdrojů krytí.",
            "Začínající podnik potřebuje promyšlené financování a někdy i mimořádné zdroje.",
        ],
        "memory_chain": [
            "Nejdřív si ujasni, co vše je potřeba rozhodnout před startem podnikání.",
            "Pak přejdi k volbě předmětu a právní formy podnikání.",
            "Nakonec vysvětli zakladatelský rozpočet a financování startu i mimořádných potřeb.",
        ],
        "common_confusions": [
            "Zakladatelský rozpočet není jen seznam výdajů.",
            "Volba právní formy souvisí s ručením, daněmi i administrativou.",
            "Mimořádné financování neřeší běžný provoz, ale nestandardní situace.",
        ],
        "questions": [
            q(
                "zakladni-otazky-pro-start",
                "11.1 Základní otázky pro zahájení podnikání",
                "Jaké základní otázky řeší podnikatel před zahájením podnikání?",
                [128],
                ["11.1"],
                ["zahájení-podnikání", "podnikatel", "příprava"],
                "Shrň, jaké základní otázky musí budoucí podnikatel vyřešit ještě před samotným startem podnikání.",
                [
                    "Musí zvážit výhody a nevýhody podnikání, vlastní motivaci, schopnosti a zázemí.",
                    "Potřebuje si ujasnit, v jakém oboru bude podnikat a jaký typ činnosti chce provozovat.",
                    "Řeší také právní formu, umístění, zdroje financování a celkovou realizovatelnost záměru.",
                ],
                "Přehledová odpověď může jít v logice: kdo bude podnikat, v čem, jakou formou, kde a z jakých zdrojů.",
                [
                    "Nepodceňuj osobní předpoklady podnikatele.",
                    "Neomezuj přípravu jen na formální založení firmy.",
                ],
                "Člověk s dobrým nápadem, ale bez finanční rezervy nebo bez podpory rodiny a partnerů může mít rozjezd mnohem těžší.",
                "Před startem podnikání řešíš člověka, obor, formu, místo i peníze.",
            ),
            q(
                "vyber-predmetu-podnikani",
                "11.1.1 Výběr předmětu podnikání",
                "Jak se vybírá předmět podnikání?",
                [128],
                ["11.1.1"],
                ["předmět-podnikání", "trh", "nápad"],
                "Vysvětli, podle čeho by měl začínající podnikatel vybírat předmět podnikání.",
                [
                    "Předmět podnikání by měl vycházet z poptávky na trhu a z neuspokojených potřeb zákazníků.",
                    "Současně musí odpovídat schopnostem, zkušenostem a znalostem podnikatele.",
                    "Jako zdroj nápadů slouží pozorování trhu, vlastních zkušeností, koníčků i již fungujících modelů.",
                ],
                "U této otázky se hodí dodat, že dobrý nápad nestačí bez reálné poptávky a bez schopnosti podnikatele ho zvládnout.",
                [
                    "Nevol předmět podnikání jen podle osobního nadšení bez ověření trhu.",
                    "Nezapomeň na vazbu mezi nápadem a schopnostmi podnikatele.",
                ],
                "Podnikatel si všimne opakovaného problému zákazníků, spojí to se svou dovedností a z toho postaví nový produkt nebo službu.",
                "Předmět podnikání má spojovat poptávku trhu a schopnost podnikatele ji obsloužit.",
            ),
            q(
                "volba-pravni-formy-podnikani",
                "11.1.2 Volba právní formy podnikání",
                "Podle čeho se volí právní forma podnikání?",
                [129, 130],
                ["11.1.2"],
                ["právní-forma", "ručení", "daně"],
                "Uveď hlavní kritéria pro volbu právní formy podnikání.",
                [
                    "Důležitý je rozsah ručení za závazky podniku a s tím spojené podnikatelské riziko.",
                    "Volbu ovlivňuje i požadovaný základní kapitál, administrativní náročnost a daňové dopady.",
                    "Rozhodující je také to, zda podniká jedna osoba nebo více zakladatelů.",
                ],
                "Tohle je propojení s první kapitolou. Nyní už ale právní formu neřešíš jen teoreticky, ale jako praktické podnikatelské rozhodnutí se skutečnými dopady.",
                [
                    "Není pravda, že jedna právní forma je nejlepší pro všechny podniky.",
                    "Nezapomeň na ručení a administrativní náročnost.",
                ],
                "OSVČ je jednodušší na založení, ale nese neomezené ručení; s.r.o. zase více chrání vlastníka, ale bývá administrativně náročnější.",
                "Právní forma určuje ručení, kapitál, daně i náročnost fungování.",
                2,
            ),
            q(
                "zakladatelsky-rozpocet",
                "11.2 Zpracování zakladatelského rozpočtu",
                "Co obsahuje zakladatelský rozpočet a proč je důležitý?",
                [131, 135],
                ["11.2", "11.2.2", "11.2.3"],
                ["zakladatelský-rozpočet", "potřeba-majetku", "zdroje-krytí"],
                "Vysvětli smysl zakladatelského rozpočtu a uveď, co by měl zachytit.",
                [
                    "Zakladatelský rozpočet převádí podnikatelský záměr do čísel a ukazuje, kolik majetku a peněz je na start potřeba.",
                    "Zachycuje potřebu dlouhodobého i oběžného majetku, provozní rezervy a zdroje krytí.",
                    "Pomáhá ověřit, zda je podnikatelský záměr finančně realistický a udržitelný.",
                ],
                "Silná odpověď neřeší jen investice do vybavení. Připomeň i zásoby, provozní rezervu a dobu do prvních příjmů.",
                [
                    "Neomezuj rozpočet jen na jednorázové pořizovací výdaje.",
                    "Nezapomeň, že vedle majetku musí řešit i zdroje financování.",
                ],
                "Nová kavárna potřebuje vybavení, zásoby, peníze na nájem a mzdy prvních měsíců i jasný plán, odkud tyto prostředky vezme.",
                "Zakladatelský rozpočet říká, kolik start stojí a odkud se to zaplatí.",
                2,
            ),
            q(
                "financovani-startu-a-mimoradne-financovani",
                "11.2.1 a 11.3 Financování začátku a mimořádné financování",
                "Jak se financuje začínající podnik a co je mimořádné financování?",
                [132, 137],
                ["11.2.1", "11.3"],
                ["financování", "začínající-podnikatel", "mimořádné-financování"],
                "Shrň základní možnosti financování začínajícího podnikatele a vysvětli, kdy se řeší mimořádné financování.",
                [
                    "Start podnikání bývá financován kombinací vlastních zdrojů, vkladů společníků, úvěrů nebo dalších forem podpory.",
                    "Začínající podnik musí dbát na finanční disciplínu a přiměřenou míru zadlužení.",
                    "Mimořádné financování řeší nestandardní situace, například rychlou expanzi, krizový výpadek nebo mimořádnou potřebu zdrojů.",
                ],
                "U sady A stačí chápat logiku zdrojů a rozlišit běžné financování rozjezdu od nestandardních finančních potřeb, které podnik nezvládne v běžném režimu.",
                [
                    "Neříkej, že nový podnik bez problémů získá jakýkoli úvěr.",
                    "Mimořádné financování není totéž co každodenní provozní financování.",
                ],
                "Podnik může při rychlé expanzi hledat mimořádné zdroje, protože běžný provozní režim už nestačí pokrýt zvýšenou potřebu kapitálu.",
                "Start podnikání je o kombinaci zdrojů; mimořádné financování řeší nestandardní tlak na peníze.",
                2,
            ),
        ],
    },
    {
        "number": 12,
        "slug": "metody-mezipodnikoveho-srovnavani",
        "title": "12. Metody mezipodnikového srovnávání",
        "summary_description": "Přehled srovnávacích metod a základů vícekriteriálního hodnocení variant.",
        "summary_tags": ["mezipodnikové-srovnávání", "rozhodovací-matice", "váhy", "vícekriteriální-hodnocení"],
        "key_points": [
            "Mezipodnikové srovnávání pomáhá hodnotit podnik v kontextu podobných subjektů nebo variant.",
            "Nejprve je nutné řešit srovnatelnost podniků a vhodnou volbu kritérií.",
            "Vedle jednorozměrných metod se používají i vícerozměrné metody, rozhodovací matice a vážení kritérií.",
        ],
        "memory_chain": [
            "Nejprve vysvětli smysl srovnávání a problém srovnatelnosti.",
            "Pak odliš jednorozměrné a vícerozměrné metody.",
            "Nakonec ukaž roli rozhodovací matice, vah a vícekriteriálního hodnocení.",
        ],
        "common_confusions": [
            "Jedno kritérium většinou nestačí pro složitější rozhodnutí.",
            "Váhy vyjadřují důležitost kritérií, ne konečný výsledek samy o sobě.",
            "Rozhodovací matice je pomůcka pro strukturované rozhodnutí, ne automatická odpověď.",
        ],
        "questions": [
            q(
                "smysl-mezipodnikoveho-srovnavani",
                "12. Úvod a 12.1 Jednorozměrné metody",
                "Proč se podniky mezi sebou srovnávají a co je podmínkou smysluplného srovnání?",
                [140],
                ["12.1"],
                ["mezipodnikové-srovnávání", "srovnatelnost", "benchmarking"],
                "Vysvětli smysl mezipodnikového srovnávání a proč se před vlastním porovnáním musí řešit srovnatelnost dat a podniků.",
                [
                    "Mezipodnikové srovnávání pomáhá poznat, jak si podnik vede vůči podobným subjektům nebo variantám.",
                    "Podniky musejí být srovnatelné z hlediska oboru, velikosti, prostředí a dalších relevantních okolností.",
                    "Teprve potom má smysl volit ukazatele a metody porovnání.",
                ],
                "Tahle otázka je hlavně o zdravém rozumu: nelze férově srovnávat nesrovnatelné. To je základ celé kapitoly.",
                [
                    "Neprováděj srovnání bez ověření srovnatelnosti podniků.",
                    "Neomezuj srovnatelnost jen na jedno kritérium, například velikost.",
                ],
                "Rentabilitu malé lokální firmy nelze bez dalších úprav jednoduše srovnat s velkou nadnárodní společností v jiném prostředí.",
                "Smysluplné srovnání začíná až tehdy, když srovnáváš opravdu srovnatelné subjekty.",
            ),
            q(
                "jednorozmerne-a-vicerozmerne-metody",
                "12.1 a 12.2 Jednorozměrné a vícerozměrné metody",
                "Jaký je rozdíl mezi jednorozměrnými a vícerozměrnými metodami srovnávání?",
                [140],
                ["12.1", "12.2"],
                ["jednorozměrné", "vícerozměrné", "kritéria"],
                "Porovnej jednorozměrné a vícerozměrné metody srovnávání podniků nebo variant.",
                [
                    "Jednorozměrné metody porovnávají podniky podle jednoho ukazatele.",
                    "Vícerozměrné metody pracují s více kritérii současně a často jim přiřazují váhy.",
                    "Vícerozměrný přístup je vhodný tam, kde jeden ukazatel nedává dostatečný obraz o kvalitě varianty.",
                ],
                "Na úrovni sady A stačí vysvětlit, že jednorozměrný pohled je jednoduchý, ale často příliš úzký pro složitější rozhodnutí.",
                [
                    "Jednorozměrná metoda není špatně sama o sobě, ale je omezená.",
                    "U vícerozměrných metod nezapomeň na roli více kritérií a jejich vah.",
                ],
                "Při výběru dodavatele nestačí sledovat jen cenu; důležitá může být i kvalita, spolehlivost a termín dodání.",
                "Jedno kritérium stačí jen někdy; složitější rozhodnutí potřebuje víc hledisek.",
            ),
            q(
                "rozhodovaci-matice",
                "12.2.1 Rozhodovací matice",
                "Co je rozhodovací matice a jak pomáhá při srovnání variant?",
                [140, 141],
                ["12.2.1"],
                ["rozhodovací-matice", "varianty", "kritéria"],
                "Vysvětli, co je rozhodovací matice a proč je užitečná při rozhodování mezi více variantami.",
                [
                    "Rozhodovací matice uspořádá varianty a hodnoticí kritéria do přehledné tabulky.",
                    "Pomáhá systematicky zachytit, jak si jednotlivé varianty vedou v různých parametrech.",
                    "Snižuje nejistotu a subjektivitu tím, že strukturuje celý rozhodovací problém.",
                ],
                "Silná odpověď ukáže, že matice nerozhoduje sama. Jen pomáhá, aby rozhodnutí bylo systematické, přehledné a obhajitelné.",
                [
                    "Rozhodovací matice není sama o sobě výsledkem rozhodnutí.",
                    "Kvalita matice závisí na vhodně zvolených kritériích a variantách.",
                ],
                "Při výběru investiční varianty lze v matici vedle sebe hodnotit výnos, riziko, cenu a dobu realizace.",
                "Rozhodovací matice přehledně skládá varianty a kritéria do jedné struktury.",
            ),
            q(
                "postup-tvorby-matice",
                "12.2.1 Postup práce s rozhodovací maticí",
                "Jak se rozhodovací matice vytváří a vyplňuje?",
                [141, 142],
                ["12.2.1"],
                ["postup", "kritéria", "hodnocení"],
                "Shrň základní postup při tvorbě rozhodovací matice od určení variant až po jejich hodnocení.",
                [
                    "Nejprve se stanoví porovnávané varianty a kritéria, podle nichž budou posuzovány.",
                    "Poté se vytvoří mřížka a varianty se u jednotlivých kritérií ohodnotí, například bodovou škálou.",
                    "Výsledkem je přehledné porovnání, které usnadní následný výběr nebo pořadí variant.",
                ],
                "Přehledová sada A nechce detailní matematiku. Stačí vysvětlit, že matice převádí složitou úvahu do kroků, kde nic důležitého nevynecháš.",
                [
                    "Bez dobré volby kritérií je i hezká tabulka k ničemu.",
                    "Nezapomeň, že varianty musejí být srovnatelné.",
                ],
                "Při výběru lokality pro pobočku se nejprve určí alternativy a poté se každá z nich bodově zhodnotí podle ceny, dostupnosti a poptávky.",
                "Rozhodovací matice dává rozhodnutí pevný postup: varianty, kritéria, hodnocení, srovnání.",
            ),
            q(
                "vahy-a-vicekriterialni-hodnoceni",
                "12.3 a 12.4 Váhy kritérií a vícekriteriální hodnocení",
                "Proč se stanovují váhy kritérií a jak funguje vícekriteriální hodnocení variant?",
                [144, 147],
                ["12.3", "12.4"],
                ["váhy", "vícekriteriální-hodnocení", "varianty"],
                "Vysvětli význam vah kritérií a podstatu vícekriteriálního hodnocení variant.",
                [
                    "Váhy vyjadřují důležitost jednotlivých kritérií v celkovém rozhodnutí.",
                    "Vícekriteriální hodnocení kombinuje hodnocení variant napříč více kritérii a hledá celkové pořadí nebo doporučení.",
                    "Výsledek závisí na kvalitě dat, volbě kritérií i správném nastavení vah.",
                ],
                "Tohle je pointa celé kapitoly: složitější rozhodnutí nejde zúžit na jediný ukazatel, ale zároveň je nutné mít jasný způsob, jak kritéria poskládat dohromady.",
                [
                    "Váha není bodové hodnocení varianty.",
                    "Matematický výsledek nenahrazuje manažerský úsudek.",
                ],
                "Cena může mít nižší váhu než spolehlivost dodavatele, pokud by výpadek dodávek znamenal vysoké ztráty pro celý podnik.",
                "Váhy říkají, co je důležitější; vícekriteriální hodnocení z toho skládá celkové rozhodnutí.",
                2,
            ),
        ],
    },
]


def quote(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def render_yaml_list(items: list[str], indent: int = 2) -> list[str]:
    prefix = " " * indent
    return [f"{prefix}- {quote(item)}" for item in items]


def render_yaml_number_list(items: list[int], indent: int = 2) -> list[str]:
    prefix = " " * indent
    return [f"{prefix}- {item}" for item in items]


def render_bullets(items: list[str]) -> str:
    return "\n".join(f"- {item}" for item in items)


def render_numbered(items: list[str]) -> str:
    return "\n".join(f"{index}. {item}" for index, item in enumerate(items, start=1))


def question_id(chapter_number: int, question_number: int) -> str:
    return f"ekopod-a-{chapter_number:02d}{question_number:02d}"


def summary_id(chapter_number: int) -> str:
    return f"shr-ekopod-a-{chapter_number:02d}"


def render_question_markdown(chapter: dict[str, object], question: dict[str, object], index: int) -> str:
    chap_num = int(chapter["number"])
    qid = question_id(chap_num, index)
    sid = summary_id(chap_num)
    pages = list(question["pages"])
    sections = list(question["sections"])
    page_label = ", ".join(str(page) for page in pages)
    section_label = ", ".join(sections)
    lines = [
        "---",
        f"id: {quote(qid)}",
        'set: "A"',
        f"chapter: {quote(str(chapter['title']))}",
        f"subchapter: {quote(str(question['subchapter']))}",
        f"title: {quote(str(question['title']))}",
        f"order: {chap_num * 100 + index}",
        "tags:",
        *render_yaml_list(list(question["tags"])),
        f"difficulty: {int(question['difficulty'])}",
        f"sourcePdfPath: {quote(f'pdf/{PDF_NAME}')}",
        "sourcePages:",
        *render_yaml_number_list(pages),
        "sourceSections:",
        *render_yaml_list(sections),
        f"summaryId: {quote(sid)}",
        "---",
        "## Otázka",
        str(question["prompt"]),
        "",
        "## Modelová odpověď",
        "Přehledová odpověď by měla pokrýt hlavně tyto body:",
        "",
        render_numbered(list(question["points"])),
        "",
        "## Osnova odpovědi",
        render_bullets(list(question["points"])),
        "",
        "## Detail",
        str(question["detail"]),
        "",
        "## Chytáky",
        render_bullets(list(question["pitfalls"])),
        "",
        "## Příklady / situace",
        str(question["example"]),
        "",
        "## Ve skriptech",
        (
            f"Ve skriptech si projdi oddíly {section_label} na stranách {page_label}. "
            "Tohle jsou pasáže, ze kterých je otázka postavená a které dávají nejjistější "
            "kostru odpovědi."
        ),
        "",
        "## AI souhrn",
        str(question["summary_hint"]),
    ]

    return "\n".join(lines).rstrip() + "\n"


def render_summary_markdown(chapter: dict[str, object]) -> str:
    chap_num = int(chapter["number"])
    sid = summary_id(chap_num)
    qids = [question_id(chap_num, index) for index in range(1, len(list(chapter["questions"])) + 1)]
    question_links = "\n".join(
        f"- [{qid}](question:{qid}) – {question['title']}"
        for qid, question in zip(qids, list(chapter["questions"]), strict=True)
    )
    lines = [
        "---",
        f"id: {quote(sid)}",
        f"title: {quote(f'Sada A · Kapitola {chap_num:02d}')}",
        f"chapter: {quote(str(chapter['title']))}",
        f"order: {chap_num * 100}",
        "tags:",
        *render_yaml_list(list(chapter["summary_tags"])),
        "relatedQuestionIds:",
        *render_yaml_list(qids),
        f"description: {quote(str(chapter['summary_description']))}",
        "---",
        f"# Sada A · Kapitola {chap_num:02d}",
        "",
        str(chapter["title"]),
        "",
        "## Co z kapitoly potřebuješ umět",
        render_bullets(list(chapter["key_points"])),
        "",
        "## Jak si kapitolu srovnat v hlavě",
        render_numbered(list(chapter["memory_chain"])),
        "",
        "## Nejčastější záměny",
        render_bullets(list(chapter["common_confusions"])),
        "",
        "## Otázky v sadě A",
        question_links,
        "",
        "> Tip: Sada A je přehledová. U každé otázky si nejdřív zkus vlastní definici a teprve potom kontroluj modelovou odpověď, detail a návaznost na skripta.",
    ]

    return "\n".join(lines).rstrip() + "\n"


def generate_content() -> None:
    pdf_path = PDF_ROOT / PDF_NAME
    if not pdf_path.exists():
        raise FileNotFoundError(f"V {PDF_ROOT} chybí {PDF_NAME}.")

    if QUESTIONS_ROOT.exists():
        shutil.rmtree(QUESTIONS_ROOT)
    if SUMMARIES_ROOT.exists():
        shutil.rmtree(SUMMARIES_ROOT)

    (QUESTIONS_ROOT / "set-a").mkdir(parents=True, exist_ok=True)
    SUMMARIES_ROOT.mkdir(parents=True, exist_ok=True)

    for chapter in CHAPTERS:
        chap_num = int(chapter["number"])
        summary_path = SUMMARIES_ROOT / f"{chap_num:03d}--{chapter['slug']}.md"
        summary_path.write_text(render_summary_markdown(chapter), encoding="utf-8")

        for index, question in enumerate(list(chapter["questions"]), start=1):
            question_path = QUESTIONS_ROOT / "set-a" / f"{chap_num:02d}{index:02d}--{question['slug']}.md"
            question_path.write_text(render_question_markdown(chapter, question, index), encoding="utf-8")

    sample_pdf = PDF_ROOT / SAMPLE_PDF_NAME
    if sample_pdf.exists():
        sample_pdf.unlink()


def main() -> None:
    generate_content()
    question_total = sum(len(list(chapter["questions"])) for chapter in CHAPTERS)
    print(f"Generated {question_total} questions and {len(CHAPTERS)} summaries for Set A.")


if __name__ == "__main__":
    main()
