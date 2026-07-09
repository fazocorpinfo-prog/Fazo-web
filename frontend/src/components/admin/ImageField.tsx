"use client";

import { useRef, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";

type ImageRef = { mediaId: string | null; legacySrc?: string | null; alt?: { uz: string; ru?: string; en?: string } };

function url(img: ImageRef | undefined): string | null {
  if (!img) return null;
  if (img.mediaId) return `/api/media/${img.mediaId}`;
  return img.legacySrc || null;
}

export function ImageField({
  value,
  onChange,
  label = "Rasm",
}: {
  value: ImageRef | undefined;
  onChange: (img: ImageRef) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const preview = url(value);

  const upload = async (file: File) => {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("project", "fazo");
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok && d.id) {
        onChange({ ...(value || {}), mediaId: d.id });
      } else {
        setErr(d.error || "Yuklab bo'lmadi");
      }
    } catch {
      setErr("Yuklashda xatolik");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-1.5 text-xs text-[#A0AEC0]">{label}</div>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[rgba(0,194,255,0.15)] bg-white/5">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-[#A0AEC0]/40" />
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(0,194,255,0.2)] px-3 py-1.5 text-xs text-white hover:bg-white/5 disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" /> {busy ? "Yuklanmoqda..." : "Rasm yuklash"}
          </button>
          {err ? <div className="mt-1 text-xs text-red-400">{err}</div> : null}
          {value?.mediaId ? <div className="mt-1 text-xs text-[#00C2FF]">yuklandi ✓</div> : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
