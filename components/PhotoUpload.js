"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PhotoUpload({ value, onChange, userId, folder = "feedings" }) {
  const supabase = createClient();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  // Hole Public-URL für bereits vorhandenes Foto
  const [existingUrl, setExistingUrl] = useState(null);

  // Wenn `value` ein Storage-Pfad ist, signierte URL holen
  async function loadExistingUrl(path) {
    if (!path) {
      setExistingUrl(null);
      return;
    }
    const { data } = await supabase.storage
      .from("photos")
      .createSignedUrl(path, 3600);
    setExistingUrl(data?.signedUrl ?? null);
  }

  // Wenn value sich ändert (oder erstmals gesetzt wird), URL holen
  if (value && existingUrl === null && !preview) {
    loadExistingUrl(value);
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    // Lokale Preview sofort anzeigen
    setPreview(URL.createObjectURL(file));

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/${folder}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError(uploadError.message);
        setPreview(null);
        setUploading(false);
        return;
      }

      // Pfad nach oben geben
      onChange(path);
      setExistingUrl(null); // wird neu geladen
      setUploading(false);
    } catch (err) {
      setError(err.message || "Upload fehlgeschlagen");
      setPreview(null);
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (value) {
      // Foto aus Storage löschen
      await supabase.storage.from("photos").remove([value]);
    }
    onChange(null);
    setPreview(null);
    setExistingUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const showImage = preview || existingUrl;

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {showImage ? (
        <div className="relative">
          <img
            src={showImage}
            alt="Foto"
            className="h-48 w-full rounded-2xl object-cover shadow-soft"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-cream-50/95 text-cocoa-800 shadow-soft hover:bg-terra-500/90 hover:text-cream-50"
            aria-label="Foto entfernen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6 L 18 18 M 18 6 L 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-cocoa-900/50">
              <span className="text-sm font-semibold text-cream-50">
                Lädt hoch …
              </span>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-mauve-500/30 bg-cream-200/30 transition-all hover:border-terra-500/50 hover:bg-cream-200/60 disabled:opacity-50"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-terra-600">
            <path
              d="M3 7 Q 3 5, 5 5 L 8 5 L 9.5 3 L 14.5 3 L 16 5 L 19 5 Q 21 5, 21 7 L 21 17 Q 21 19, 19 19 L 5 19 Q 3 19, 3 17 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
          <span className="text-sm font-semibold text-cocoa-800">
            {uploading ? "Lädt hoch …" : "Foto hinzufügen"}
          </span>
          <span className="text-xs text-cocoa-700/60">
            Kamera oder Galerie
          </span>
        </button>
      )}

      {error && (
        <div className="mt-2 rounded-2xl border border-terra-500/40 bg-terra-500/10 px-3 py-2 text-xs text-terra-700">
          {error}
        </div>
      )}
    </div>
  );
}
