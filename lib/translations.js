// Zentrales Uebersetzungs-Woerterbuch.
// Pro Sprache ein Objekt mit denselben Schluesseln.
// Neue Seiten fuegen hier einfach weitere Schluessel hinzu.

export const LANGS = ["de", "en", "es"];
export const LANG_LABELS = { de: "DE", en: "EN", es: "ES" };

export const translations = {
  de: {
    "greet.morning": "Guten Morgen",
    "greet.day": "Guten Tag",
    "greet.evening": "Guten Abend",

    "dash.title": "Starter-Werkstatt",
    "dash.subtitle": "Deine lebendigen Mitbewohner",
    "dash.yourStarters": "Deine Starter",
    "dash.loading": "Laedt ...",
    "dash.noStarterTitle": "Noch kein Starter",
    "dash.noStarterText": "Leg deinen ersten Sauerteig-Starter an.",
    "dash.createStarter": "Starter anlegen",
    "dash.addNew": "Neuen Starter anlegen",

    "pill.neverFed": "Noch nie gefuettert",
    "pill.urgent": "Dringend fuettern",
    "pill.hungry": "Hat Hunger",
    "pill.soon": "Bald fuettern",
    "pill.fridge": "Im Kuehlschrank",
    "pill.active": "Aktiv & blubbert",

    "card.lastFed": "zuletzt gefuettert",
    "card.neverFed": "noch nie gefuettert",
    "card.feed": "Fuettern",

    "next.label": "Naechste Fuetterung",
    "next.start": "jetzt anfangen",
    "next.due": "jetzt faellig",
    "next.inDays": "in {n} Tagen",
    "next.inHours": "in {n} Std",

    "tip.title": "Tipp des Tages",
    "tip.1": "Dein Starter riecht leicht nach Essig? Dann hat er Hunger - fuettere ihn 1:5:5 und stell ihn warm.",
    "tip.2": "Ein warmer Ort (24-26 Grad) zaubert deinem Starter neue Kraft.",
    "tip.3": "Blasen an der Oberflaeche sind ein gutes Zeichen - dein Starter ist aktiv.",
    "tip.4": "Zum Backen den Starter 4-6 Std vorher zur Hochform fuettern.",
    "tip.5": "Fluessigkeit oben (Hooch)? Einfach abgiessen und normal weiterfuettern.",
  },

  en: {
    "greet.morning": "Good morning",
    "greet.day": "Good afternoon",
    "greet.evening": "Good evening",

    "dash.title": "Starter Workshop",
    "dash.subtitle": "Your living companions",
    "dash.yourStarters": "Your starters",
    "dash.loading": "Loading ...",
    "dash.noStarterTitle": "No starter yet",
    "dash.noStarterText": "Create your first sourdough starter.",
    "dash.createStarter": "Create starter",
    "dash.addNew": "Add new starter",

    "pill.neverFed": "Never fed",
    "pill.urgent": "Feed urgently",
    "pill.hungry": "Hungry",
    "pill.soon": "Feed soon",
    "pill.fridge": "In the fridge",
    "pill.active": "Active & bubbly",

    "card.lastFed": "last fed",
    "card.neverFed": "never fed",
    "card.feed": "Feed",

    "next.label": "Next feeding",
    "next.start": "start now",
    "next.due": "due now",
    "next.inDays": "in {n} days",
    "next.inHours": "in {n} h",

    "tip.title": "Tip of the day",
    "tip.1": "Starter smells slightly of vinegar? Then it is hungry - feed it 1:5:5 and keep it warm.",
    "tip.2": "A warm spot (24-26 C) gives your starter new strength.",
    "tip.3": "Bubbles on the surface are a good sign - your starter is active.",
    "tip.4": "For baking, feed your starter to its peak 4-6 h beforehand.",
    "tip.5": "Liquid on top (hooch)? Just pour it off and keep feeding normally.",
  },

  es: {
    "greet.morning": "Buenos días",
    "greet.day": "Buenas tardes",
    "greet.evening": "Buenas noches",

    "dash.title": "Taller de masa madre",
    "dash.subtitle": "Tus compañeros vivos",
    "dash.yourStarters": "Tus masas madre",
    "dash.loading": "Cargando ...",
    "dash.noStarterTitle": "Aún sin masa madre",
    "dash.noStarterText": "Crea tu primera masa madre.",
    "dash.createStarter": "Crear masa madre",
    "dash.addNew": "Crear nueva masa madre",

    "pill.neverFed": "Nunca alimentada",
    "pill.urgent": "Alimentar urgente",
    "pill.hungry": "Tiene hambre",
    "pill.soon": "Alimentar pronto",
    "pill.fridge": "En la nevera",
    "pill.active": "Activa y burbujeante",

    "card.lastFed": "alimentada",
    "card.neverFed": "nunca alimentada",
    "card.feed": "Alimentar",

    "next.label": "Próxima alimentación",
    "next.start": "empezar ahora",
    "next.due": "toca ahora",
    "next.inDays": "en {n} días",
    "next.inHours": "en {n} h",

    "tip.title": "Consejo del día",
    "tip.1": "¿Tu masa madre huele un poco a vinagre? Tiene hambre - aliméntala 1:5:5 y mantenla caliente.",
    "tip.2": "Un lugar cálido (24-26 C) le da nueva fuerza a tu masa madre.",
    "tip.3": "Las burbujas en la superficie son buena señal - tu masa madre está activa.",
    "tip.4": "Para hornear, alimenta la masa madre a su punto máximo 4-6 h antes.",
    "tip.5": "¿Líquido encima (hooch)? Escúrrelo y sigue alimentando con normalidad.",
  },
};

export function translate(lang, key) {
  const dict = translations[lang] || translations.de;
  return dict[key] || translations.de[key] || key;
}
