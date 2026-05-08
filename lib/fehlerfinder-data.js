// Fehlerfinder-Datenbank
// 12 Symptome, 57 Loesungen
// Quelle: dein Original-Fehlerfinder von sauer.macht.krustig

export const FEHLERFINDER_PROBLEMS = [
  {
    id: 1,
    emoji: "😴",
    titel: "Teig geht kaum auf",
    keywords: ["untergare", "kein trieb", "schwacher starter"],
    ursachen: [
      {
        label: "Starter war nicht auf Peak",
        warum: "Ein zu junger oder bereits abgefallener Starter hat nicht genug aktive Mikroben.",
        loesung: "Setze den Starter nur ein, wenn die Kuppel gerade einfaellt. Schwimmtest: Ein Teeloeffel auf Wasser muss oben schwimmen. Fuetterung 4-6 h vor dem Teigansatz timen, dann triffst du den Peak."
      },
      {
        label: "Zu kalt gefuehrt",
        warum: "Unter 22 Grad bremsen die Mikroben stark, unter 18 Grad kommt kaum noch Trieb.",
        loesung: "Bulk bei konstant 24-26 Grad fuehren. Dein Ofen: normale Ober-/Unterhitze verwenden."
      },
      {
        label: "Zu wenig Starter im Teig",
        warum: "Bei sehr niedrigem Starter-Anteil braucht es deutlich mehr Zeit - oft mehr, als der Teig aushaelt.",
        loesung: "Erhoehe den Starter auf 15-20 Prozent vom Mehl. Mehr Triebkraft, kuerzerer Bulk, weniger Saeure gleichzeitig."
      },
      {
        label: "Salz direkt auf den Starter",
        warum: "Direkter Salzkontakt schockt die Mikroben an der Kontaktstelle.",
        loesung: "Reihenfolge: Autolyse (Mehl + Wasser) - Starter einarbeiten - zuletzt Salz mit einem Schluck Wasser. Nie Salz und Starter direkt aufeinander geben."
      },
      {
        label: "Nach Uhr statt nach Volumen",
        warum: "Feste Zeitangaben aus Rezepten ignorieren deine tatsaechliche Kuechentemperatur.",
        loesung: "Beende den Bulk bei +50-75 Prozent Volumen mit kuppeliger Oberflaeche und sichtbaren Blasen an der Schuesselseite. Glas-Schuessel oder Markierung hilft."
      }
    ]
  },
  {
    id: 2,
    emoji: "🫠",
    titel: "Teig zu klebrig",
    keywords: ["klebrig", "klitschig", "hydration"],
    ursachen: [
      {
        label: "Zu wenig Glutenentwicklung",
        warum: "Ohne genuegend Dehn- und Faltphasen bildet sich kein tragfaehiges Netzwerk.",
        loesung: "4 Sets Stretch und Fold in den ersten 2 h, jeweils im Abstand von 30 Min. Teig dabei um 90 Grad drehen zwischen den Zuegen."
      },
      {
        label: "Mehl traegt die Hydration nicht",
        warum: "Weizen 550 traegt weniger Wasser als T65, Tipo 0 oder Vollkornmehle.",
        loesung: "Hydration um 3-5 Prozent absenken und wieder hochtasten. Oder staerkeres Mehl mit mindestens 12 Prozent Proteingehalt waehlen."
      },
      {
        label: "Zu warm gefuehrt",
        warum: "Ueber 28 Grad bauen Enzyme das Gluten schneller ab als es sich entwickelt.",
        loesung: "Bulk auf 24-25 Grad einregeln. Im Ofen: normale Ober-/Unterhitze verwenden."
      },
      {
        label: "Nur Stretch und Fold genutzt",
        warum: "Bei hoher Hydration reichen sanfte S und F oft nicht fuer die noetige Spannung.",
        loesung: "Frueh 3-5 Min. Slap und Fold auf der Arbeitsflaeche einsetzen, bis der Teig sichtbar Struktur aufbaut und sich vom Tisch loest."
      },
      {
        label: "Teig ist ueberfermentiert",
        warum: "Protease-Enzyme haben das Glutennetz bereits zerlegt.",
        loesung: "Diesen Teig nicht mehr zu retten - backe ihn trotzdem, wird eher ein Fladenbrot. Naechstes Mal Bulk kuerzer oder kuehler fuehren."
      }
    ]
  },
  {
    id: 3,
    emoji: "🧽",
    titel: "Krume speckig",
    keywords: ["speckig", "feucht", "klitschig", "speckschicht"],
    hasGefaessLink: true,
    ursachen: [
      {
        label: "Zu frueh angeschnitten",
        warum: "Staerke retrogradiert erst beim Auskuehlen. Warmer Anschnitt wirkt immer speckig.",
        loesung: "Mindestens 4 h auf dem Gitter auskuehlen lassen, bei hoher Hydration besser 8-12 h. Ja, das ist schwer - aber es ist der Unterschied."
      },
      {
        label: "Kerntemperatur nicht erreicht",
        warum: "Unter 96 Grad im Kern ist die Staerke nicht verkleistert, Krume bleibt feucht und zaeh.",
        loesung: "Einstichthermometer in die Mitte des Laibs. Zielwert 96-98 Grad. Bei Bedarf 5-10 Min. bei 210 Grad nachbacken."
      },
      {
        label: "Zu viel Dampf bis zum Ende",
        warum: "Dauerhaft feuchter Ofen haelt Krume und Kruste weich.",
        loesung: "Ofen: normale Ober-/Unterhitze verwenden. 100 Prozent Dampf bei 250 Grad - dann 0 Prozent Dampf, Umluft, 210 Grad fuer den Rest. Die zweite Phase muss trocken sein."
      },
      {
        label: "Teig war unterfermentiert",
        warum: "Zu wenig Gaerung bedeutet zu wenig Lockerung und dichte, feuchte Krume.",
        loesung: "Bulk verlaengern, bis der Teig +75 Prozent Volumen zeigt, kuppelig wirkt und Blasen an der Schuesselseite sichtbar sind. Lieber laenger warten als zu frueh formen."
      },
      {
        label: "Zu kurze Backzeit",
        warum: "40 Min. reichen fuer kleine Laibe, fuer 900 g+ oft nicht.",
        loesung: "40-45 Min. Gesamtbackzeit fuer einen Kilo-Laib. Bei kleineren entsprechend weniger, bei groesseren mehr. Kerntemperatur ist der beste Indikator."
      }
    ]
  },
  {
    id: 4,
    emoji: "🫓",
    titel: "Laib laeuft flach",
    keywords: ["flach", "uebergare", "kein volumen"],
    ursachen: [
      {
        label: "Ueberfermentiert in der Stueckgare",
        warum: "Teig hat seinen Hoehepunkt ueberschritten und keine Kraft mehr fuer den Ofentrieb.",
        loesung: "Poke-Test: Delle mit Finger eindruecken. Springt sofort zurueck - noch warten. Bleibt halb stehen - perfekt. Bleibt ganz stehen - zu spaet, sofort backen."
      },
      {
        label: "Keine saubere Formgebung",
        warum: "Einschrittiges Formen bringt zu wenig Oberflaechenspannung fuer Stabilitaet.",
        loesung: "Preshape rund - 20-30 Min. Bench-Rest - final shape mit straffer Haut. Die zweistufige Formgebung ist der groesste Hebel fuer Hoehe."
      },
      {
        label: "Warme Stueckgare",
        warum: "Raumtemperatur-Gare laesst den Teig zu schnell ermueden, besonders bei hoher Hydration.",
        loesung: "Stueckgare 12-16 h bei 4-6 Grad im Kuehlschrank (Retard). Bringt mehr Volumen, einfacheres Einschneiden und besseres Aroma gleichzeitig."
      },
      {
        label: "Mehl zu schwach",
        warum: "Unter 11 Prozent Proteingehalt kann das Netzwerk die Gase nicht halten.",
        loesung: "Mehl mit mindestens 12 Prozent Protein waehlen (T65, Manitoba, Ruchmehl). Alternativ 10-15 Prozent Hartweizengriess beimischen."
      },
      {
        label: "Teig klebte im Gaerkoerbchen",
        warum: "Beim Stuerzen reisst der Teig die muehsam aufgebaute Oberflaechenspannung wieder auf.",
        loesung: "Gaerkoerbchen grosszuegig mit Reismehl-Weizenmehl-Mix (50/50) bemehlen. Reismehl klebt nicht - das ist der Trick."
      }
    ]
  },
  {
    id: 5,
    emoji: "🧱",
    titel: "Krume zu dicht",
    keywords: ["dicht", "untergare", "kein volumen", "fest"],
    ursachen: [
      {
        label: "Unterfermentiert",
        warum: "Teig kam zu frueh in den Ofen, Mikroben hatten nicht genug Zeit zu lockern.",
        loesung: "Bulk nach Volumen fuehren, nicht nach Uhr: +75 Prozent Volumen, kuppelige Oberflaeche, Blasen an der Seite. Bei 24 Grad oft 5-7 h."
      },
      {
        label: "Starter war schwach",
        warum: "Hungriger oder unterversorgter Starter bringt zu wenig Triebkraft.",
        loesung: "Starter 2 Tage in Folge im Abstand von 12 h mit 1:5:5 auffrischen (z. B. 10 g + 50 g + 50 g). Danach neu ansetzen."
      },
      {
        label: "Zu stark entgast beim Formen",
        warum: "Kraeftiges Druecken und Falten presst die erarbeiteten Gase wieder raus.",
        loesung: "Beim Formen nur Spannung aufbauen, nicht ausquetschen. Grosse Blasen an der Oberflaeche duerfen sichtbar bleiben."
      },
      {
        label: "Hydration zu niedrig",
        warum: "Trockene Teige entwickeln kaum offene Krume.",
        loesung: "Schrittweise auf 75-78 Prozent hochtasten. Bei staerkeren Mehlen (T65, Manitoba) auch 80 Prozent moeglich."
      },
      {
        label: "Ungleichmaessige Temperatur",
        warum: "Schwankende Raumtemperatur ergibt ungleichmaessige Gaerung.",
        loesung: "Ofen: normale Ober-/Unterhitze verwenden. Viel reproduzierbarer als Kuechentheke."
      }
    ]
  },
  {
    id: 6,
    emoji: "🍋",
    titel: "Brot zu sauer",
    keywords: ["sauer", "essig", "scharf"],
    ursachen: [
      {
        label: "Stueckgare zu lange kalt",
        warum: "Ueber 16 h Retard produzieren deutlich mehr Essigsaeure.",
        loesung: "Stueckgare auf 8-12 h im Kuehlschrank verkuerzen. Der Trieb reicht, das Aroma ist milder."
      },
      {
        label: "Starter zu fest gefuehrt",
        warum: "Feste Starter beguenstigen Essigsaeure ueber Milchsaeure - spitzeres Saeureprofil.",
        loesung: "Starter immer 1:1 Mehl zu Wasser fuehren (100 Prozent Hydration). Milchsaeurebakterien werden beguenstigt, das Aroma wird runder."
      },
      {
        label: "Starter im Abstieg verwendet",
        warum: "Nach dem Peak wird der Starter schnell sauer und bringt diese Saeure in den Teig.",
        loesung: "Fuetterung so timen, dass du den Starter am Peak einsetzt (meist 4-6 h nach Fuetterung bei 25 Grad). Glas mit Gummiband markieren hilft."
      },
      {
        label: "Roggenanteil zu hoch",
        warum: "Roggen saeuert deutlich staerker als Weizen, besonders bei langer Fuehrung.",
        loesung: "Fuer mildes Brot Roggenanteil auf 20 Prozent reduzieren. Fuer bewusst kraeftiges Roggenbrot - zur Eigenschaft machen."
      },
      {
        label: "Zu wenig Starter, zu langer Bulk",
        warum: "Kleine Starter-Mengen brauchen viel Zeit - Zeit ist Saeure.",
        loesung: "Mehr Starter (15-20 Prozent), kuerzerer Bulk. Gleiche Lockerung bei deutlich weniger Saeurebildung."
      }
    ]
  },
  {
    id: 7,
    emoji: "✂️",
    titel: "Keine Ohren",
    keywords: ["ohren", "schnitt", "geschlossen"],
    hasGefaessLink: true,
    ursachen: [
      {
        label: "Falscher Schnittwinkel",
        warum: "Senkrechte Schnitte oeffnen sich nicht - sie ziehen sich nach oben zu.",
        loesung: "Rasierklinge flach halten, im 30-Grad-Winkel schneiden. Eine entschlossene Bewegung, 0,5-1 cm tief. Nicht saegen, nicht nachsetzen."
      },
      {
        label: "Teig war zu warm",
        warum: "Warme Teige sind weich, schwer zu schneiden und dehnen sich flach.",
        loesung: "Direkt kuehlschrankkalt aus dem Gaerkorb in den Ofen. Ergibt die schaerfsten Ohren und einfachste Handhabung."
      },
      {
        label: "Zu wenig Dampf in Phase 1",
        warum: "Ohne Dampf setzt sich die Kruste zu frueh, der Teig kann nicht mehr aufreissen.",
        loesung: "Ofen: normale Ober-/Unterhitze verwenden. bei 250 Grad mit 100 Prozent Dampf. Danach Dampf komplett ablassen, auf 220 Grad senken."
      },
      {
        label: "Ueberfermentiert",
        warum: "Ein mueder Teig hat keine Kraft mehr fuer Ofentrieb und Ohrenbildung.",
        loesung: "Stueckgare rechtzeitig beenden - Poke-Test als Schiedsrichter. Lieber etwas frueher in den Ofen als zu spaet."
      },
      {
        label: "Schnitt zog sich zu",
        warum: "Feuchte Oberflaeche laesst den Schnitt zusammenlaufen, bevor er oeffnen kann.",
        loesung: "Vor dem Schneiden duenn Reismehl aufsieben. Oberflaeche wird trockener, Schnitt bleibt offen und zeichnet sich scharf ab."
      }
    ]
  },
  {
    id: 8,
    emoji: "🕳️",
    titel: "Riesige Loecher",
    keywords: ["loch", "uebergare", "hohlraum"],
    ursachen: [
      {
        label: "Preshape ausgelassen",
        warum: "Ohne Zwischenformgebung bleiben Blasen konzentriert und wachsen zu Grossraumporen.",
        loesung: "Preshape rund - 20 Min. Bench-Rest - final shape. Die zweistufige Formgebung verteilt die Gasstruktur gleichmaessig."
      },
      {
        label: "Riesenblasen nicht ausgedrueckt",
        warum: "Grosse sichtbare Blasen beim Formen wachsen im Ofen zur Hohlraum-Pore.",
        loesung: "Beim Formen mit flacher Hand die groessten Blasen sanft aufloesen. Kleine duerfen bleiben - sie sind die offene Krume."
      },
      {
        label: "Ungleichmaessige Gaerung",
        warum: "Kalte/warme Zonen im Teig ergeben ungleichmaessige Lockerung.",
        loesung: "Bulk bei konstanter Temperatur fuehren. Ofen: normale Ober-/Unterhitze verwenden."
      },
      {
        label: "Schnitt zu flach",
        warum: "Flacher Schnitt lenkt den Dampf nach oben statt in die Krume - Hohlraum unter der Kruste.",
        loesung: "Im 30-Grad-Winkel, 1 cm tief schneiden. Dampf entweicht kontrolliert durch den Schnitt und formt saubere Ohren."
      }
    ]
  },
  {
    id: 9,
    emoji: "🪵",
    titel: "Kruste zu hart",
    keywords: ["kruste", "hart", "borke"],
    hasGefaessLink: true,
    ursachen: [
      {
        label: "Zu wenig Dampf in Phase 1",
        warum: "Ohne Dampf haertet die Kruste zu frueh aus und wird zur Borke.",
        loesung: "Ofen: normale Ober-/Unterhitze verwenden. bei 250 Grad mit 100 Prozent Dampf. Kruste bleibt elastisch, maximaler Ofentrieb."
      },
      {
        label: "Zu lange gebacken",
        warum: "Ueber 45 Min. bei hohen Temperaturen trocknen die Kruste komplett aus.",
        loesung: "Fuer 900 g Laib 40-45 Min. Gesamtbackzeit. Kerntemperatur 96-98 Grad ist das Abbruchkriterium, nicht die Uhr."
      },
      {
        label: "Im Ofen ausgekuehlt",
        warum: "Nachgaren im warmen Ofen trocknet die Kruste weiter aus.",
        loesung: "Sofort nach Backende aus dem Ofen nehmen, auf ein Gitter. Luftzirkulation rundum verhindert Weichwerden und Austrocknen."
      },
      {
        label: "Endtemperatur zu hoch",
        warum: "Konstant 250 Grad bis zum Ende verbrennt und verdickt die Kruste.",
        loesung: "Nach der Dampfphase auf 210-220 Grad senken. Spart die Kruste und bringt dunkle Braeunung ohne Verhaertung."
      }
    ]
  },
  {
    id: 10,
    emoji: "👻",
    titel: "Kruste bleibt blass",
    keywords: ["blass", "keine farbe", "maillard"],
    hasGefaessLink: true,
    ursachen: [
      {
        label: "Dampf bis zum Ende",
        warum: "Feuchte Oberflaeche verhindert die Maillard-Reaktion - keine Braeunung moeglich.",
        loesung: "Dampf nach 20 Min. komplett ablassen. Phase 2 muss trocken sein, sonst braeunt nichts."
      },
      {
        label: "Mehlschicht auf dem Laib",
        warum: "Mehl isoliert die Oberflaeche vom direkten Hitzekontakt.",
        loesung: "Vor dem Einschneiden mit weichem Pinsel ueberschuessiges Mehl abkehren. Nur hauchduenn Reismehl fuer den Schnitt lassen."
      },
      {
        label: "Ofen nicht heiss genug",
        warum: "Unter 220 Grad reicht die Energie nicht fuer kraeftige Braeunung.",
        loesung: "Phase 2 bei 220-230 Grad Umluft. Letzte 5 Min. Oberhitze oder kurz Grillstufe - dabei bleiben."
      },
      {
        label: "Zu wenig Restzucker",
        warum: "Unterfermentierter Teig hat wenig freie Zucker, die fuer Maillard noetig sind.",
        loesung: "Bulk bis +75 Prozent Volumen vollstaendig ausfuehren. Restzucker = Braeunung = Geschmack."
      },
      {
        label: "Nur Unter-/Umluft",
        warum: "Ohne Oberhitze bleibt die Oberseite blass, auch wenn der Boden schon dunkel ist.",
        loesung: "Letzte 5 Min. mit Oberhitze. Dabei bleiben - geht schnell von golden zu schwarz."
      }
    ]
  },
  {
    id: 11,
    emoji: "💥",
    titel: "Reisst falsch auf",
    keywords: ["riss", "platzt", "seitlich"],
    hasGefaessLink: true,
    ursachen: [
      {
        label: "Schnitt zu zoegerlich",
        warum: "Flache oder zu kurze Schnitte oeffnen sich nicht - der Dampf sucht sich den naechstbesten Ausgang.",
        loesung: "Eine entschlossene Bewegung mit der Rasierklinge, 0,5-1 cm tief, im 30-Grad-Winkel. Nicht nachsetzen, nicht korrigieren."
      },
      {
        label: "Unterfermentiert",
        warum: "Volles Triebpotential im Ofen sucht sich einen Weg - und findet die Schwachstelle.",
        loesung: "Bulk verlaengern, bis Teig deutlich Volumen hat (+75 Prozent). Oder Stueckgare im Kuehlschrank nutzen - bringt Ruhe und Struktur."
      },
      {
        label: "Zu wenig Dampf",
        warum: "Kruste setzt sich zu schnell, der Schnitt kann nicht mehr reagieren, Druck platzt seitlich raus.",
        loesung: "Volle Dampfphase 20 Min. bei 250 Grad. Der Ofen: normale Ober-/Unterhitze verwenden."
      },
      {
        label: "Ungleichmaessige Formspannung",
        warum: "Eine schwache Seite im Laib gibt unter Druck zuerst nach.",
        loesung: "Beim final shape rundherum gleichmaessig Spannung aufbauen. Bei Laenglichen: beide Seiten gleich einschlagen."
      }
    ]
  },
  {
    id: 12,
    emoji: "🫧",
    titel: "Starter blubbert nicht",
    keywords: ["starter", "tot", "kein leben"],
    ursachen: [
      {
        label: "Zu selten gefuettert",
        warum: "Ohne regelmaessiges Futter hungern die Mikroben und versaeuern das Glas.",
        loesung: "Rettungsprogramm: 2-3 Tage in Folge alle 12 h fuettern, keine Pause. Nach 48 h sollte Leben zurueck sein."
      },
      {
        label: "Zu kuehl gelagert",
        warum: "Unter 20 Grad arbeiten die Mikroben kaum, unter 15 Grad fast gar nicht.",
        loesung: "Bei 25-26 Grad fuehren. Ofen: normale Ober-/Unterhitze verwenden."
      },
      {
        label: "Chlorhaltiges Leitungswasser",
        warum: "Chlor hemmt Mikroben und macht ihnen das Leben schwer.",
        loesung: "Wasser 30 Min. offen stehen lassen (Chlor verdunstet) oder filtern. Stilles Mineralwasser geht auch."
      },
      {
        label: "Zu enzymarmes Mehl",
        warum: "Stark ausgemahlenes helles Weizenmehl hat wenig Enzymaktivitaet - Mikroben finden nichts zu tun.",
        loesung: "10-20 Prozent Vollkornroggen bei jeder Fuetterung beimischen. Bringt meist innerhalb von 24 h spuerbar Leben ins Glas."
      },
      {
        label: "Zu kleines Fuetterungsverhaeltnis",
        warum: "1:1:1 versaeuert das Glas, bevor die Mikroben richtig arbeiten koennen.",
        loesung: "Auf 1:5:5 umstellen: 10 g Starter + 50 g Mehl + 50 g Wasser. Gibt dem Starter Luft zum Wachsen."
      }
    ]
  }
];

// Hilfsfunktion: KI-Diagnose-Text auf passende Symptom-ID mappen
export function findProblemByDiagnose(diagnoseText) {
  if (!diagnoseText) return null;
  const text = diagnoseText.toLowerCase();

  for (const problem of FEHLERFINDER_PROBLEMS) {
    if (problem.keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      return problem;
    }
    if (text.includes(problem.titel.toLowerCase())) {
      return problem;
    }
  }
  return null;
}
