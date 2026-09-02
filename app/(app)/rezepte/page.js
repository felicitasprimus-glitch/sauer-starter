"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const GRUNDSTOCK = [
  {
    "id": "g1",
    "kategorie": "Brote",
    "name": "Grundrezept Sauerteigbrot",
    "mehl_gramm": 500,
    "hydration": 66,
    "zutaten": "TEIG\n450 g Weizenmehl 550\n50 g Weizenvollkornmehl\n330 g Wasser, lauwarm\n100 g aktiver Sauerteigstarter\n10 g Salz\n\nHinweis: Der Starter sollte sich zuverlässig verdoppeln, bevor du ihn verwendest – er ist der Motor dieses Brots.",
    "schritte": "1. Autolyse: Mehle und Wasser mischen, bis keine trockenen Stellen mehr sichtbar sind. Abgedeckt 45 Min. ruhen lassen.\n2. Hauptteig: Aktiven Starter mit feuchten Händen einkneten, danach das Salz einarbeiten.\n3. Stockgare: 3–4 Std. bei 24–26 °C. In den ersten 2 Std. 3 Stretch & Folds. Ziel: ca. 60–70 % Volumenzunahme, gewölbte Oberfläche, Bläschen am Rand.\n4. Formen: Teig sanft rund- oder langwirken, bis die Oberfläche straff ist. Schluss nach oben ins bemehlte Gärkörbchen.\n5. Stückgare: Über Nacht (8–12 Std.) im Kühlschrank – oder 60–90 Min. warm, bis der Fingertest passt.\n\nBACKEN\nOfenmeister: kalt einschießen, 45–50 Min. bei 230 °C Ober-/Unterhitze, Deckel nach 35 Min. abnehmen.\nGusseisentopf: 30–45 Min. bei 250 °C vorheizen, 20 Min. mit Deckel bei 250 °C, dann 20–25 Min. offen bei 220 °C. Vorher ca. 1 cm tief einschneiden. Vollständig auskühlen lassen!\n\nTIPP: Basis aller Brote dieser Serie. Für mehr Aroma 50 g Mehl durch Roggenvollkorn ersetzen.\nVariationen: Saaten-Mix (80 g, geröstet), Röstzwiebeln, Oliven & Kräuter, Karotte & Walnuss, 20 % Dinkel."
  },
  {
    "id": "g2",
    "kategorie": "Brote",
    "name": "Pizza-Sauerteigbrot",
    "mehl_gramm": 500,
    "hydration": null,
    "zutaten": "TEIG\n500 g Weizenmehl 550\n170 g Wasser, lauwarm\n250 g passierte Tomaten\n100 g aktiver Sauerteigstarter\n10 g Salz\n2 TL italienische Kräuter\n½ TL Knoblauchpulver\n\nFÜLLUNG\n150 g Mozzarella oder Gouda, gerieben & gut abgetropft\n80 g Salami, in Stücken\n40 g Parmesan, gerieben\n60 g Oliven, halbiert\n\nOPTIONAL\nPaprika gewürfelt · Mais · Peperoni · Röstzwiebeln",
    "schritte": "1. Teig mischen: Starter, Wasser und passierte Tomaten verrühren. Mehl, Salz, Kräuter und Knoblauchpulver zugeben, zu einem klebrigen Teig mischen. 30 Min. ruhen lassen.\n2. Stockgare: 3–4 Std. bei 24–26 °C mit 3–4 Stretch & Folds im 30-Min.-Takt.\n3. Füllung Teil 1: Beim zweiten Fold die Oliven (und feste Wunschzutaten, gut abgetropft) auf dem Teig verteilen und einfalten.\n4. Formen mit Füllung: Teig ausbreiten, Salami und geriebenen Käse verteilen und beim Aufrollen einklappen. Straff formen, Schluss nach oben. Tipp: Alle Zutaten erst beim Formen einklappen hält sie schön in Schichten.\n5. Stückgare: Über Nacht im Kühlschrank oder 2–3 Std. warm, bis der Teig sichtbar aufgegangen ist.\n\nWICHTIG · TOMATEN SIND FLÜSSIGKEIT\nDie passierten Tomaten ersetzen einen Teil des Wassers – deshalb weniger Wasser als im Grundrezept. Sehr flüssige Tomaten? 20 g Wasser zurückhalten.\n\nBACKEN\nOfenmeister (kalt) oder vorgeheizter Gusseisentopf: 25 Min. mit Deckel bei 240 °C, dann 20 Min. offen bei 215 °C. Ausgetretener, gebräunter Käse ist das Highlight!\n\nTIPP: Mozzarella gut ausdrücken – je trockener der Käse, desto stabiler die Krume. Frisches Basilikum beim Servieren."
  },
  {
    "id": "g3",
    "kategorie": "Brote",
    "name": "Haselnuss-Apfel-Zimt-Brot",
    "mehl_gramm": 500,
    "hydration": null,
    "zutaten": "TEIG\n450 g Weizenmehl 550\n50 g Weizenvollkornmehl\n250 g Wasser + 25 g reserviert\n200 g Apfel, grob gerieben\n100 g aktiver Sauerteigstarter\n10 g Salz\n100 g Haselnüsse, geröstet & gehackt\n\nZIMTFÜLLUNG\n45 g Butter, weich (oder braune Butter, abgekühlt)\n80 g brauner Zucker\n1 TL Zimt\n1 TL Speisestärke\n½ TL Vanilleextrakt\n1 Prise Salz",
    "schritte": "1. Vorbereiten: Äpfel grob reiben und leicht ausdrücken. Haselnüsse in der Pfanne rösten, grob hacken.\n2. Teig mischen: Starter, Wasser, geriebenen Apfel und Mehle verrühren, 30 Min. ruhen. Dann Salz mit dem restlichen Wasser einarbeiten.\n3. Stockgare: 3–4 Std. bei 24–26 °C mit 3 Stretch & Folds. Beim zweiten Fold die Haselnüsse einarbeiten. Ziel: 40–50 % Volumenzunahme.\n4. Zimtfüllung: Weiche (oder braune) Butter mit Zucker, Zimt, Vanille, Stärke und Salz zu einer Paste verrühren.\n5. Formen mit Füllung: Teig zum Quadrat ausziehen, ⅔ der Paste aufstreichen, Seiten zur Mitte falten, restliche Paste darauf, aufrollen. Zügig arbeiten, direkt ins Gärkörbchen.\n6. Stückgare: Über Nacht (12–18 Std.) im Kühlschrank.\n\nWARUM ZIMT-ZUCKER ERST BEIM FORMEN?\nZucker zieht Wasser aus dem Teig (macht ihn weich), und Zimt bremst die Sauerteig-Mikroorganismen. Erst beim Formen eingearbeitet bleibt beides als karamellige Swirl-Schicht.\n\nBACKEN\nOfenmeister/Gusseisentopf: 25 Min. mit Deckel bei 240 °C, dann offen 20 Min. bei 200 °C (niedriger, damit austretender Zucker nicht verbrennt). Blech eine Schiene tiefer schützt den Boden.\n\nTIPP: Braune Butter hebt das Nussaroma. Säuerliche Äpfel (Boskoop, Elstar) halten die Balance zur Süße."
  },
  {
    "id": "g4",
    "kategorie": "Brote",
    "name": "Walnuss-Feigen-Brot",
    "mehl_gramm": 500,
    "hydration": 66,
    "zutaten": "TEIG\n500 g Weizenmehl\n330 g Wasser\n100 g aktiver Sauerteigstarter\n10 g Salz\n\nFÜLLUNG\n80–100 g Walnüsse, grob gehackt & angeröstet\n80–100 g getrocknete Feigen, gewürfelt\n80–100 g karamellisierte Balsamico-Zwiebeln\n1–2 EL frischer Rosmarin, fein gehackt",
    "schritte": "1. Autolyse: Mehl, Wasser und Starter vermengen und 30–60 Min. ruhen lassen.\n2. Salz einkneten.\n3. Stockgare: 3–4 Stretch & Folds. Walnüsse und Feigen beim ersten oder zweiten Fold vorsichtig einarbeiten.\n4. Formen: Karamellisierte Balsamico-Zwiebeln und Rosmarin beim Formen auf den ausgebreiteten Teig geben, dann straff aufrollen.\n5. Stückgare: Schluss nach oben ins Gärkörbchen. Direkt backen oder über Nacht im Kühlschrank reifen lassen.\n\nBACKEN\nLilly: ca. 45 Min. – für kräftige Kruste 5–10 Min. ohne Deckel fertig backen. Alternativ Gusseisentopf: 25 Min. mit Deckel bei 240 °C + 20 Min. offen bei 215 °C.\n\nTIPP: Walnüsse vorher anrösten. Zwiebeln gut auskühlen lassen. Passende Käse: Bergkäse, Ziegenfrischkäse, Gorgonzola dolce, Brie, Manchego."
  },
  {
    "id": "g5",
    "kategorie": "Brote",
    "name": "Jalapeño-Cheddar-Brot",
    "mehl_gramm": 500,
    "hydration": 68,
    "zutaten": "TEIG\n450 g Weizenmehl 550\n50 g Weizenvollkornmehl\n340 g Wasser, lauwarm\n100 g aktiver Sauerteigstarter\n11 g Salz\n\nFÜLLUNG\n170 g Cheddar (mittelalt), 1-cm-Würfel\n70 g eingelegte Jalapeños, abgetropft & gehackt\n\nOPTIONAL\n80 g Bacon, knusprig & zerkrümelt\n30 g Frühlingszwiebeln, in Ringen",
    "schritte": "1. Autolyse: Mehle und Wasser mischen, 45 Min. abgedeckt ruhen lassen.\n2. Hauptteig: Starter einkneten, dann Salz einarbeiten.\n3. Stockgare: 3–4 Std. bei 24–26 °C mit 3 Stretch & Folds. Beim zweiten Fold Cheddar, Jalapeños und Wunschzutaten einfalten. Ziel: 60–70 % Volumenzunahme.\n4. Formen: Rundwirken, bis die Oberfläche straff ist. Herausschauende Käsewürfel sanft hineindrücken – freiliegender Käse verbrennt.\n5. Stückgare: Über Nacht (8–12 Std.) im Kühlschrank oder 60–90 Min. warm.\n\nSO LÄUFT DER KÄSE NICHT AUS\nWürfel statt Reibekäse (Würfel bilden Taschen), beim Falten komplett mit Teig umschließen, sichtbare Stücke vor der Gare unter die Oberfläche drücken.\n\nBACKEN\nOfenmeister (kalt) oder Gusseisentopf: 20 Min. mit Deckel bei 250 °C, dann 20–25 Min. offen bei 220 °C. Mind. 1 Std. auskühlen lassen.\n\nTIPP: Eingelegte Jalapeños sind mild-würzig. Schärfer: ⅓ durch frische ersetzen. Milder: Kerne entfernen. Dips: Sour Cream mit Limette, Guacamole, Honig-Senf."
  },
  {
    "id": "g6",
    "kategorie": "Brote",
    "name": "Dubai-Schokoladenbrot",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "SCHOKOTEIG (AUSSEN)\n460 g Weizenmehl 550\n40 g Backkakao\n290 g Wasser\n100 g aktiver Sauerteig\n40 g brauner Zucker\n30 g Butter, weich\n10 g Salz\n100 g backfeste Zartbitter-Schokotropfen\n\nPISTAZIENTEIG (INNEN)\n500 g Weizenmehl 550\n260 g Wasser\n100 g aktiver Sauerteig\n40 g Zucker\n40 g Pistazienmus (100 %)\n150 g Pistazien, gehackt\n10 g Salz\n\nFÜLLUNG\n100 g Engelshaar (Kadayif)\n70 g Pistazienmus (100 %)\n20 g Puderzucker\n10 g Butter",
    "schritte": "1. Autolyse (beide Teige getrennt): Jeweils Mehl (+ Kakao beim Schokoteig) und Wasser mischen, 45 Min. ruhen. Ein Teil des Wassers im Schokoteig darf durch Kaffee ersetzt werden.\n2. Hauptteige: Jeweils Starter einkneten, Zucker unterkneten. Schokoteig: Butter, dann Salz. Pistazienteig: Pistazienmus, dann Salz.\n3. Stockgare: Schokoteig 2,5–3 Std. (Ziel 60–65 %), beim 1. Fold Schokotropfen einarbeiten. Pistazienteig 3–4 Std. (Ziel 70–75 %), Pistazien einarbeiten. Jeweils bei 22–24 °C.\n4. Engelshaar-Füllung: Kadayif zerbröseln, in Butter goldbraun rösten, vollständig abkühlen. Pistazienmus und Puderzucker unterheben, bis eine formbare Masse entsteht.\n5. Füllen & Formen: Schokoteig zum Rechteck (1–1,5 cm), Pistazienteig gleich groß daraufsetzen. Füllung auf den Pistazienteig streichen, 2 cm Rand lassen. Wie ein Päckchen falten, Nähte versiegeln, umdrehen, sanft Spannung aufbauen.\n6. Endruhe: 30–45 Min. bei Raumtemperatur oder über Nacht im Kühlschrank.\n\nBACKEN\nGusseisentopf inkl. Deckel mind. 30 Min. bei 225 °C vorheizen, dann 40 Min. bei 225 °C mit Deckel. Ofenmeister: kalt einschießen, 50 Min. bei 225 °C, letzte 10 Min. offen.\n\nTIPP: Engelshaar vollständig abkühlen, bevor Pistazienmus dazukommt. Nähte doppelt prüfen – nur eine dichte Hülle hält die Füllung.\nVariationen: Haselnussmus statt Pistazie, weiße Schokotropfen, Orangenabrieb im Schokoteig, Meersalzflocken aufs fertige Brot."
  },
  {
    "id": "g7",
    "kategorie": "Brote",
    "name": "Kürbisbrot – Pumpkin Spice",
    "mehl_gramm": 1000,
    "hydration": 70,
    "zutaten": "Ergibt 2 Brote.\n\nTEIG\n1000 g Pizzeria-Mehl\nca. 700 g Wasser\n400 g aktiver Sauerteigstarter\n1 Hokkaido-Kürbis\n25 g Salz\n\nPUMPKIN SPICE\n4 TL Zimt\n2 TL gemahlener Ingwer\n1 TL Muskat\n1 TL gemahlene Nelken\n½ TL Piment\n\nPUMPKIN-SPICE-BUTTER\n250 g weiche Butter\nbrauner Zucker nach Geschmack\n2 EL Speisestärke\nkomplette Pumpkin-Spice-Mischung",
    "schritte": "1. Hokkaido würfeln, ca. 15 Min. im Ofen weich backen, dann weitergaren. Nicht pürieren.\n2. Mehl, Wasser, Starter und Salz mischen. Kürbiswürfel vorsichtig einkneten.\n3. Butter, braunen Zucker, Speisestärke und die komplette Pumpkin-Spice-Mischung verrühren.\n4. Zu 2 Platten streichen, einfrieren und beim Formen zwischen die Teiglagen geben.\n5. Für die Kürbisform die Brote 30–45 Min. anfrieren, dann mit Schnüren abbinden und einschneiden.\n6. Mit Dampf backen. Etwas auslaufende Butter ist normal.\n\nTIPP\nKürbisstückchen statt Püree = saftigere Krume mit echten Stückchen. Die orange Farbe kommt nur vom Hokkaido. Serviervorschlag: noch leicht warm mit Lotus Biscoff Creme."
  },
  {
    "id": "g8",
    "kategorie": "Brote",
    "name": "Japanisches Toastbrot",
    "mehl_gramm": 1000,
    "hydration": null,
    "zutaten": "HAUPTTEIG\n1000 g starkes Mehl\n60 g Olivenöl\n50 g Zucker\nca. 300 g Lievito Madre (LM)\n23 g Salz\n550 g Wasser\n\nKOCHSTÜCK (ergibt ca. 350 g)\n100 g Mehl\n250 g Milch\n\nBRÜHSTÜCK (ergibt ca. 175 g)\n50 g Brotbrösel\n125 g Milch\n\nMEINE VARIANTE\nmit Olivenöl · statt Hefe ca. 300 g LM · Koch- und Brühstück mit Milch",
    "schritte": "Hinweis: Diese Kurzanleitung ist ein Entwurf (auf dem Bild waren nur die Zutaten). Bitte prüfen/anpassen.\n\n1. Kochstück: Mehl und Milch verrühren, unter Rühren erhitzen, bis eine puddingartige Masse entsteht. Vollständig abkühlen lassen.\n2. Brühstück: Brotbrösel mit der Milch übergießen und quellen lassen.\n3. Hauptteig: Alle Zutaten inkl. abgekühltem Koch- und Brühstück zu einem geschmeidigen, glatten Teig kneten.\n4. Stockgare bei Raumtemperatur, bis der Teig deutlich aufgegangen ist.\n5. Formen und in gefettete Kastenformen legen, Stückgare bis knapp unter den Formrand.\n6. Backen (mit Dampf), bis das Brot goldbraun ist und hohl klingt. Vollständig auskühlen lassen.\n\nTIPP: Koch- und Brühstück machen die Krume besonders saftig und lange frisch."
  },
  {
    "id": "d01",
    "name": "Schnelles Discard-Topfbrot",
    "kategorie": "Discard · Brote & Brötchen",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n350 g Weizenmehl 550\n220 g Wasser (lauwarm)\n7 g Salz\n3 g Trockenhefe",
    "schritte": "Ein knuspriges Topfbrot, das dank etwas Hefe schon am selben Tag fertig ist. Der Discard gibt ihm das typisch säuerliche Sauerteig-Aroma, ohne dass du tagelang führen musst.\n\n1. Alle Zutaten zu einem klebrigen Teig verrühren, 10 Min ruhen lassen.\n2. 3× im Abstand von je 20 Min dehnen und falten.\n3. 1,5–2 Std gehen lassen, bis sichtbar aufgegangen.\n4. Rundwirken, im bemehlten Gärkörbchen 45 Min gehen lassen.\n5. Topf mit Deckel aufheizen, Brot einschießen, einschneiden.\n\nBacken: 250 °C, 20 Min mit Deckel, dann 20–25 Min ohne Deckel bei 220 °C.\nAufbewahrung: In Bienenwachstuch oder Brotkasten 3–4 Tage, anschnittflächig.\nVariation: 50 g Mehl durch Roggenvollkorn ersetzen für kräftigeren Geschmack."
  },
  {
    "id": "d02",
    "name": "Discard-Soda-Bread (ohne Hefe)",
    "kategorie": "Discard · Brote & Brötchen",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n350 g Weizenmehl 1050\n250 g Buttermilch\n9 g Natron\n7 g Salz",
    "schritte": "Das schnellste Brot der Welt – ganz ohne Gehzeit. Natron und Buttermilch treiben den Teig, der Discard sorgt für Würze.\n\n1. Trockene Zutaten mischen.\n2. Discard und Buttermilch zügig unterrühren, nur kurz zu einem Teig zusammenfügen.\n3. Zu einem runden Laib formen, kreuzförmig tief einschneiden.\n4. Sofort backen (Teig nicht stehen lassen, sonst lässt der Trieb nach).\n\nBacken: 200 °C Ober-/Unterhitze, 40–45 Min.\nAufbewahrung: Am besten frisch; 2 Tage haltbar, danach toasten.\nVariation: Mit Körnern, Rosinen oder geriebenem Käse."
  },
  {
    "id": "d03",
    "name": "Discard-Vollkornbrot",
    "kategorie": "Discard · Brote & Brötchen",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n300 g Weizenvollkornmehl\n100 g Weizenmehl 550\n250 g Wasser\n8 g Salz\n4 g Trockenhefe\n30 g Sonnenblumenkerne",
    "schritte": "Ein nahrhaftes Kastenbrot mit hohem Vollkornanteil, das durch den Discard schön aromatisch wird. Die Hefe sorgt für zuverlässigen Trieb trotz schwerem Mehl.\n\n1. Alles zu einem Teig kneten (5 Min), Kerne unterheben.\n2. 1 Std gehen lassen.\n3. In eine gefettete Kastenform geben, glattstreichen, 45 Min gehen lassen.\n4. Mit Wasser besprühen, mit Kernen bestreuen.\n\nBacken: 220 °C, 10 Min, dann 200 °C, 35 Min.\nAufbewahrung: Brotkasten, bis zu 5 Tage.\nVariation: Dinkelvollkorn statt Weizenvollkorn."
  },
  {
    "id": "d04",
    "name": "Discard-Frühstücksbrötchen",
    "kategorie": "Discard · Brote & Brötchen",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n400 g Weizenmehl 550\n200 g Wasser\n8 g Salz\n4 g Trockenhefe\n10 g Zucker",
    "schritte": "Knusprige Sonntagsbrötchen mit Sauerteignote. Über Nacht im Kühlschrank entwickeln sie noch mehr Aroma.\n\n1. Teig 8 Min kneten, 1 Std gehen lassen.\n2. In 8 Stücke teilen, rundwirken.\n3. Über Nacht abgedeckt im Kühlschrank gehen lassen.\n4. Morgens einschneiden, mit Wasser besprühen.\n\nBacken: 230 °C mit Dampf, 18–20 Min.\nAufbewahrung: Frisch am besten; aufbacken oder einfrieren.\nVariation: Mit Mohn, Sesam oder Käse bestreuen."
  },
  {
    "id": "d05",
    "name": "Schnelle Joghurt-Discard-Brötchen",
    "kategorie": "Discard · Brote & Brötchen",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n300 g Weizenmehl 405\n150 g Naturjoghurt\n10 g Backpulver\n6 g Salz",
    "schritte": "Hefefreie Brötchen mit Backpulver und Joghurt – in 30 Minuten auf dem Tisch. Perfekt für spontanen Brötchenhunger.\n\n1. Alles zu einem weichen Teig verkneten.\n2. In 6 Stücke teilen, rund formen.\n3. Kreuzweise einschneiden.\n\nBacken: 200 °C, 20–22 Min.\nAufbewahrung: Am selben Tag genießen.\nVariation: Geriebenen Käse oder Kräuter in den Teig."
  },
  {
    "id": "d06",
    "name": "Dinkel-Discard-Knusperbrötchen",
    "kategorie": "Discard · Brote & Brötchen",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "180 g Discard\n400 g Dinkelmehl 630\n180 g Wasser\n8 g Salz\n3 g Trockenhefe",
    "schritte": "Rustikale Dinkelbrötchen mit kräftiger Kruste. Der Discard macht die Krume schön saftig.\n\n1. Teig kneten, 1 Std gehen lassen.\n2. 8 Brötchen formen, 40 Min gehen lassen.\n3. Bemehlen, längs einschneiden.\n\nBacken: 230 °C mit Dampf, 18 Min.\nAufbewahrung: Frisch oder eingefroren.\nVariation: Mit Saatenmischung im Teig. Bagels"
  },
  {
    "id": "d07",
    "name": "Klassische Discard-Bagels",
    "kategorie": "Discard · Brote & Brötchen",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n400 g Weizenmehl 550\n180 g Wasser\n8 g Salz\n4 g Trockenhefe\n15 g Zucker\nfürs Kochbad: 1 EL Honig",
    "schritte": "Außen glänzend, innen herrlich zäh – echte New-York-Bagels mit Sauerteignote. Das kurze Kochbad vor dem Backen ist das Geheimnis.\n\n1. Festen Teig kneten, 1 Std gehen lassen.\n2. In 8 Stücke teilen, zu Ringen formen, 20 Min ruhen.\n3. Je 1 Min pro Seite im Honigwasser kochen.\n4. Bestreuen, backen.\n\nBacken: 220 °C, 20–22 Min.\nAufbewahrung: 2 Tage; halbiert einfrieren, direkt toasten.\nVariation: Sesam, Mohn, Everything-Bagel-Gewürz."
  },
  {
    "id": "d08",
    "name": "Zimt-Rosinen-Bagels",
    "kategorie": "Discard · Brote & Brötchen",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n400 g Weizenmehl 550\n180 g Wasser\n6 g Salz\n4 g Trockenhefe\n20 g Zucker\n5 g Zimt\n60 g Rosinen",
    "schritte": "Süße Frühstücksbagels mit Zimt und Rosinen. Getoastet mit Butter ein Traum.\n\n1. Teig kneten, Zimt, Zucker und Rosinen einarbeiten.\n2. 1 Std gehen, formen, 20 Min ruhen.\n3. 1 Min pro Seite kochen, backen.\n\nBacken: 220 °C, 20 Min.\nAufbewahrung: 2 Tage; einfrieren möglich.\nVariation: Cranberrys statt Rosinen. Pizza"
  },
  {
    "id": "d09",
    "name": "Discard-Pizzateig über Nacht",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n400 g Mehl Tipo 00\n220 g Wasser\n8 g Salz\n2 g Trockenhefe\n10 g Olivenöl",
    "schritte": "Luftig-knuspriger Pizzaboden mit langer kalter Gare. Der Discard gibt dem Teig Charakter wie beim italienischen Vorteig.\n\n1. Teig kneten, 30 Min ruhen.\n2. Über Nacht (12–24 Std) im Kühlschrank gehen lassen.\n3. In 2 Kugeln teilen, 2 Std akklimatisieren.\n4. Ausziehen, belegen.\n\nBacken: So heiß wie möglich (250–300 °C), 8–12 Min.\nAufbewahrung: Teig 3 Tage im Kühlschrank.\nVariation: 50 g Vollkornmehl für mehr Biss."
  },
  {
    "id": "d10",
    "name": "Schnelle Discard-Pfannenpizza",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n100 g Mehl\n5 g Backpulver\n3 g Salz\nBelag nach Wahl",
    "schritte": "Hefefreie Mini-Pizza direkt aus der Pfanne – in 15 Minuten fertig. Ideal, wenn's schnell gehen muss.\n\n1. Discard, Mehl, Backpulver, Salz zu einem Teig rühren.\n2. In geölter Pfanne flach ausstreichen.\n3. Bei mittlerer Hitze 4 Min anbacken, belegen.\n4. Deckel drauf, bis Käse schmilzt.\n\nBacken: Mittlere Herdhitze, ca. 10 Min.\nAufbewahrung: Frisch genießen.\nVariation: Als süße Variante mit Apfel und Zimt."
  },
  {
    "id": "d11",
    "name": "Discard-Focaccia-Pizza vom Blech",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n400 g Weizenmehl 550\n280 g Wasser\n9 g Salz\n3 g Trockenhefe\n30 g Olivenöl",
    "schritte": "Dicke, fluffige Blechpizza im Focaccia-Stil. Der Discard sorgt für aromatische Tiefe.\n\n1. Weichen Teig rühren, 2 Std gehen lassen.\n2. Auf geöltem Blech ausziehen, 1 Std gehen.\n3. Mit den Fingern Dellen drücken, belegen.\n\nBacken: 230 °C, 22–25 Min.\nAufbewahrung: 2 Tage; aufbacken.\nVariation: Mit Pesto statt Tomatensauce."
  },
  {
    "id": "d12",
    "name": "Discard-Focaccia mit Rosmarin",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n400 g Mehl Tipo 00\n300 g Wasser\n9 g Salz\n3 g Trockenhefe\n40 g Olivenöl\nRosmarin, grobes Meersalz",
    "schritte": "Goldene, olivenölgetränkte Focaccia mit knuspriger Oberfläche und fluffiger Krume. Der Klassiker zum Verlieben.\n\n1. Sehr weichen Teig rühren, 2 Std gehen.\n2. Auf geöltem Blech verteilen, 1 Std gehen.\n3. Dellen drücken, mit Öl beträufeln, Rosmarin und Salz drauf.\n\nBacken: 220 °C, 25 Min.\nAufbewahrung: 2 Tage; aufbacken.\nVariation: Mit Weintrauben oder Kirschtomaten."
  },
  {
    "id": "d13",
    "name": "Tomaten-Oliven-Discard-Focaccia",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n400 g Mehl\n300 g Wasser\n9 g Salz\n3 g Trockenhefe\n40 g Olivenöl\nCherrytomaten, Oliven, Oregano",
    "schritte": "Mediterrane Focaccia mit Cherrytomaten und Oliven – ein Stück Urlaub. Perfekt zu Antipasti.\n\n1. Teig wie oben ansetzen, 2 Std gehen.\n2. Aufs Blech, 1 Std gehen.\n3. Tomaten und Oliven eindrücken, würzen.\n\nBacken: 220 °C, 25 Min.\nAufbewahrung: 2 Tage.\nVariation: Mit Feta nach dem Backen."
  },
  {
    "id": "d14",
    "name": "Saaten-Discard-Cracker",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "120 g Discard\n50 g Dinkel- oder Roggenvollkornmehl\n40 g Olivenöl\n15 g Saaten\n5 g Salz\nPaprika edelsüß\nzum Bestreuen: 30 g Saaten/Kerne",
    "schritte": "Die knusprigsten Cracker überhaupt – dünn ausgerollt und mit Saaten bestreut. Mein Liebling für den Snackteller.\n\n1. Alles zu einem Teig verkneten.\n2. Auf Backpapier 1–2 mm dünn ausrollen (Folie oben drauf).\n3. Saaten andrücken, in Knabbergröße schneiden.\n\nBacken: 170 °C, 15–20 Min.\nAufbewahrung: Luftdicht 1–2 Wochen.\nVariation: Auf dem James gebacken werden sie besonders gleichmäßig knusprig."
  },
  {
    "id": "d15",
    "name": "Rosmarin-Parmesan-Cracker",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "120 g Discard\n50 g Mehl\n35 g Olivenöl\n40 g geriebener Parmesan\n4 g Salz\n1 EL gehackter Rosmarin",
    "schritte": "Herzhaft-würzige Cracker mit Parmesan und Rosmarin. Schmecken wie aus der Feinkostabteilung.\n\n1. Teig verkneten, dünn ausrollen.\n2. In Quadrate schneiden, mit Salz bestreuen.\n\nBacken: 175 °C, 15 Min.\nAufbewahrung: Luftdicht 1 Woche.\nVariation: Mit Chiliflocken für Schärfe."
  },
  {
    "id": "d16",
    "name": "Süße Schoko-Discard-Cracker",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "120 g Discard\n50 g Mehl\n30 g Butter (weich)\n30 g Zucker\n10 g Kakao\n1 Prise Salz",
    "schritte": "Knusprige, leicht süße Cracker mit Kakao – wie dünne Schokokekse. Toll zu Kaffee.\n\n1. Teig verkneten, dünn ausrollen.\n2. In Stücke schneiden, mit Zucker bestreuen.\n\nBacken: 165 °C, 12–15 Min.\nAufbewahrung: Luftdicht 1 Woche.\nVariation: Mit Zimt oder Meersalz oben drauf. Waffeln"
  },
  {
    "id": "d17",
    "name": "Knusprige Discard-Waffeln über Nacht",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n150 g Mehl\n250 g Milch\n2 Eier\n50 g zerlassene Butter\n5 g Backpulver\n10 g Zucker\n1 Prise Salz",
    "schritte": "Außen knusprig, innen fluffig – die besten Waffeln, die du je gemacht hast. Der Teig reift über Nacht und wird besonders aromatisch.\n\n1. Abends Discard, Mehl, Milch und Zucker verrühren, über Nacht abgedeckt stehen lassen.\n2. Morgens Eier, Butter, Backpulver, Salz unterrühren.\n3. Im Waffeleisen backen.\n\nBacken: Waffeleisen, je ca. 4 Min.\nAufbewahrung: Einfrieren, im Toaster aufbacken.\nVariation: Mit Vanille oder Schokostückchen."
  },
  {
    "id": "d18",
    "name": "Herzhafte Käse-Kräuter-Waffeln",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n150 g Mehl\n200 g Milch\n2 Eier\n40 g Butter\n5 g Backpulver\n60 g geriebener Käse\nSchnittlauch\nSalz, Pfeffer",
    "schritte": "Pikante Waffeln mit Käse und Kräutern – ideal als Snack oder zur Suppe. Mal was anderes als süß.\n\n1. Alle Zutaten zu einem Teig verrühren.\n2. Käse und Kräuter unterheben.\n3. Im Waffeleisen backen.\n\nBacken: Waffeleisen, je ca. 4–5 Min.\nAufbewahrung: Am selben Tag oder einfrieren.\nVariation: Mit gewürfeltem Speck. Pancakes"
  },
  {
    "id": "d19",
    "name": "Fluffige Discard-Pancakes",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n120 g Mehl\n200 g Milch\n1 Ei\n30 g Zucker\n5 g Backpulver\n3 g Natron\n1 Prise Salz\n20 g Butter",
    "schritte": "Dicke, amerikanische Pancakes mit feiner Säure. Der Discard macht sie unglaublich saftig.\n\n1. Discard, Milch, Ei, Zucker verrühren.\n2. Mehl, Backpulver, Natron, Salz unterheben (Teig sprudelt leicht).\n3. Portionsweise in Butter goldbraun backen.\n\nBacken: Mittlere Hitze, je 2–3 Min pro Seite.\nAufbewahrung: Frisch am besten.\nVariation: Mit Blaubeeren oder Bananenscheiben im Teig."
  },
  {
    "id": "d20",
    "name": "Apfel-Zimt-Discard-Pfannkuchen",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n100 g Mehl\n250 g Milch\n2 Eier\n20 g Zucker\n1 Apfel (gewürfelt)\nZimt\n1 Prise Salz",
    "schritte": "Dünne Pfannkuchen mit Apfelstücken und Zimt – Kindheitserinnerung pur. Der Discard sorgt für extra Aroma.\n\n1. Discard, Mehl, Milch, Eier, Zucker zu dünnem Teig verrühren.\n2. Apfel und Zimt unterheben.\n3. In der Pfanne dünn ausbacken.\n\nBacken: Mittlere Hitze, je 2 Min pro Seite.\nAufbewahrung: Frisch genießen.\nVariation: Mit Birne statt Apfel. Muffins"
  },
  {
    "id": "d21",
    "name": "Bananen-Discard-Muffins",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n200 g Mehl\n2 reife Bananen (zerdrückt)\n80 g Zucker\n1 Ei\n60 g Öl\n8 g Backpulver\n3 g Natron\n1 Prise Salz",
    "schritte": "Saftige Bananenmuffins, die reife Bananen und Discard sinnvoll verwerten. Bleiben tagelang weich.\n\n1. Feuchte Zutaten verrühren.\n2. Trockene Zutaten unterheben, nicht überrühren.\n3. In Muffinförmchen füllen (⅔ voll).\n\nBacken: 180 °C, 22–25 Min.\nAufbewahrung: Luftdicht 4 Tage.\nVariation: Mit Walnüssen oder Schokostückchen."
  },
  {
    "id": "d22",
    "name": "Blaubeer-Discard-Muffins",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n220 g Mehl\n100 g Zucker\n1 Ei\n80 g Öl\n100 g Milch\n8 g Backpulver\n120 g Blaubeeren",
    "schritte": "Klassische Blaubeermuffins mit zartem Krümel. Discard macht sie besonders saftig.\n\n1. Feuchte Zutaten verrühren.\n2. Mehl und Backpulver unterheben.\n3. Blaubeeren vorsichtig unterheben, einfüllen.\n\nBacken: 180 °C, 22 Min.\nAufbewahrung: 3 Tage luftdicht.\nVariation: Mit Zitronenabrieb."
  },
  {
    "id": "d23",
    "name": "Herzhafte Käse-Speck-Muffins",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n200 g Mehl\n2 Eier\n100 g Milch\n60 g Öl\n8 g Backpulver\n80 g geriebener Käse\n80 g gewürfelter Speck\nSalz, Pfeffer",
    "schritte": "Pikante Muffins mit Käse und Speck – perfekt fürs Frühstück oder Picknick. Eine herzhafte Discard-Verwertung.\n\n1. Feuchte Zutaten verrühren.\n2. Mehl, Backpulver, Käse, Speck unterheben.\n3. Einfüllen.\n\nBacken: 180 °C, 22–25 Min.\nAufbewahrung: 3 Tage; gut zum Einfrieren.\nVariation: Mit Frühlingszwiebeln."
  },
  {
    "id": "d24",
    "name": "Saftiger Discard-Schokokuchen",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n200 g Mehl\n180 g Zucker\n50 g Kakao\n2 Eier\n120 g Öl\n150 g Milch\n10 g Backpulver\n1 Prise Salz",
    "schritte": "Ein dunkler, saftiger Schokokuchen, bei dem niemand den Discard erahnt. Die feine Säure verstärkt sogar das Schokoaroma.\n\n1. Eier und Zucker schaumig rühren.\n2. Öl, Milch, Discard unterrühren.\n3. Mehl, Kakao, Backpulver unterheben, in Form füllen.\n\nBacken: 175 °C, 40–45 Min (Stäbchenprobe).\nAufbewahrung: Luftdicht 5 Tage – wird saftiger.\nVariation: Mit Schokostückchen oder als Gugelhupf."
  },
  {
    "id": "d25",
    "name": "Zitronen-Discard-Kuchen",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n220 g Mehl\n150 g Zucker\n3 Eier\n120 g weiche Butter\nAbrieb + Saft von 2 Zitronen\n10 g Backpulver\nGuss: 100 g Puderzucker + Zitronensaft",
    "schritte": "Frischer Zitronenkuchen mit Guss – sommerlich-leicht. Discard hält ihn lange saftig.\n\n1. Butter und Zucker cremig rühren, Eier einzeln einrühren.\n2. Discard, Zitrone, dann Mehl und Backpulver unterheben.\n3. Backen, abkühlen, mit Guss überziehen.\n\nBacken: 175 °C, 45–50 Min.\nAufbewahrung: 5 Tage luftdicht.\nVariation: Als Mini-Kuchen oder mit Mohn."
  },
  {
    "id": "d26",
    "name": "Discard-Bananenbrot",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n250 g Mehl\n3 reife Bananen\n100 g Zucker\n2 Eier\n80 g Öl\n10 g Backpulver\n3 g Natron\nZimt\n1 Prise Salz",
    "schritte": "Das ultimative Resteverwertungs-Gebäck: reife Bananen plus Discard. Saftig, aromatisch, gelingsicher.\n\n1. Bananen zerdrücken, mit feuchten Zutaten verrühren.\n2. Trockene Zutaten unterheben.\n3. In Kastenform füllen.\n\nBacken: 170 °C, 55–60 Min.\nAufbewahrung: 5 Tage; lässt sich einfrieren.\nVariation: Mit Schokostückchen oder Nüssen. Kekse"
  },
  {
    "id": "d27",
    "name": "Discard-Chocolate-Chip-Cookies",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "100 g Discard\n180 g Mehl\n120 g weiche Butter\n100 g brauner Zucker\n50 g Zucker\n1 Ei\n5 g Backpulver\n1 Prise Salz\n120 g Schokostückchen",
    "schritte": "Außen knusprig, innen weich, mit Schokostückchen – der Discard gibt einen feinen, fast karamelligen Tiefgang.\n\n1. Butter und Zucker cremig rühren, Ei und Discard unterrühren.\n2. Mehl, Backpulver, Salz, Schoko unterheben.\n3. Häufchen auf Blech setzen (Abstand!).\n\nBacken: 180 °C, 10–12 Min.\nAufbewahrung: Luftdicht 1 Woche; Teig einfrierbar.\nVariation: Mit Meersalz oben drauf."
  },
  {
    "id": "d28",
    "name": "Haferflocken-Discard-Kekse",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "100 g Discard\n120 g Mehl\n100 g zarte Haferflocken\n100 g Butter\n100 g brauner Zucker\n1 Ei\n5 g Backpulver\nZimt\n60 g Rosinen",
    "schritte": "Rustikale Hafer-Kekse mit Biss, die lange satt machen. Discard und Hafer sind ein perfektes Team.\n\n1. Butter und Zucker rühren, Ei und Discard dazu.\n2. Mehl, Hafer, Backpulver, Rosinen unterheben.\n3. Häufchen formen, leicht flach drücken.\n\nBacken: 175 °C, 12–14 Min.\nAufbewahrung: 1 Woche luftdicht.\nVariation: Mit Cranberrys und weißer Schoko."
  },
  {
    "id": "d29",
    "name": "Discard-Shortbread",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "80 g Discard\n200 g Mehl\n130 g kalte Butter\n70 g Zucker\n1 Prise Salz",
    "schritte": "Buttrig-mürbes Shortbread mit nur wenigen Zutaten. Der Discard bringt eine überraschende Tiefe in das schlichte Gebäck.\n\n1. Alles zu einem Teig verkneten, kalt stellen (30 Min).\n2. Ausrollen, ausstechen, mit Gabel einstechen.\n\nBacken: 160 °C, 15–18 Min (hell lassen).\nAufbewahrung: 2 Wochen luftdicht.\nVariation: Mit Lavendel oder Zitronenabrieb."
  },
  {
    "id": "d30",
    "name": "Discard-Zimtschnecken über Nacht",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n400 g Mehl\n150 g Milch\n1 Ei\n60 g Butter\n50 g Zucker\n5 g Trockenhefe\nFüllung: 80 g Butter, 100 g brauner Zucker, 15 g Zimt\nGlasur: 100 g Frischkäse, 50 g Puderzucker",
    "schritte": "Flauschige Zimtschnecken mit Frischkäse-Glasur, perfekt fürs Wochenende. Die kalte Übernachtgare macht sie besonders aromatisch.\n\n1. Teig kneten, 1 Std gehen, über Nacht in den Kühlschrank.\n2. Ausrollen, mit Füllung bestreichen, aufrollen, schneiden.\n3. Morgens 45 Min gehen lassen, backen, glasieren.\n\nBacken: 180 °C, 22–25 Min.\nAufbewahrung: 2 Tage; kurz aufwärmen.\nVariation: Mit Pekannüssen oder Apfel."
  },
  {
    "id": "d31",
    "name": "Schnelle Discard-Zimtschnecken",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n300 g Mehl\n120 g Joghurt\n40 g Butter\n12 g Backpulver\nFüllung: 60 g Butter, 80 g Zucker, Zimt",
    "schritte": "Zimtschnecken ohne Hefe und Wartezeit – mit Backpulver in unter einer Stunde fertig. Für den spontanen Süßhunger.\n\n1. Teig verkneten, ausrollen.\n2. Füllung bestreichen, aufrollen, schneiden.\n3. Sofort backen.\n\nBacken: 190 °C, 20 Min.\nAufbewahrung: Am selben Tag am besten.\nVariation: Mit Vanilleglasur."
  },
  {
    "id": "d32",
    "name": "Klassischer Discard-Flammkuchen",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n200 g Mehl\n80 g Wasser\n15 g Öl\n4 g Salz\nBelag: 150 g Crème fraîche, 1 Zwiebel, 100 g Speckwürfel, Muskat",
    "schritte": "Hauchdünner Flammkuchen mit Crème fraîche, Zwiebeln und Speck. Der Discard-Boden wird knusprig wie beim Elsässer Original.\n\n1. Teig verkneten, 15 Min ruhen.\n2. Sehr dünn ausrollen.\n3. Crème fraîche bestreichen, Zwiebel und Speck verteilen.\n\nBacken: 250 °C (so heiß wie möglich), 12–15 Min.\nAufbewahrung: Frisch genießen.\nVariation: Auf dem James gebacken besonders knusprig."
  },
  {
    "id": "d33",
    "name": "Birne-Ziegenkäse-Flammkuchen",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n200 g Mehl\n80 g Wasser\n15 g Öl\n4 g Salz\nBelag: 150 g Crème fraîche, 1 Birne, 100 g Ziegenkäse, Honig, Walnüsse",
    "schritte": "Vegetarischer Flammkuchen mit Birne, Ziegenkäse und Honig – süß-herzhaft und elegant. Perfekt für Gäste.\n\n1. Teig dünn ausrollen.\n2. Crème fraîche bestreichen, Birne, Ziegenkäse, Walnüsse verteilen.\n3. Nach dem Backen mit Honig beträufeln.\n\nBacken: 250 °C, 12–15 Min.\nAufbewahrung: Frisch.\nVariation: Mit Rucola nach dem Backen."
  },
  {
    "id": "d34",
    "name": "Weiche Discard-Wraps",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n150 g Mehl\n20 g Öl\n4 g Salz\nggf. etwas Wasser",
    "schritte": "Geschmeidige Wraps, die nicht brechen – ideal für Bowls, Falafel oder als schneller Snack. Discard pur, kein Trieb nötig.\n\n1. Zu einem geschmeidigen Teig kneten, 20 Min ruhen.\n2. In Portionen teilen, dünn ausrollen.\n3. In trockener heißer Pfanne je 1 Min pro Seite backen.\n\nBacken: Pfanne mittel-hoch, je 1–2 Min.\nAufbewahrung: Mit Tuch abgedeckt, am selben Tag; einfrierbar.\nVariation: Mit Kräutern oder Kurkuma im Teig."
  },
  {
    "id": "d35",
    "name": "Vollkorn-Discard-Wraps",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n100 g Weizenvollkornmehl\n50 g Weizenmehl 405\n20 g Öl\n4 g Salz",
    "schritte": "Nussige Vollkorn-Wraps mit mehr Biss und Ballaststoffen. Bleiben schön flexibel.\n\n1. Teig kneten, 20 Min ruhen.\n2. Dünn ausrollen.\n3. In heißer Pfanne backen.\n\nBacken: Pfanne mittel-hoch, je 1–2 Min.\nAufbewahrung: Am selben Tag; einfrierbar.\nVariation: Mit Sesam im Teig."
  },
  {
    "id": "d36",
    "name": "Discard-Weizentortillas",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n200 g Mehl\n30 g Öl oder Schmalz\n4 g Salz\netwas warmes Wasser nach Bedarf",
    "schritte": "Weiche, faltbare Tortillas für Tacos und Burritos. Discard macht sie aromatischer als gekaufte.\n\n1. Festen, glatten Teig kneten, 30 Min ruhen.\n2. In 8 Kugeln teilen, sehr dünn ausrollen.\n3. In trockener Pfanne je 30–45 Sek pro Seite backen.\n\nBacken: Pfanne hoch, je ca. 1 Min.\nAufbewahrung: Im Tuch warm halten; einfrierbar.\nVariation: Mit fein gehacktem Koriander."
  },
  {
    "id": "d37",
    "name": "Mais-Weizen-Discard-Tortillas",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "180 g Discard\n120 g Weizenmehl\n80 g feines Maismehl\n25 g Öl\n4 g Salz",
    "schritte": "Tortillas mit Maismehl-Anteil für authentischen Geschmack und schöne Farbe. Etwas rustikaler im Biss.\n\n1. Teig kneten (klebt etwas), 30 Min ruhen.\n2. Zwischen Folie ausrollen.\n3. In heißer Pfanne backen.\n\nBacken: Pfanne hoch, je 1 Min.\nAufbewahrung: Am selben Tag.\nVariation: Mit etwas geräuchertem Paprika."
  },
  {
    "id": "d38",
    "name": "Joghurt-Discard-Naan",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n250 g Mehl\n100 g Naturjoghurt\n8 g Backpulver\n4 g Salz\n15 g Öl",
    "schritte": "Fluffiges, leicht blasiges Naan aus der Pfanne – ohne langes Gehen dank Backpulver und Joghurt. Perfekt zu Curry.\n\n1. Weichen Teig kneten, 20 Min ruhen.\n2. Portionen oval ausrollen.\n3. In heißer Pfanne mit Deckel je 2 Min pro Seite backen.\n\nBacken: Pfanne mittel-hoch, je 2 Min.\nAufbewahrung: Frisch; kurz aufwärmen.\nVariation: Mit Schwarzkümmel bestreuen."
  },
  {
    "id": "d39",
    "name": "Knoblauch-Butter-Discard-Naan",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n250 g Mehl\n100 g Joghurt\n8 g Backpulver\n4 g Salz\nBelag: 40 g Butter, 2 Knoblauchzehen, Koriander",
    "schritte": "Naan mit Knoblauch-Kräuter-Butter bestrichen – aromatisch und unwiderstehlich. Das Highlight zu jedem indischen Gericht.\n\n1. Teig wie oben kneten, ruhen lassen.\n2. Ausrollen, in der Pfanne backen.\n3. Mit Knoblauchbutter bestreichen.\n\nBacken: Pfanne mittel-hoch, je 2 Min.\nAufbewahrung: Frisch.\nVariation: Mit Käse gefüllt (Cheese-Naan)."
  },
  {
    "id": "d40",
    "name": "Discard-Laugenbrezeln",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n400 g Weizenmehl 550\n150 g Wasser\n8 g Salz\n4 g Trockenhefe\n20 g Butter\nBad: 1 L Wasser + 40 g Natron\ngrobes Salz",
    "schritte": "Echte bayerische Laugenbrezeln mit glänzender Kruste und weicher Krume. Das Natronbad gibt den typischen Geschmack.\n\n1. Festen Teig kneten, 1 Std gehen.\n2. Stränge rollen, zu Brezeln schlingen, 20 Min kalt stellen.\n3. Im köchelnden Natronbad je 30 Sek baden.\n4. Einschneiden, salzen.\n\nBacken: 220 °C, 15–18 Min.\nAufbewahrung: Am selben Tag; einfrierbar.\nVariation: Als Laugenbrötchen oder -stangen. Sicherheitshinweis: Beim Natronbad Handschuhe tragen, nur Edelstahltopf nutzen."
  },
  {
    "id": "d41",
    "name": "Discard-Käse-Laugenstangen",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n400 g Mehl\n150 g Wasser\n8 g Salz\n4 g Trockenhefe\n20 g Butter\nBad: 1 L Wasser + 40 g Natron\n80 g geriebener Käse",
    "schritte": "Herzhafte Laugenstangen mit Käsekruste – der perfekte Snack für unterwegs. Schnell weg, versprochen.\n\n1. Teig kneten, 1 Std gehen.\n2. Stangen formen, 20 Min kalt stellen, kurz baden.\n3. Mit Käse bestreuen.\n\nBacken: 220 °C, 15–18 Min.\nAufbewahrung: Am selben Tag.\nVariation: Mit Kümmel oder Sesam."
  },
  {
    "id": "d42",
    "name": "Sesam-Discard-Grissini",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n250 g Mehl\n60 g Wasser\n25 g Olivenöl\n5 g Salz\n3 g Trockenhefe\nSesam zum Wälzen",
    "schritte": "Knackige italienische Brotstangen mit Sesam – ideal zum Aperitif oder mit Schinken. Halten ewig knusprig.\n\n1. Festen Teig kneten, 45 Min gehen.\n2. Dünne Stränge rollen, in Sesam wälzen.\n3. Auf Blech legen.\n\nBacken: 200 °C, 15–18 Min bis goldbraun.\nAufbewahrung: Luftdicht 1 Woche.\nVariation: Mit Mohn oder Leinsamen."
  },
  {
    "id": "d43",
    "name": "Rosmarin-Parmesan-Grissini",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n250 g Mehl\n60 g Wasser\n25 g Olivenöl\n5 g Salz\n3 g Trockenhefe\n40 g Parmesan\n1 EL Rosmarin",
    "schritte": "Aromatische Grissini mit Rosmarin und Parmesan im Teig. Mediterraner geht's kaum.\n\n1. Teig mit Parmesan und Rosmarin kneten, 45 Min gehen.\n2. Stränge rollen, aufs Blech.\n\nBacken: 200 °C, 15–18 Min.\nAufbewahrung: Luftdicht 1 Woche.\nVariation: Mit Chiliflocken."
  },
  {
    "id": "d44",
    "name": "Discard-Buttermilch-Scones",
    "kategorie": "Discard · Süßes",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "120 g Discard\n280 g Mehl\n120 g Buttermilch\n80 g kalte Butter\n40 g Zucker\n12 g Backpulver\n1 Prise Salz",
    "schritte": "Mürbe, fluffige Scones nach englischer Art – außen knusprig, innen zart. Mit Clotted Cream und Marmelade ein Traum.\n\n1. Kalte Butter ins Mehl reiben.\n2. Discard und Buttermilch zügig unterarbeiten (nicht kneten).\n3. Ausrollen (3 cm), ausstechen, mit Buttermilch bestreichen.\n\nBacken: 200 °C, 15–18 Min.\nAufbewahrung: Am selben Tag am besten.\nVariation: Mit Rosinen oder Cranberrys."
  },
  {
    "id": "d45",
    "name": "Käse-Schnittlauch-Discard-Scones",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "120 g Discard\n280 g Mehl\n120 g Milch\n80 g kalte Butter\n12 g Backpulver\n80 g geriebener Käse\nSchnittlauch\nSalz, Pfeffer",
    "schritte": "Herzhafte Scones mit Käse und Schnittlauch – perfekt zur Suppe oder zum Brunch. Warm aus dem Ofen am besten.\n\n1. Butter ins Mehl reiben, Käse und Schnittlauch dazu.\n2. Discard und Milch unterarbeiten.\n3. Ausstechen, mit Milch bestreichen.\n\nBacken: 200 °C, 16–18 Min.\nAufbewahrung: Am selben Tag.\nVariation: Mit Speckwürfeln."
  },
  {
    "id": "d46",
    "name": "Discard-Käsestangen",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n150 g Mehl\n80 g kalte Butter\n80 g geriebener Käse\n4 g Salz\n1 Eigelb zum Bestreichen",
    "schritte": "Blättrige, käsige Stangen zum Knabbern – in Minuten gemacht. Verschwinden auf jeder Party als Erstes.\n\n1. Alles zu einem Teig verkneten, 30 Min kühlen.\n2. Ausrollen, in Streifen schneiden, eindrehen.\n3. Mit Eigelb bestreichen.\n\nBacken: 190 °C, 15 Min.\nAufbewahrung: Luftdicht 4 Tage.\nVariation: Mit Paprika oder Kümmel."
  },
  {
    "id": "d47",
    "name": "Discard-Käse-Cracker (Goldfish-Style)",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "100 g Discard\n80 g Mehl\n50 g Butter\n100 g würziger geriebener Käse\n3 g Salz",
    "schritte": "Kleine, knusprige Käsecracker, die Kinder lieben – die gesündere Variante zum Gekauften. Suchtgefahr!\n\n1. Teig verkneten, 30 Min kühlen.\n2. Dünn ausrollen, kleine Quadrate schneiden.\n3. Aufs Blech legen.\n\nBacken: 175 °C, 12–15 Min.\nAufbewahrung: Luftdicht 1 Woche.\nVariation: Mit Paprika oder etwas Cayenne."
  },
  {
    "id": "d48",
    "name": "Discard-Zwiebelkuchen-Muffins",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n180 g Mehl\n2 Eier\n100 g saure Sahne\n8 g Backpulver\n2 gedünstete Zwiebeln\n80 g Speck\nKümmel, Salz",
    "schritte": "Herzhafte Mini-Zwiebelkuchen in Muffinform – ideal zum Federweißer oder als Snack. Tradition trifft Resteverwertung.\n\n1. Zwiebeln und Speck andünsten, abkühlen.\n2. Discard, Eier, saure Sahne, Mehl, Backpulver verrühren.\n3. Zwiebel-Speck-Mischung unterheben, einfüllen.\n\nBacken: 180 °C, 22–25 Min.\nAufbewahrung: 2 Tage; aufwärmen.\nVariation: Mit Lauch statt Zwiebeln."
  },
  {
    "id": "d49",
    "name": "Discard-Pizzaschnecken",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "200 g Discard\n300 g Mehl\n100 g Wasser\n4 g Trockenhefe\n5 g Salz\n20 g Öl\nFüllung: Tomatensauce, geriebener Käse, Oregano",
    "schritte": "Gefüllte Schnecken mit Tomate, Käse und Kräutern – der Snack-Klassiker fürs Buffet. Bei Kindern besonders beliebt.\n\n1. Teig kneten, 1 Std gehen.\n2. Rechteckig ausrollen, füllen, aufrollen, schneiden.\n3. Auf Blech, 20 Min gehen lassen.\n\nBacken: 200 °C, 18–20 Min.\nAufbewahrung: 2 Tage; aufbacken.\nVariation: Mit Salami oder Spinat."
  },
  {
    "id": "d50",
    "name": "Discard-Knäckebrot",
    "kategorie": "Discard · Herzhaft & Snacks",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "150 g Discard\n100 g Mehl\n100 g gemischte Saaten (Sonnenblume, Kürbis, Lein, Sesam)\n30 g Öl\n5 g Salz\n50 g Wasser",
    "schritte": "Knuspriges, saatenreiches Knäckebrot, das wochenlang hält. Die perfekte Vorratsverwertung für deinen Discard.\n\n1. Alles zu einer streichfähigen Masse verrühren.\n2. Auf Backpapier sehr dünn ausstreichen.\n3. Vorschneiden, salzen.\n\nBacken: 160 °C, 35–45 Min bis komplett trocken und knusprig.\nAufbewahrung: Luftdicht 3–4 Wochen.\nVariation: Mit Rosmarin oder Chili."
  }
];

