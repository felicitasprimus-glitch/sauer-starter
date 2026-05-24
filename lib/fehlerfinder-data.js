// Fehlerfinder-Datenbank (mehrsprachig: de / en / es)
// 12 Symptome, 57 Loesungen

export const FEHLERFINDER_PROBLEMS = {
  de: [
    { id: 1, emoji: "😴", titel: "Teig geht kaum auf", ursachen: [
      { label: "Starter war nicht auf Peak", warum: "Ein zu junger oder bereits abgefallener Starter hat nicht genug aktive Mikroben.", loesung: "Setze den Starter nur ein, wenn die Kuppel gerade einfaellt. Schwimmtest: Ein Teeloeffel auf Wasser muss oben schwimmen. Fuetterung 4-6 h vor dem Teigansatz timen, dann triffst du den Peak." },
      { label: "Zu kalt gefuehrt", warum: "Unter 22 Grad bremsen die Mikroben stark, unter 18 Grad kommt kaum noch Trieb.", loesung: "Bulk bei konstant 24-26 Grad fuehren. Dein Ofen: normale Ober-/Unterhitze verwenden." },
      { label: "Zu wenig Starter im Teig", warum: "Bei sehr niedrigem Starter-Anteil braucht es deutlich mehr Zeit - oft mehr, als der Teig aushaelt.", loesung: "Erhoehe den Starter auf 15-20 Prozent vom Mehl. Mehr Triebkraft, kuerzerer Bulk, weniger Saeure gleichzeitig." },
      { label: "Salz direkt auf den Starter", warum: "Direkter Salzkontakt schockt die Mikroben an der Kontaktstelle.", loesung: "Reihenfolge: Autolyse (Mehl + Wasser) - Starter einarbeiten - zuletzt Salz mit einem Schluck Wasser. Nie Salz und Starter direkt aufeinander geben." },
      { label: "Nach Uhr statt nach Volumen", warum: "Feste Zeitangaben aus Rezepten ignorieren deine tatsaechliche Kuechentemperatur.", loesung: "Beende den Bulk bei +50-75 Prozent Volumen mit kuppeliger Oberflaeche und sichtbaren Blasen an der Schuesselseite. Glas-Schuessel oder Markierung hilft." },
    ]},
    { id: 2, emoji: "🫠", titel: "Teig zu klebrig", ursachen: [
      { label: "Zu wenig Glutenentwicklung", warum: "Ohne genuegend Dehn- und Faltphasen bildet sich kein tragfaehiges Netzwerk.", loesung: "4 Sets Stretch und Fold in den ersten 2 h, jeweils im Abstand von 30 Min. Teig dabei um 90 Grad drehen zwischen den Zuegen." },
      { label: "Mehl traegt die Hydration nicht", warum: "Weizen 550 traegt weniger Wasser als T65, Tipo 0 oder Vollkornmehle.", loesung: "Hydration um 3-5 Prozent absenken und wieder hochtasten. Oder staerkeres Mehl mit mindestens 12 Prozent Proteingehalt waehlen." },
      { label: "Zu warm gefuehrt", warum: "Ueber 28 Grad bauen Enzyme das Gluten schneller ab als es sich entwickelt.", loesung: "Bulk auf 24-25 Grad einregeln. Im Ofen: normale Ober-/Unterhitze verwenden." },
      { label: "Nur Stretch und Fold genutzt", warum: "Bei hoher Hydration reichen sanfte S und F oft nicht fuer die noetige Spannung.", loesung: "Frueh 3-5 Min. Slap und Fold auf der Arbeitsflaeche einsetzen, bis der Teig sichtbar Struktur aufbaut und sich vom Tisch loest." },
      { label: "Teig ist ueberfermentiert", warum: "Protease-Enzyme haben das Glutennetz bereits zerlegt.", loesung: "Diesen Teig nicht mehr zu retten - backe ihn trotzdem, wird eher ein Fladenbrot. Naechstes Mal Bulk kuerzer oder kuehler fuehren." },
    ]},
    { id: 3, emoji: "🧽", titel: "Krume speckig", hasGefaessLink: true, ursachen: [
      { label: "Zu frueh angeschnitten", warum: "Staerke retrogradiert erst beim Auskuehlen. Warmer Anschnitt wirkt immer speckig.", loesung: "Mindestens 4 h auf dem Gitter auskuehlen lassen, bei hoher Hydration besser 8-12 h. Ja, das ist schwer - aber es ist der Unterschied." },
      { label: "Kerntemperatur nicht erreicht", warum: "Unter 96 Grad im Kern ist die Staerke nicht verkleistert, Krume bleibt feucht und zaeh.", loesung: "Einstichthermometer in die Mitte des Laibs. Zielwert 96-98 Grad. Bei Bedarf 5-10 Min. bei 210 Grad nachbacken." },
      { label: "Zu viel Dampf bis zum Ende", warum: "Dauerhaft feuchter Ofen haelt Krume und Kruste weich.", loesung: "Ofen: normale Ober-/Unterhitze verwenden. 100 Prozent Dampf bei 250 Grad - dann 0 Prozent Dampf, Umluft, 210 Grad fuer den Rest. Die zweite Phase muss trocken sein." },
      { label: "Teig war unterfermentiert", warum: "Zu wenig Gaerung bedeutet zu wenig Lockerung und dichte, feuchte Krume.", loesung: "Bulk verlaengern, bis der Teig +75 Prozent Volumen zeigt, kuppelig wirkt und Blasen an der Schuesselseite sichtbar sind. Lieber laenger warten als zu frueh formen." },
      { label: "Zu kurze Backzeit", warum: "40 Min. reichen fuer kleine Laibe, fuer 900 g+ oft nicht.", loesung: "40-45 Min. Gesamtbackzeit fuer einen Kilo-Laib. Bei kleineren entsprechend weniger, bei groesseren mehr. Kerntemperatur ist der beste Indikator." },
    ]},
    { id: 4, emoji: "🫓", titel: "Laib laeuft flach", ursachen: [
      { label: "Ueberfermentiert in der Stueckgare", warum: "Teig hat seinen Hoehepunkt ueberschritten und keine Kraft mehr fuer den Ofentrieb.", loesung: "Poke-Test: Delle mit Finger eindruecken. Springt sofort zurueck - noch warten. Bleibt halb stehen - perfekt. Bleibt ganz stehen - zu spaet, sofort backen." },
      { label: "Keine saubere Formgebung", warum: "Einschrittiges Formen bringt zu wenig Oberflaechenspannung fuer Stabilitaet.", loesung: "Preshape rund - 20-30 Min. Bench-Rest - final shape mit straffer Haut. Die zweistufige Formgebung ist der groesste Hebel fuer Hoehe." },
      { label: "Warme Stueckgare", warum: "Raumtemperatur-Gare laesst den Teig zu schnell ermueden, besonders bei hoher Hydration.", loesung: "Stueckgare 12-16 h bei 4-6 Grad im Kuehlschrank (Retard). Bringt mehr Volumen, einfacheres Einschneiden und besseres Aroma gleichzeitig." },
      { label: "Mehl zu schwach", warum: "Unter 11 Prozent Proteingehalt kann das Netzwerk die Gase nicht halten.", loesung: "Mehl mit mindestens 12 Prozent Protein waehlen (T65, Manitoba, Ruchmehl). Alternativ 10-15 Prozent Hartweizengriess beimischen." },
      { label: "Teig klebte im Gaerkoerbchen", warum: "Beim Stuerzen reisst der Teig die muehsam aufgebaute Oberflaechenspannung wieder auf.", loesung: "Gaerkoerbchen grosszuegig mit Reismehl-Weizenmehl-Mix (50/50) bemehlen. Reismehl klebt nicht - das ist der Trick." },
    ]},
    { id: 5, emoji: "🧱", titel: "Krume zu dicht", ursachen: [
      { label: "Unterfermentiert", warum: "Teig kam zu frueh in den Ofen, Mikroben hatten nicht genug Zeit zu lockern.", loesung: "Bulk nach Volumen fuehren, nicht nach Uhr: +75 Prozent Volumen, kuppelige Oberflaeche, Blasen an der Seite. Bei 24 Grad oft 5-7 h." },
      { label: "Starter war schwach", warum: "Hungriger oder unterversorgter Starter bringt zu wenig Triebkraft.", loesung: "Starter 2 Tage in Folge im Abstand von 12 h mit 1:5:5 auffrischen (z. B. 10 g + 50 g + 50 g). Danach neu ansetzen." },
      { label: "Zu stark entgast beim Formen", warum: "Kraeftiges Druecken und Falten presst die erarbeiteten Gase wieder raus.", loesung: "Beim Formen nur Spannung aufbauen, nicht ausquetschen. Grosse Blasen an der Oberflaeche duerfen sichtbar bleiben." },
      { label: "Hydration zu niedrig", warum: "Trockene Teige entwickeln kaum offene Krume.", loesung: "Schrittweise auf 75-78 Prozent hochtasten. Bei staerkeren Mehlen (T65, Manitoba) auch 80 Prozent moeglich." },
      { label: "Ungleichmaessige Temperatur", warum: "Schwankende Raumtemperatur ergibt ungleichmaessige Gaerung.", loesung: "Ofen: normale Ober-/Unterhitze verwenden. Viel reproduzierbarer als Kuechentheke." },
    ]},
    { id: 6, emoji: "🍋", titel: "Brot zu sauer", ursachen: [
      { label: "Stueckgare zu lange kalt", warum: "Ueber 16 h Retard produzieren deutlich mehr Essigsaeure.", loesung: "Stueckgare auf 8-12 h im Kuehlschrank verkuerzen. Der Trieb reicht, das Aroma ist milder." },
      { label: "Starter zu fest gefuehrt", warum: "Feste Starter beguenstigen Essigsaeure ueber Milchsaeure - spitzeres Saeureprofil.", loesung: "Starter immer 1:1 Mehl zu Wasser fuehren (100 Prozent Hydration). Milchsaeurebakterien werden beguenstigt, das Aroma wird runder." },
      { label: "Starter im Abstieg verwendet", warum: "Nach dem Peak wird der Starter schnell sauer und bringt diese Saeure in den Teig.", loesung: "Fuetterung so timen, dass du den Starter am Peak einsetzt (meist 4-6 h nach Fuetterung bei 25 Grad). Glas mit Gummiband markieren hilft." },
      { label: "Roggenanteil zu hoch", warum: "Roggen saeuert deutlich staerker als Weizen, besonders bei langer Fuehrung.", loesung: "Fuer mildes Brot Roggenanteil auf 20 Prozent reduzieren. Fuer bewusst kraeftiges Roggenbrot - zur Eigenschaft machen." },
      { label: "Zu wenig Starter, zu langer Bulk", warum: "Kleine Starter-Mengen brauchen viel Zeit - Zeit ist Saeure.", loesung: "Mehr Starter (15-20 Prozent), kuerzerer Bulk. Gleiche Lockerung bei deutlich weniger Saeurebildung." },
    ]},
    { id: 7, emoji: "✂️", titel: "Keine Ohren", hasGefaessLink: true, ursachen: [
      { label: "Falscher Schnittwinkel", warum: "Senkrechte Schnitte oeffnen sich nicht - sie ziehen sich nach oben zu.", loesung: "Rasierklinge flach halten, im 30-Grad-Winkel schneiden. Eine entschlossene Bewegung, 0,5-1 cm tief. Nicht saegen, nicht nachsetzen." },
      { label: "Teig war zu warm", warum: "Warme Teige sind weich, schwer zu schneiden und dehnen sich flach.", loesung: "Direkt kuehlschrankkalt aus dem Gaerkorb in den Ofen. Ergibt die schaerfsten Ohren und einfachste Handhabung." },
      { label: "Zu wenig Dampf in Phase 1", warum: "Ohne Dampf setzt sich die Kruste zu frueh, der Teig kann nicht mehr aufreissen.", loesung: "Ofen: normale Ober-/Unterhitze verwenden. bei 250 Grad mit 100 Prozent Dampf. Danach Dampf komplett ablassen, auf 220 Grad senken." },
      { label: "Ueberfermentiert", warum: "Ein mueder Teig hat keine Kraft mehr fuer Ofentrieb und Ohrenbildung.", loesung: "Stueckgare rechtzeitig beenden - Poke-Test als Schiedsrichter. Lieber etwas frueher in den Ofen als zu spaet." },
      { label: "Schnitt zog sich zu", warum: "Feuchte Oberflaeche laesst den Schnitt zusammenlaufen, bevor er oeffnen kann.", loesung: "Vor dem Schneiden duenn Reismehl aufsieben. Oberflaeche wird trockener, Schnitt bleibt offen und zeichnet sich scharf ab." },
    ]},
    { id: 8, emoji: "🕳️", titel: "Riesige Loecher", ursachen: [
      { label: "Preshape ausgelassen", warum: "Ohne Zwischenformgebung bleiben Blasen konzentriert und wachsen zu Grossraumporen.", loesung: "Preshape rund - 20 Min. Bench-Rest - final shape. Die zweistufige Formgebung verteilt die Gasstruktur gleichmaessig." },
      { label: "Riesenblasen nicht ausgedrueckt", warum: "Grosse sichtbare Blasen beim Formen wachsen im Ofen zur Hohlraum-Pore.", loesung: "Beim Formen mit flacher Hand die groessten Blasen sanft aufloesen. Kleine duerfen bleiben - sie sind die offene Krume." },
      { label: "Ungleichmaessige Gaerung", warum: "Kalte/warme Zonen im Teig ergeben ungleichmaessige Lockerung.", loesung: "Bulk bei konstanter Temperatur fuehren. Ofen: normale Ober-/Unterhitze verwenden." },
      { label: "Schnitt zu flach", warum: "Flacher Schnitt lenkt den Dampf nach oben statt in die Krume - Hohlraum unter der Kruste.", loesung: "Im 30-Grad-Winkel, 1 cm tief schneiden. Dampf entweicht kontrolliert durch den Schnitt und formt saubere Ohren." },
    ]},
    { id: 9, emoji: "🪵", titel: "Kruste zu hart", hasGefaessLink: true, ursachen: [
      { label: "Zu wenig Dampf in Phase 1", warum: "Ohne Dampf haertet die Kruste zu frueh aus und wird zur Borke.", loesung: "Ofen: normale Ober-/Unterhitze verwenden. bei 250 Grad mit 100 Prozent Dampf. Kruste bleibt elastisch, maximaler Ofentrieb." },
      { label: "Zu lange gebacken", warum: "Ueber 45 Min. bei hohen Temperaturen trocknen die Kruste komplett aus.", loesung: "Fuer 900 g Laib 40-45 Min. Gesamtbackzeit. Kerntemperatur 96-98 Grad ist das Abbruchkriterium, nicht die Uhr." },
      { label: "Im Ofen ausgekuehlt", warum: "Nachgaren im warmen Ofen trocknet die Kruste weiter aus.", loesung: "Sofort nach Backende aus dem Ofen nehmen, auf ein Gitter. Luftzirkulation rundum verhindert Weichwerden und Austrocknen." },
      { label: "Endtemperatur zu hoch", warum: "Konstant 250 Grad bis zum Ende verbrennt und verdickt die Kruste.", loesung: "Nach der Dampfphase auf 210-220 Grad senken. Spart die Kruste und bringt dunkle Braeunung ohne Verhaertung." },
    ]},
    { id: 10, emoji: "👻", titel: "Kruste bleibt blass", hasGefaessLink: true, ursachen: [
      { label: "Dampf bis zum Ende", warum: "Feuchte Oberflaeche verhindert die Maillard-Reaktion - keine Braeunung moeglich.", loesung: "Dampf nach 20 Min. komplett ablassen. Phase 2 muss trocken sein, sonst braeunt nichts." },
      { label: "Mehlschicht auf dem Laib", warum: "Mehl isoliert die Oberflaeche vom direkten Hitzekontakt.", loesung: "Vor dem Einschneiden mit weichem Pinsel ueberschuessiges Mehl abkehren. Nur hauchduenn Reismehl fuer den Schnitt lassen." },
      { label: "Ofen nicht heiss genug", warum: "Unter 220 Grad reicht die Energie nicht fuer kraeftige Braeunung.", loesung: "Phase 2 bei 220-230 Grad Umluft. Letzte 5 Min. Oberhitze oder kurz Grillstufe - dabei bleiben." },
      { label: "Zu wenig Restzucker", warum: "Unterfermentierter Teig hat wenig freie Zucker, die fuer Maillard noetig sind.", loesung: "Bulk bis +75 Prozent Volumen vollstaendig ausfuehren. Restzucker = Braeunung = Geschmack." },
      { label: "Nur Unter-/Umluft", warum: "Ohne Oberhitze bleibt die Oberseite blass, auch wenn der Boden schon dunkel ist.", loesung: "Letzte 5 Min. mit Oberhitze. Dabei bleiben - geht schnell von golden zu schwarz." },
    ]},
    { id: 11, emoji: "💥", titel: "Reisst falsch auf", hasGefaessLink: true, ursachen: [
      { label: "Schnitt zu zoegerlich", warum: "Flache oder zu kurze Schnitte oeffnen sich nicht - der Dampf sucht sich den naechstbesten Ausgang.", loesung: "Eine entschlossene Bewegung mit der Rasierklinge, 0,5-1 cm tief, im 30-Grad-Winkel. Nicht nachsetzen, nicht korrigieren." },
      { label: "Unterfermentiert", warum: "Volles Triebpotential im Ofen sucht sich einen Weg - und findet die Schwachstelle.", loesung: "Bulk verlaengern, bis Teig deutlich Volumen hat (+75 Prozent). Oder Stueckgare im Kuehlschrank nutzen - bringt Ruhe und Struktur." },
      { label: "Zu wenig Dampf", warum: "Kruste setzt sich zu schnell, der Schnitt kann nicht mehr reagieren, Druck platzt seitlich raus.", loesung: "Volle Dampfphase 20 Min. bei 250 Grad. Der Ofen: normale Ober-/Unterhitze verwenden." },
      { label: "Ungleichmaessige Formspannung", warum: "Eine schwache Seite im Laib gibt unter Druck zuerst nach.", loesung: "Beim final shape rundherum gleichmaessig Spannung aufbauen. Bei Laenglichen: beide Seiten gleich einschlagen." },
    ]},
    { id: 12, emoji: "🫧", titel: "Starter blubbert nicht", ursachen: [
      { label: "Zu selten gefuettert", warum: "Ohne regelmaessiges Futter hungern die Mikroben und versaeuern das Glas.", loesung: "Rettungsprogramm: 2-3 Tage in Folge alle 12 h fuettern, keine Pause. Nach 48 h sollte Leben zurueck sein." },
      { label: "Zu kuehl gelagert", warum: "Unter 20 Grad arbeiten die Mikroben kaum, unter 15 Grad fast gar nicht.", loesung: "Bei 25-26 Grad fuehren. Ofen: normale Ober-/Unterhitze verwenden." },
      { label: "Chlorhaltiges Leitungswasser", warum: "Chlor hemmt Mikroben und macht ihnen das Leben schwer.", loesung: "Wasser 30 Min. offen stehen lassen (Chlor verdunstet) oder filtern. Stilles Mineralwasser geht auch." },
      { label: "Zu enzymarmes Mehl", warum: "Stark ausgemahlenes helles Weizenmehl hat wenig Enzymaktivitaet - Mikroben finden nichts zu tun.", loesung: "10-20 Prozent Vollkornroggen bei jeder Fuetterung beimischen. Bringt meist innerhalb von 24 h spuerbar Leben ins Glas." },
      { label: "Zu kleines Fuetterungsverhaeltnis", warum: "1:1:1 versaeuert das Glas, bevor die Mikroben richtig arbeiten koennen.", loesung: "Auf 1:5:5 umstellen: 10 g Starter + 50 g Mehl + 50 g Wasser. Gibt dem Starter Luft zum Wachsen." },
    ]},
  ],
  en: [
    { id: 1, emoji: "😴", titel: "Dough barely rises", ursachen: [
      { label: "Starter wasn't at peak", warum: "A starter that's too young or already collapsed doesn't have enough active microbes.", loesung: "Only use the starter when the dome is just starting to fall. Float test: a teaspoon must float on water. Time the feed 4-6 h before mixing to hit the peak." },
      { label: "Kept too cold", warum: "Below 22°C the microbes slow down a lot; below 18°C there's barely any rise.", loesung: "Run the bulk at a steady 24-26°C. Your oven: use normal top/bottom heat." },
      { label: "Too little starter in the dough", warum: "With a very low starter ratio it needs much more time - often more than the dough can take.", loesung: "Raise the starter to 15-20% of the flour. More leavening power, shorter bulk, less acidity at the same time." },
      { label: "Salt directly on the starter", warum: "Direct salt contact shocks the microbes at the contact point.", loesung: "Order: autolyse (flour + water) - work in the starter - add salt last with a splash of water. Never put salt and starter directly on top of each other." },
      { label: "By the clock instead of by volume", warum: "Fixed times from recipes ignore your actual kitchen temperature.", loesung: "End the bulk at +50-75% volume with a domed surface and visible bubbles on the side of the bowl. A glass bowl or a mark helps." },
    ]},
    { id: 2, emoji: "🫠", titel: "Dough too sticky", ursachen: [
      { label: "Too little gluten development", warum: "Without enough stretch-and-fold phases, no load-bearing network forms.", loesung: "4 sets of stretch and fold in the first 2 h, 30 min apart. Turn the dough 90° between pulls." },
      { label: "Flour can't carry the hydration", warum: "Wheat 550 carries less water than T65, Tipo 0 or wholegrain flours.", loesung: "Lower the hydration by 3-5% and work it back up. Or pick a stronger flour with at least 12% protein." },
      { label: "Kept too warm", warum: "Above 28°C enzymes break down the gluten faster than it develops.", loesung: "Set the bulk to 24-25°C. In the oven: use normal top/bottom heat." },
      { label: "Only used stretch and fold", warum: "At high hydration, gentle S&F often isn't enough for the needed tension.", loesung: "Use 3-5 min of slap and fold on the counter early on, until the dough visibly builds structure and releases from the table." },
      { label: "Dough is over-fermented", warum: "Protease enzymes have already broken down the gluten net.", loesung: "This dough can't really be saved - bake it anyway, it'll be more of a flatbread. Next time run the bulk shorter or cooler." },
    ]},
    { id: 3, emoji: "🧽", titel: "Gummy crumb", hasGefaessLink: true, ursachen: [
      { label: "Cut too early", warum: "Starch only retrogrades as it cools. A warm cut always looks gummy.", loesung: "Cool at least 4 h on a rack, with high hydration better 8-12 h. Yes, it's hard - but it's the difference." },
      { label: "Core temperature not reached", warum: "Below 96°C in the core the starch isn't gelatinized; the crumb stays moist and tough.", loesung: "Probe thermometer into the middle of the loaf. Target 96-98°C. If needed, bake another 5-10 min at 210°C." },
      { label: "Too much steam until the end", warum: "A permanently humid oven keeps crumb and crust soft.", loesung: "Oven: use normal top/bottom heat. 100% steam at 250°C - then 0% steam, fan, 210°C for the rest. The second phase must be dry." },
      { label: "Dough was under-fermented", warum: "Too little fermentation means too little aeration and a dense, moist crumb.", loesung: "Extend the bulk until the dough shows +75% volume, looks domed and bubbles are visible on the side of the bowl. Better to wait longer than shape too early." },
      { label: "Bake time too short", warum: "40 min is enough for small loaves, often not for 900 g+.", loesung: "40-45 min total bake for a one-kilo loaf. Less for smaller, more for larger. Core temperature is the best indicator." },
    ]},
    { id: 4, emoji: "🫓", titel: "Loaf spreads flat", ursachen: [
      { label: "Over-fermented in final proof", warum: "The dough has passed its peak and has no strength left for oven spring.", loesung: "Poke test: press a dent with your finger. Springs right back - keep waiting. Stays half - perfect. Stays fully - too late, bake now." },
      { label: "No clean shaping", warum: "One-step shaping builds too little surface tension for stability.", loesung: "Round preshape - 20-30 min bench rest - final shape with a taut skin. Two-stage shaping is the biggest lever for height." },
      { label: "Warm final proof", warum: "A room-temperature proof tires the dough too fast, especially at high hydration.", loesung: "Final proof 12-16 h at 4-6°C in the fridge (retard). Brings more volume, easier scoring and better flavor all at once." },
      { label: "Flour too weak", warum: "Below 11% protein the network can't hold the gases.", loesung: "Pick flour with at least 12% protein (T65, Manitoba, high-extraction). Or mix in 10-15% durum semolina." },
      { label: "Dough stuck in the banneton", warum: "When turning out, the dough tears open the surface tension you worked hard to build.", loesung: "Flour the banneton generously with a rice-flour/wheat-flour mix (50/50). Rice flour doesn't stick - that's the trick." },
    ]},
    { id: 5, emoji: "🧱", titel: "Crumb too dense", ursachen: [
      { label: "Under-fermented", warum: "The dough went into the oven too early; microbes didn't have enough time to aerate.", loesung: "Run the bulk by volume, not the clock: +75% volume, domed surface, bubbles on the side. At 24°C often 5-7 h." },
      { label: "Starter was weak", warum: "A hungry or under-fed starter brings too little leavening power.", loesung: "Refresh the starter twice in a row, 12 h apart, at 1:5:5 (e.g. 10 g + 50 g + 50 g). Then mix again." },
      { label: "Degassed too much while shaping", warum: "Heavy pressing and folding pushes out the gases you built up.", loesung: "While shaping, only build tension, don't squeeze it out. Large bubbles on the surface may stay visible." },
      { label: "Hydration too low", warum: "Dry doughs barely develop an open crumb.", loesung: "Work up to 75-78% step by step. With stronger flours (T65, Manitoba) even 80% is possible." },
      { label: "Uneven temperature", warum: "Fluctuating room temperature gives uneven fermentation.", loesung: "Oven: use normal top/bottom heat. Much more reproducible than the kitchen counter." },
    ]},
    { id: 6, emoji: "🍋", titel: "Bread too sour", ursachen: [
      { label: "Final proof cold for too long", warum: "Over 16 h of retard produces noticeably more acetic acid.", loesung: "Shorten the cold final proof to 8-12 h in the fridge. The rise is enough, the flavor is milder." },
      { label: "Starter kept too stiff", warum: "Stiff starters favor acetic acid over lactic acid - a sharper acid profile.", loesung: "Always run the starter 1:1 flour to water (100% hydration). Lactic acid bacteria are favored, the flavor gets rounder." },
      { label: "Used the starter past its peak", warum: "After the peak the starter turns sour fast and brings that acidity into the dough.", loesung: "Time the feed so you use the starter at its peak (usually 4-6 h after feeding at 25°C). Marking the jar with a rubber band helps." },
      { label: "Too much rye", warum: "Rye sours much more strongly than wheat, especially with a long ferment.", loesung: "For mild bread reduce rye to 20%. For deliberately bold rye bread - make it a feature." },
      { label: "Too little starter, too long a bulk", warum: "Small amounts of starter need a lot of time - time is acidity.", loesung: "More starter (15-20%), shorter bulk. Same aeration with much less acid build-up." },
    ]},
    { id: 7, emoji: "✂️", titel: "No ears", hasGefaessLink: true, ursachen: [
      { label: "Wrong scoring angle", warum: "Vertical cuts don't open - they pull shut upward.", loesung: "Hold the blade flat, score at a 30° angle. One decisive motion, 0.5-1 cm deep. Don't saw, don't go over it again." },
      { label: "Dough was too warm", warum: "Warm doughs are soft, hard to score and spread flat.", loesung: "Straight from the banneton fridge-cold into the oven. Gives the sharpest ears and the easiest handling." },
      { label: "Too little steam in phase 1", warum: "Without steam the crust sets too early and the dough can't tear open.", loesung: "Oven: use normal top/bottom heat. At 250°C with 100% steam. Then release all steam, drop to 220°C." },
      { label: "Over-fermented", warum: "A tired dough has no strength left for oven spring and ear formation.", loesung: "End the final proof in time - the poke test is the referee. Better a bit early into the oven than too late." },
      { label: "Cut pulled shut", warum: "A moist surface lets the cut run together before it can open.", loesung: "Dust thinly with rice flour before scoring. The surface gets drier, the cut stays open and shows up sharply." },
    ]},
    { id: 8, emoji: "🕳️", titel: "Huge holes", ursachen: [
      { label: "Skipped the preshape", warum: "Without an interim shaping, bubbles stay concentrated and grow into big cavities.", loesung: "Round preshape - 20 min bench rest - final shape. Two-stage shaping spreads the gas structure evenly." },
      { label: "Giant bubbles not pressed out", warum: "Large visible bubbles during shaping grow into cavity pores in the oven.", loesung: "While shaping, gently dissolve the biggest bubbles with a flat hand. Small ones may stay - they're the open crumb." },
      { label: "Uneven fermentation", warum: "Cold/warm zones in the dough give uneven aeration.", loesung: "Run the bulk at a steady temperature. Oven: use normal top/bottom heat." },
      { label: "Cut too shallow", warum: "A shallow cut directs steam upward instead of into the crumb - a cavity under the crust.", loesung: "Score at a 30° angle, 1 cm deep. Steam escapes in a controlled way through the cut and forms clean ears." },
    ]},
    { id: 9, emoji: "🪵", titel: "Crust too hard", hasGefaessLink: true, ursachen: [
      { label: "Too little steam in phase 1", warum: "Without steam the crust hardens too early and turns into bark.", loesung: "Oven: use normal top/bottom heat. At 250°C with 100% steam. The crust stays elastic, maximum oven spring." },
      { label: "Baked too long", warum: "Over 45 min at high temperatures dries the crust out completely.", loesung: "For a 900 g loaf 40-45 min total bake. Core temperature 96-98°C is the stop criterion, not the clock." },
      { label: "Cooled in the oven", warum: "Resting in the warm oven dries the crust out further.", loesung: "Take it out of the oven right after baking, onto a rack. Air circulation all around prevents both softening and drying out." },
      { label: "Final temperature too high", warum: "A constant 250°C until the end burns and thickens the crust.", loesung: "After the steam phase drop to 210-220°C. Spares the crust and gives dark browning without hardening." },
    ]},
    { id: 10, emoji: "👻", titel: "Crust stays pale", hasGefaessLink: true, ursachen: [
      { label: "Steam until the end", warum: "A moist surface prevents the Maillard reaction - no browning possible.", loesung: "Release all steam after 20 min. Phase 2 must be dry, otherwise nothing browns." },
      { label: "Layer of flour on the loaf", warum: "Flour insulates the surface from direct heat contact.", loesung: "Before scoring, brush off excess flour with a soft brush. Leave only the thinnest rice flour for the cut." },
      { label: "Oven not hot enough", warum: "Below 220°C there isn't enough energy for strong browning.", loesung: "Phase 2 at 220-230°C fan. Last 5 min top heat or briefly the grill - stay close." },
      { label: "Too little residual sugar", warum: "Under-fermented dough has few free sugars needed for Maillard.", loesung: "Carry the bulk fully to +75% volume. Residual sugar = browning = flavor." },
      { label: "Only bottom/fan heat", warum: "Without top heat the top stays pale, even if the bottom is already dark.", loesung: "Last 5 min with top heat. Stay close - it goes from golden to black fast." },
    ]},
    { id: 11, emoji: "💥", titel: "Tears open wrong", hasGefaessLink: true, ursachen: [
      { label: "Too hesitant a cut", warum: "Shallow or too-short cuts don't open - the steam looks for the next best exit.", loesung: "One decisive motion with the blade, 0.5-1 cm deep, at a 30° angle. Don't go over it, don't correct." },
      { label: "Under-fermented", warum: "Full leavening potential in the oven looks for a way out - and finds the weak spot.", loesung: "Extend the bulk until the dough has clear volume (+75%). Or use a cold final proof - brings calm and structure." },
      { label: "Too little steam", warum: "The crust sets too fast, the cut can't react anymore, pressure bursts out the side.", loesung: "Full steam phase 20 min at 250°C. The oven: use normal top/bottom heat." },
      { label: "Uneven shaping tension", warum: "A weak side in the loaf gives way first under pressure.", loesung: "During the final shape build tension evenly all around. For batards: fold both sides equally." },
    ]},
    { id: 12, emoji: "🫧", titel: "Starter doesn't bubble", ursachen: [
      { label: "Fed too rarely", warum: "Without regular food the microbes starve and acidify the jar.", loesung: "Rescue plan: feed every 12 h for 2-3 days in a row, no break. After 48 h life should be back." },
      { label: "Stored too cool", warum: "Below 20°C the microbes barely work, below 15°C almost not at all.", loesung: "Keep it at 25-26°C. Oven: use normal top/bottom heat." },
      { label: "Chlorinated tap water", warum: "Chlorine inhibits microbes and makes life hard for them.", loesung: "Let the water sit out for 30 min (chlorine evaporates) or filter it. Still mineral water works too." },
      { label: "Flour too low in enzymes", warum: "Highly refined white wheat flour has little enzyme activity - the microbes find nothing to do.", loesung: "Mix in 10-20% wholegrain rye at every feed. Usually brings noticeable life into the jar within 24 h." },
      { label: "Feeding ratio too small", warum: "1:1:1 acidifies the jar before the microbes can really work.", loesung: "Switch to 1:5:5: 10 g starter + 50 g flour + 50 g water. Gives the starter room to grow." },
    ]},
  ],
  es: [
    { id: 1, emoji: "😴", titel: "La masa apenas sube", ursachen: [
      { label: "La masa madre no estaba en su punto", warum: "Una masa madre demasiado joven o ya colapsada no tiene suficientes microbios activos.", loesung: "Usa la masa madre solo cuando la cúpula empieza a bajar. Test de flotación: una cucharadita debe flotar en el agua. Programa la alimentación 4-6 h antes de amasar para acertar el punto máximo." },
      { label: "Fermentada demasiado fría", warum: "Por debajo de 22°C los microbios se frenan mucho; por debajo de 18°C apenas hay subida.", loesung: "Haz la fermentación en bloque a 24-26°C constantes. Tu horno: usa calor arriba/abajo normal." },
      { label: "Poca masa madre en la masa", warum: "Con muy poca proporción de masa madre hace falta mucho más tiempo - a menudo más del que la masa aguanta.", loesung: "Sube la masa madre al 15-20% de la harina. Más fuerza, bloque más corto y menos acidez a la vez." },
      { label: "Sal directa sobre la masa madre", warum: "El contacto directo con la sal choca a los microbios en ese punto.", loesung: "Orden: autólisis (harina + agua) - integrar la masa madre - la sal al final con un chorrito de agua. Nunca pongas sal y masa madre directamente juntas." },
      { label: "Por reloj en vez de por volumen", warum: "Los tiempos fijos de las recetas ignoran la temperatura real de tu cocina.", loesung: "Termina el bloque al +50-75% de volumen, con superficie abombada y burbujas visibles en el lateral del bol. Un bol de cristal o una marca ayudan." },
    ]},
    { id: 2, emoji: "🫠", titel: "Masa demasiado pegajosa", ursachen: [
      { label: "Poco desarrollo del gluten", warum: "Sin suficientes fases de pliegues no se forma una red que sostenga.", loesung: "4 series de pliegues en las primeras 2 h, cada 30 min. Gira la masa 90° entre tandas." },
      { label: "La harina no aguanta la hidratación", warum: "La harina de trigo 550 aguanta menos agua que la T65, la Tipo 0 o las integrales.", loesung: "Baja la hidratación un 3-5% y vuelve a subirla poco a poco. O elige una harina más fuerte con al menos 12% de proteína." },
      { label: "Fermentada demasiado caliente", warum: "Por encima de 28°C las enzimas degradan el gluten más rápido de lo que se desarrolla.", loesung: "Ajusta el bloque a 24-25°C. En el horno: usa calor arriba/abajo normal." },
      { label: "Solo pliegues suaves", warum: "Con hidratación alta, los pliegues suaves a menudo no dan la tensión necesaria.", loesung: "Usa 3-5 min de slap and fold sobre la encimera al principio, hasta que la masa gane estructura visible y se despegue de la mesa." },
      { label: "La masa está sobrefermentada", warum: "Las enzimas proteasa ya han descompuesto la red de gluten.", loesung: "Esta masa ya no se salva - hornéala igual, saldrá más bien un pan plano. La próxima vez haz el bloque más corto o más fresco." },
    ]},
    { id: 3, emoji: "🧽", titel: "Miga apelmazada", hasGefaessLink: true, ursachen: [
      { label: "Cortado demasiado pronto", warum: "El almidón solo retrograda al enfriarse. Un corte en caliente siempre parece apelmazado.", loesung: "Deja enfriar al menos 4 h sobre una rejilla, con hidratación alta mejor 8-12 h. Sí, cuesta - pero ahí está la diferencia." },
      { label: "No alcanzó la temperatura interior", warum: "Por debajo de 96°C en el centro el almidón no gelatiniza; la miga queda húmeda y correosa.", loesung: "Termómetro de pincho en el centro de la pieza. Objetivo 96-98°C. Si hace falta, hornea 5-10 min más a 210°C." },
      { label: "Demasiado vapor hasta el final", warum: "Un horno húmedo de forma constante mantiene miga y corteza blandas.", loesung: "Horno: usa calor arriba/abajo normal. 100% vapor a 250°C - luego 0% vapor, ventilador, 210°C el resto. La segunda fase debe ser seca." },
      { label: "La masa estaba subfermentada", warum: "Poca fermentación significa poca aireación y una miga densa y húmeda.", loesung: "Alarga el bloque hasta que la masa muestre +75% de volumen, se vea abombada y haya burbujas en el lateral del bol. Mejor esperar más que formar demasiado pronto." },
      { label: "Tiempo de horneado demasiado corto", warum: "40 min bastan para piezas pequeñas, para 900 g+ a menudo no.", loesung: "40-45 min de horneado total para una pieza de un kilo. Menos para más pequeñas, más para más grandes. La temperatura interior es el mejor indicador." },
    ]},
    { id: 4, emoji: "🫓", titel: "La pieza queda plana", ursachen: [
      { label: "Sobrefermentada en el segundo levado", warum: "La masa ha pasado su punto máximo y ya no tiene fuerza para el empuje del horno.", loesung: "Prueba del dedo: hunde una marca con el dedo. Vuelve enseguida - espera. Se queda a medias - perfecto. Se queda del todo - tarde, hornea ya." },
      { label: "Formado poco limpio", warum: "Formar de un solo paso da poca tensión de superficie para la estabilidad.", loesung: "Preformado redondo - 20-30 min de reposo - formado final con piel tensa. El formado en dos pasos es la mayor palanca para la altura." },
      { label: "Segundo levado caliente", warum: "El levado a temperatura ambiente cansa la masa demasiado rápido, sobre todo con hidratación alta.", loesung: "Segundo levado 12-16 h a 4-6°C en la nevera (retardo). Da más volumen, un greñado más fácil y mejor aroma a la vez." },
      { label: "Harina demasiado floja", warum: "Por debajo del 11% de proteína la red no puede retener los gases.", loesung: "Elige harina con al menos 12% de proteína (T65, Manitoba, alta extracción). O añade 10-15% de sémola de trigo duro." },
      { label: "La masa se pegó en el banneton", warum: "Al volcar, la masa rompe la tensión de superficie que tanto costó crear.", loesung: "Enharina el banneton generosamente con una mezcla de harina de arroz y trigo (50/50). La harina de arroz no se pega - ese es el truco." },
    ]},
    { id: 5, emoji: "🧱", titel: "Miga demasiado densa", ursachen: [
      { label: "Subfermentada", warum: "La masa entró al horno demasiado pronto; los microbios no tuvieron tiempo de airearla.", loesung: "Lleva el bloque por volumen, no por reloj: +75% de volumen, superficie abombada, burbujas en el lateral. A 24°C a menudo 5-7 h." },
      { label: "La masa madre estaba débil", warum: "Una masa madre hambrienta o mal alimentada da poca fuerza.", loesung: "Refresca la masa madre 2 días seguidos cada 12 h a 1:5:5 (p. ej. 10 g + 50 g + 50 g). Luego vuelve a amasar." },
      { label: "Desgasificada de más al formar", warum: "Apretar y plegar con fuerza expulsa los gases que tanto costó crear.", loesung: "Al formar, crea solo tensión, no la exprimas. Las burbujas grandes en la superficie pueden quedar visibles." },
      { label: "Hidratación demasiado baja", warum: "Las masas secas apenas desarrollan miga abierta.", loesung: "Sube poco a poco al 75-78%. Con harinas más fuertes (T65, Manitoba) hasta 80% es posible." },
      { label: "Temperatura irregular", warum: "Una temperatura ambiente que oscila da una fermentación irregular.", loesung: "Horno: usa calor arriba/abajo normal. Mucho más reproducible que la encimera." },
    ]},
    { id: 6, emoji: "🍋", titel: "Pan demasiado ácido", ursachen: [
      { label: "Segundo levado en frío demasiado largo", warum: "Más de 16 h de retardo producen bastante más ácido acético.", loesung: "Acorta el levado en frío a 8-12 h en la nevera. La subida basta y el aroma es más suave." },
      { label: "Masa madre demasiado firme", warum: "Las masas madre firmes favorecen el ácido acético sobre el láctico - un perfil más punzante.", loesung: "Lleva siempre la masa madre 1:1 harina y agua (100% hidratación). Se favorecen las bacterias lácticas y el aroma se vuelve más redondo." },
      { label: "Usada pasado el punto máximo", warum: "Tras el punto máximo la masa madre se acidifica rápido y lleva esa acidez a la masa.", loesung: "Programa la alimentación para usar la masa madre en su punto (normalmente 4-6 h tras alimentar a 25°C). Marcar el frasco con una goma ayuda." },
      { label: "Demasiado centeno", warum: "El centeno acidifica mucho más que el trigo, sobre todo con fermentaciones largas.", loesung: "Para pan suave reduce el centeno al 20%. Para un pan de centeno intenso a propósito - conviértelo en una virtud." },
      { label: "Poca masa madre, bloque demasiado largo", warum: "Las cantidades pequeñas de masa madre necesitan mucho tiempo - el tiempo es acidez.", loesung: "Más masa madre (15-20%), bloque más corto. La misma aireación con mucha menos acidez." },
    ]},
    { id: 7, emoji: "✂️", titel: "Sin orejas", hasGefaessLink: true, ursachen: [
      { label: "Ángulo de corte incorrecto", warum: "Los cortes verticales no se abren - se cierran hacia arriba.", loesung: "Sujeta la cuchilla plana, corta en un ángulo de 30°. Un movimiento decidido, 0,5-1 cm de profundidad. No serruches ni repases." },
      { label: "La masa estaba demasiado caliente", warum: "Las masas calientes son blandas, difíciles de cortar y se expanden planas.", loesung: "Directa del banneton fría de nevera al horno. Da las orejas más nítidas y el manejo más fácil." },
      { label: "Poco vapor en la fase 1", warum: "Sin vapor la corteza se fija demasiado pronto y la masa ya no puede abrirse.", loesung: "Horno: usa calor arriba/abajo normal. A 250°C con 100% de vapor. Luego suelta todo el vapor y baja a 220°C." },
      { label: "Sobrefermentada", warum: "Una masa cansada ya no tiene fuerza para el empuje del horno ni para formar orejas.", loesung: "Termina el segundo levado a tiempo - la prueba del dedo manda. Mejor un poco antes al horno que demasiado tarde." },
      { label: "El corte se cerró", warum: "Una superficie húmeda hace que el corte se junte antes de poder abrirse.", loesung: "Espolvorea un poco de harina de arroz antes de cortar. La superficie queda más seca, el corte se mantiene abierto y se marca nítido." },
    ]},
    { id: 8, emoji: "🕳️", titel: "Agujeros enormes", ursachen: [
      { label: "Te saltaste el preformado", warum: "Sin un formado intermedio, las burbujas se concentran y crecen hasta huecos enormes.", loesung: "Preformado redondo - 20 min de reposo - formado final. El formado en dos pasos reparte la estructura de gas de forma uniforme." },
      { label: "Burbujas gigantes sin sacar", warum: "Las burbujas grandes visibles al formar crecen en el horno hasta huecos.", loesung: "Al formar, deshaz suavemente las burbujas más grandes con la mano plana. Las pequeñas pueden quedar - son la miga abierta." },
      { label: "Fermentación irregular", warum: "Zonas frías/calientes en la masa dan una aireación irregular.", loesung: "Haz el bloque a temperatura constante. Horno: usa calor arriba/abajo normal." },
      { label: "Corte demasiado plano", warum: "Un corte plano dirige el vapor hacia arriba en vez de a la miga - un hueco bajo la corteza.", loesung: "Corta en ángulo de 30°, 1 cm de profundidad. El vapor sale controlado por el corte y forma orejas limpias." },
    ]},
    { id: 9, emoji: "🪵", titel: "Corteza demasiado dura", hasGefaessLink: true, ursachen: [
      { label: "Poco vapor en la fase 1", warum: "Sin vapor la corteza se endurece demasiado pronto y se vuelve cortezón.", loesung: "Horno: usa calor arriba/abajo normal. A 250°C con 100% de vapor. La corteza se mantiene elástica, máximo empuje de horno." },
      { label: "Horneado demasiado tiempo", warum: "Más de 45 min a temperaturas altas resecan la corteza por completo.", loesung: "Para una pieza de 900 g, 40-45 min de horneado total. La temperatura interior de 96-98°C es el criterio de parada, no el reloj." },
      { label: "Enfriada dentro del horno", warum: "Reposar en el horno caliente reseca aún más la corteza.", loesung: "Sácala del horno justo al terminar, a una rejilla. La circulación de aire alrededor evita que se ablande y que se reseque." },
      { label: "Temperatura final demasiado alta", warum: "250°C constantes hasta el final queman y engrosan la corteza.", loesung: "Tras la fase de vapor baja a 210-220°C. Cuida la corteza y da un dorado oscuro sin endurecer." },
    ]},
    { id: 10, emoji: "👻", titel: "La corteza queda pálida", hasGefaessLink: true, ursachen: [
      { label: "Vapor hasta el final", warum: "Una superficie húmeda impide la reacción de Maillard - no hay dorado posible.", loesung: "Suelta todo el vapor a los 20 min. La fase 2 debe ser seca, si no, no se dora nada." },
      { label: "Capa de harina sobre la pieza", warum: "La harina aísla la superficie del contacto directo con el calor.", loesung: "Antes de cortar, retira el exceso de harina con un pincel suave. Deja solo una capa finísima de harina de arroz para el corte." },
      { label: "Horno poco caliente", warum: "Por debajo de 220°C no hay energía suficiente para un dorado intenso.", loesung: "Fase 2 a 220-230°C con ventilador. Los últimos 5 min calor arriba o un momento el grill - quédate cerca." },
      { label: "Poco azúcar residual", warum: "Una masa subfermentada tiene pocos azúcares libres, necesarios para Maillard.", loesung: "Lleva el bloque por completo hasta +75% de volumen. Azúcar residual = dorado = sabor." },
      { label: "Solo calor abajo/ventilador", warum: "Sin calor arriba la parte superior queda pálida, aunque la base ya esté oscura.", loesung: "Los últimos 5 min con calor arriba. Quédate cerca - pasa de dorado a negro muy rápido." },
    ]},
    { id: 11, emoji: "💥", titel: "Se abre mal", hasGefaessLink: true, ursachen: [
      { label: "Corte demasiado dudoso", warum: "Cortes planos o demasiado cortos no se abren - el vapor busca la siguiente salida.", loesung: "Un movimiento decidido con la cuchilla, 0,5-1 cm de profundidad, en ángulo de 30°. No repases ni corrijas." },
      { label: "Subfermentada", warum: "Todo el potencial de subida en el horno busca una salida - y encuentra el punto débil.", loesung: "Alarga el bloque hasta que la masa tenga volumen claro (+75%). O usa un segundo levado en frío - da calma y estructura." },
      { label: "Poco vapor", warum: "La corteza se fija demasiado rápido, el corte ya no reacciona y la presión revienta por el lateral.", loesung: "Fase de vapor completa 20 min a 250°C. El horno: usa calor arriba/abajo normal." },
      { label: "Tensión de formado irregular", warum: "Un lado débil de la pieza cede primero bajo presión.", loesung: "En el formado final crea tensión uniforme por todo el contorno. En batards: pliega ambos lados por igual." },
    ]},
    { id: 12, emoji: "🫧", titel: "La masa madre no burbujea", ursachen: [
      { label: "Alimentada muy de vez en cuando", warum: "Sin comida regular los microbios pasan hambre y acidifican el frasco.", loesung: "Plan de rescate: alimenta cada 12 h durante 2-3 días seguidos, sin pausa. A las 48 h debería volver la vida." },
      { label: "Guardada demasiado fría", warum: "Por debajo de 20°C los microbios apenas trabajan, por debajo de 15°C casi nada.", loesung: "Mantenla a 25-26°C. Horno: usa calor arriba/abajo normal." },
      { label: "Agua del grifo con cloro", warum: "El cloro inhibe a los microbios y les complica la vida.", loesung: "Deja el agua al aire 30 min (el cloro se evapora) o fíltrala. El agua mineral sin gas también vale." },
      { label: "Harina con pocas enzimas", warum: "La harina de trigo blanca muy refinada tiene poca actividad enzimática - los microbios no encuentran qué hacer.", loesung: "Añade un 10-20% de centeno integral en cada alimentación. Suele traer vida notable al frasco en 24 h." },
      { label: "Proporción de alimentación demasiado pequeña", warum: "1:1:1 acidifica el frasco antes de que los microbios puedan trabajar bien.", loesung: "Cambia a 1:5:5: 10 g de masa madre + 50 g de harina + 50 g de agua. Le da a la masa madre espacio para crecer." },
    ]},
  ],
};

