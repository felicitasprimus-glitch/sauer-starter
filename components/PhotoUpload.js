"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PhotoUpload({ value, onChange, userId, folder = "feedings" }) {
  const supabase = createClient();
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const [existingUrl, setExistingUrl] = useState(null);

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

  if (value && existingUrl === null && !preview) {
    loadExistingUrl(value);
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

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

      onChange(path);
      setExistingUrl(null);
      setUploading(false);
    } catch (err) {
      setError(err.message || "Upload fehlgeschlagen");
      setPreview(null);
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (value) {
      await supabase.storage.from("photos").remove([value]);
    }
    onChange(null);
    setPreview(null);
    setExistingUrl(null);
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  const showImage = preview || existingUrl;

  return (
    <div>
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
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
              <span className="text-sm font-semibold text-cream-50">Laedt hoch ...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={uploading}
            className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-mauve-500/30 bg-cream-200/30 transition-all hover:border-terra-500/50 hover:bg-cream-200/60 disabled:opacity-50"
          >
            <span className="text-2xl">📸</span>
            <span className="text-xs font-semibold text-cocoa-800">
              {uploading ? "Laedt hoch ..." : "Foto aufnehmen"}
            </span>
            <span className="text-[10px] text-cocoa-700/60">Kamera</span>
          </button>

          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploading}
            className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-mauve-500/30 bg-cream-200/30 transition-all hover:border-terra-500/50 hover:bg-cream-200/60 disabled:opacity-50"
          >
            <span className="text-2xl">🖼️</span>
            <span className="text-xs font-semibold text-cocoa-800">
              {uploading ? "Laedt hoch ..." : "Aus Galerie"}
            </span>
            <span className="text-[10px] text-cocoa-700/60">Vorhandenes Foto</span>
          </button>
        </div>
      )}

      {error && (
        <div className="mt-2 rounded-2xl border border-terra-500/40 bg-terra-500/10 px-3 py-2 text-xs text-terra-700">
          {error}
        </div>
      )}
    </div>
  );
}