export default function RezeptePage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [folders, setFolders] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [activeFolder, setActiveFolder] = useState("alle");
  const [view, setView] = useState("list");
  const [detail, setDetail] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    name: "",
    ordner_id: "",
    zutaten: "",
    schritte: "",
    mehl_gramm: "",
    hydration: "",
  };
  const [form, setForm] = useState(emptyForm);

  async function loadData() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    setUserId(user.id);

    const { data: f } = await supabase
      .from("rezept_ordner")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    setFolders(f || []);

    const { data: r } = await supabase
      .from("rezepte")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setRecipes(r || []);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addFolder() {
    const name = window.prompt("Name des Ordners?");
    if (!name || !name.trim()) return;
    const { data, error } = await supabase
      .from("rezept_ordner")
      .insert({ user_id: userId, name: name.trim() })
      .select()
      .single();
    if (!error && data) {
      setFolders((prev) => [...prev, data]);
    }
  }

  async function saveRecipe() {
    if (!form.name.trim()) {
      window.alert("Bitte gib deinem Rezept einen Namen.");
      return;
    }
    setSaving(true);
    const payload = {
      user_id: userId,
      name: form.name.trim(),
      ordner_id: form.ordner_id || null,
      zutaten: form.zutaten || null,
      schritte: form.schritte || null,
      mehl_gramm: form.mehl_gramm ? Number(form.mehl_gramm) : null,
      hydration: form.hydration ? Number(form.hydration) : null,
    };
    const { data, error } = await supabase
      .from("rezepte")
      .insert(payload)
      .select()
      .single();
    setSaving(false);
    if (!error && data) {
      setRecipes((prev) => [data, ...prev]);
      setForm(emptyForm);
      setView("list");
    } else {
      window.alert("Konnte nicht speichern. Bitte nochmal versuchen.");
    }
  }

  async function deleteRecipe(id) {
    if (!window.confirm("Dieses Rezept wirklich löschen?")) return;
    await supabase.from("rezepte").delete().eq("id", id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    setDetail(null);
    setView("list");
  }

  function copyGrundstock(rec) {
    setForm({
      name: rec.name,
      ordner_id: "",
      zutaten: rec.zutaten || "",
      schritte: rec.schritte || "",
      mehl_gramm: rec.mehl_gramm ? String(rec.mehl_gramm) : "",
      hydration: rec.hydration ? String(rec.hydration) : "",
    });
    setDetail(null);
    setView("new");
  }

  const visibleRecipes =
    activeFolder === "alle"
      ? recipes
      : activeFolder === "ohne"
      ? recipes.filter((r) => !r.ordner_id)
      : recipes.filter((r) => r.ordner_id === activeFolder);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-cocoa-700/70">Rezepte werden geladen …</p>
      </div>
    );
  }

  // ---------- Detail-Ansicht ----------
  if (view === "detail" && detail) {
    const isGrund = String(detail.id).startsWith("g");
    return (
      <div className="pt-2">
        <button
          onClick={() => {
            setDetail(null);
            setView("list");
          }}
          className="btn-ghost -ml-3 text-sm"
        >
          ← Zurück
        </button>
        <h1 className="mt-3 font-display text-3xl text-cocoa-900">
          {detail.name}
        </h1>
        {(detail.mehl_gramm || detail.hydration) && (
          <p className="mt-1 text-sm text-cocoa-700/70">
            {detail.mehl_gramm ? `${detail.mehl_gramm} g Mehl` : ""}
            {detail.mehl_gramm && detail.hydration ? " · " : ""}
            {detail.hydration ? `${detail.hydration} % Hydration` : ""}
          </p>
        )}

        {detail.zutaten && (
          <div className="card mt-5">
            <h2 className="font-display text-xl text-cocoa-900">Zutaten</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-cocoa-800">
              {detail.zutaten}
            </p>
          </div>
        )}
        {detail.schritte && (
          <div className="card mt-4">
            <h2 className="font-display text-xl text-cocoa-900">Zubereitung</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-cocoa-800">
              {detail.schritte}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {isGrund ? (
            <button
              onClick={() => copyGrundstock(detail)}
              className="btn-primary"
            >
              In meine Rezepte übernehmen
            </button>
          ) : (
            <button
              onClick={() => deleteRecipe(detail.id)}
              className="btn-ghost text-sm text-terra-600"
            >
              Rezept löschen
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------- Neu-Formular ----------
  if (view === "new") {
    return (
      <div className="pt-2">
        <button
          onClick={() => {
            setForm(emptyForm);
            setView("list");
          }}
          className="btn-ghost -ml-3 text-sm"
        >
          ← Abbrechen
        </button>
        <h1 className="mt-3 font-display text-3xl text-cocoa-900">
          Neues Rezept
        </h1>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-cocoa-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="z. B. Mein Bauernbrot"
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-cocoa-700">Ordner</label>
            <select
              value={form.ordner_id}
              onChange={(e) => setForm({ ...form, ordner_id: e.target.value })}
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-3 text-sm"
            >
              <option value="">Kein Ordner</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm text-cocoa-700">
                Mehl (g)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={form.mehl_gramm}
                onChange={(e) =>
                  setForm({ ...form, mehl_gramm: e.target.value })
                }
                placeholder="500"
                className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-cocoa-700">
                Hydration (%)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={form.hydration}
                onChange={(e) =>
                  setForm({ ...form, hydration: e.target.value })
                }
                placeholder="70"
                className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-cocoa-700">Zutaten</label>
            <textarea
              value={form.zutaten}
              onChange={(e) => setForm({ ...form, zutaten: e.target.value })}
              rows={5}
              placeholder="Eine Zutat pro Zeile"
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-cocoa-700">
              Zubereitung
            </label>
            <textarea
              value={form.schritte}
              onChange={(e) => setForm({ ...form, schritte: e.target.value })}
              rows={7}
              placeholder="Schritt für Schritt"
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-3 text-sm"
            />
          </div>

          <button
            onClick={saveRecipe}
            disabled={saving}
            className="btn-primary w-full"
          >
            {saving ? "Speichert …" : "Rezept speichern"}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Listen-Ansicht ----------
  return (
    <div className="pt-2">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-cocoa-900">Rezepte</h1>
        <button onClick={addFolder} className="btn-ghost text-sm">
          + Ordner
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFolder("alle")}
          className={
            "rounded-full px-4 py-2 text-sm " +
            (activeFolder === "alle"
              ? "bg-cocoa-900 text-white"
              : "bg-white text-cocoa-800 border border-cocoa-200")
          }
        >
          Alle
        </button>
        {folders.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFolder(f.id)}
            className={
              "rounded-full px-4 py-2 text-sm " +
              (activeFolder === f.id
                ? "bg-cocoa-900 text-white"
                : "bg-white text-cocoa-800 border border-cocoa-200")
            }
          >
            {f.name}
          </button>
        ))}
        <button
          onClick={() => setActiveFolder("ohne")}
          className={
            "rounded-full px-4 py-2 text-sm " +
            (activeFolder === "ohne"
              ? "bg-cocoa-900 text-white"
              : "bg-white text-cocoa-800 border border-cocoa-200")
          }
        >
          Ohne Ordner
        </button>
      </div>

      <button
        onClick={() => {
          setForm(emptyForm);
          setView("new");
        }}
        className="btn-primary mt-5 w-full"
      >
        + Neues Rezept
      </button>

      {visibleRecipes.length > 0 && (
        <div className="mt-5 space-y-3">
          {visibleRecipes.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setDetail(r);
                setView("detail");
              }}
              className="card flex w-full items-center justify-between text-left"
            >
              <div>
                <p className="font-display text-lg text-cocoa-900">{r.name}</p>
                {(r.mehl_gramm || r.hydration) && (
                  <p className="text-xs text-cocoa-700/60">
                    {r.mehl_gramm ? `${r.mehl_gramm} g Mehl` : ""}
                    {r.mehl_gramm && r.hydration ? " · " : ""}
                    {r.hydration ? `${r.hydration} %` : ""}
                  </p>
                )}
              </div>
              <span className="text-cocoa-400">›</span>
            </button>
          ))}
        </div>
      )}

      {visibleRecipes.length === 0 && (
        <p className="mt-6 text-center text-sm text-cocoa-700/60">
          Noch keine eigenen Rezepte hier. Leg dein erstes an oder übernimm eins
          aus dem Grundstock.
        </p>
      )}

      {activeFolder === "alle" && (
        <div className="mt-8">
          <h2 className="font-display text-xl text-cocoa-900">Grundstock</h2>
          <p className="mb-3 text-xs text-cocoa-700/60">
            Fertige Rezepte zum Ausprobieren – tippe zum Ansehen oder übernehmen.
          </p>
          {[...new Set(GRUNDSTOCK.map((r) => r.kategorie || "Weitere"))].map(
            (kat) => (
              <div key={kat} className="mt-5">
                <h3 className="mb-2 font-display text-lg text-terra-600">
                  {kat}
                </h3>
                <div className="space-y-3">
                  {GRUNDSTOCK.filter(
                    (r) => (r.kategorie || "Weitere") === kat
                  ).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setDetail(r);
                        setView("detail");
                      }}
                      className="card flex w-full items-center justify-between text-left"
                    >
                      <p className="font-display text-lg text-cocoa-900">
                        {r.name}
                      </p>
                      <span className="text-cocoa-400">›</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