// Mehrsprachige Stichwoerter pro Problem-ID (fuer den Smart-Link aus dem Krumenleser)
const KEYWORDS = {
  1: ["untergare", "kein trieb", "schwacher starter", "under-proof", "underproofed", "no rise", "weak starter", "barely rises", "subfermentado", "poca fermentación", "sin subida", "apenas sube"],
  2: ["klebrig", "klitschig", "hydration", "sticky", "slack", "pegajosa", "pegajoso", "hidratación"],
  3: ["speckig", "feucht", "klitschig", "speckschicht", "gummy", "moist", "dense streak", "apelmazada", "húmeda", "gomosa"],
  4: ["flach", "uebergare", "kein volumen", "flat", "spread", "over-proof", "overproofed", "plana", "plano", "sin volumen", "sobrefermentada"],
  5: ["dicht", "untergare", "kein volumen", "fest", "dense", "tight", "under-proof", "densa", "compacta", "subfermentada"],
  6: ["sauer", "essig", "scharf", "sour", "acidic", "vinegar", "ácido", "acido", "agrio", "vinagre"],
  7: ["ohren", "schnitt", "geschlossen", "ears", "score", "closed", "no ear", "orejas", "corte", "greñado"],
  8: ["loch", "uebergare", "hohlraum", "holes", "tunnel", "cavity", "over-proof", "agujeros", "huecos", "túnel"],
  9: ["hart", "borke", "harte kruste", "hard", "tough crust", "hard crust", "dura", "cortezón", "corteza dura"],
  10: ["blass", "keine farbe", "maillard", "pale", "no color", "no colour", "browning", "pálida", "palida", "sin color", "dorado"],
  11: ["riss", "platzt", "seitlich", "tears", "burst", "side", "blowout", "se abre", "revienta", "grieta"],
  12: ["starter", "tot", "kein leben", "dead starter", "no bubbles", "doesn't bubble", "not active", "masa madre", "no burbujea", "sin vida"],
};

export function getProblems(lang) {
  return FEHLERFINDER_PROBLEMS[lang] || FEHLERFINDER_PROBLEMS.de;
}

// KI-Diagnose-Text auf passende Symptom-ID mappen (sprachuebergreifend)
export function findProblemByDiagnose(diagnoseText, lang = "de") {
  if (!diagnoseText) return null;
  const text = diagnoseText.toLowerCase();
  const problems = getProblems(lang);

  for (const idStr of Object.keys(KEYWORDS)) {
    const id = Number(idStr);
    if (KEYWORDS[id].some((kw) => text.includes(kw.toLowerCase()))) {
      return problems.find((p) => p.id === id) || null;
    }
  }
  for (const p of problems) {
    if (text.includes(p.titel.toLowerCase())) return p;
  }
  return null;
}
