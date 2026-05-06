// lib/photos.js
// Hilfsfunktionen rund um Foto-Pfade im Storage

import { createClient } from "@/lib/supabase/server";

// Holt eine signierte URL für ein einzelnes Foto (1 Stunde gültig)
export async function getSignedPhotoUrl(path) {
  if (!path) return null;
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("photos")
    .createSignedUrl(path, 3600);
  if (error) return null;
  return data?.signedUrl ?? null;
}

// Holt mehrere URLs auf einmal — gibt eine Map { path: url } zurück
export async function getSignedPhotoUrls(paths) {
  const cleanPaths = paths.filter(Boolean);
  if (cleanPaths.length === 0) return {};
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("photos")
    .createSignedUrls(cleanPaths, 3600);
  if (error) return {};
  const map = {};
  data.forEach((entry) => {
    if (entry.path && entry.signedUrl) {
      map[entry.path] = entry.signedUrl;
    }
  });
  return map;
}
