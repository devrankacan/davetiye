"use client";

import { useState, useRef } from "react";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setDone(false);
      setError("");
    }
  }

  async function handleUpload() {
    if (!files.length) return;
    setUploading(true);
    setError("");

    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Yükleme başarısız");
        }
      }
      setDone(true);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen px-4 py-12"
      style={{ background: "linear-gradient(160deg, #1a0a00 0%, #2d1200 40%, #1a0a00 100%)" }}
    >
      <div className="max-w-md w-full text-center space-y-7">

        {/* Monogram / ornament */}
        <div className="flex justify-center mb-2">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
            style={{
              background: "linear-gradient(135deg, #c9a84c 0%, #f0d080 50%, #c9a84c 100%)",
              boxShadow: "0 0 32px rgba(201,168,76,0.35)",
            }}
          >
            💍
          </div>
        </div>

        {/* Başlık */}
        <div className="space-y-2">
          <p
            className="text-xs tracking-[0.45em] uppercase"
            style={{ color: "#c9a84c" }}
          >
            Nişan Hatırası
          </p>
          <h1
            className="text-5xl font-light"
            style={{
              color: "#f5e6c0",
              textShadow: "0 2px 18px rgba(201,168,76,0.25)",
              fontFamily: "Georgia, serif",
              letterSpacing: "0.04em",
            }}
          >
            Merve <span style={{ color: "#c9a84c" }}>&</span> Devran
          </h1>
          <p className="text-sm mt-1" style={{ color: "#9e8060" }}>
            Bu güzel anı fotoğraflarınızı bizimle paylaşın
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 px-4">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #c9a84c55)" }} />
          <span style={{ color: "#c9a84c" }} className="text-base">✦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #c9a84c55)" }} />
        </div>

        {/* Upload area */}
        <div
          className="rounded-2xl p-8 cursor-pointer transition-all duration-300"
          style={{
            border: "1.5px dashed #c9a84c55",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => inputRef.current?.click()}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#c9a84c")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#c9a84c55")}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleSelect}
          />
          {files.length > 0 ? (
            <div className="space-y-2">
              <p className="text-3xl">🖼️</p>
              <p className="font-medium" style={{ color: "#f5e6c0" }}>
                {files.length} fotoğraf seçildi
              </p>
              <p className="text-sm" style={{ color: "#9e8060" }}>Değiştirmek için tıklayın</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-5xl">📷</p>
              <p style={{ color: "#d4b87a" }}>Fotoğraf seçmek için tıklayın</p>
              <p className="text-xs" style={{ color: "#7a5c3a" }}>
                JPG, PNG, HEIC desteklenir • Birden fazla seçebilirsiniz
              </p>
            </div>
          )}
        </div>

        {/* Previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {files.slice(0, 6).map((f, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-lg overflow-hidden"
                style={{ border: "1px solid #c9a84c44" }}
              >
                <img
                  src={URL.createObjectURL(f)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {files.length > 6 && (
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-sm"
                style={{ background: "#2d1a00", color: "#c9a84c" }}
              >
                +{files.length - 6}
              </div>
            )}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleUpload}
          disabled={!files.length || uploading}
          className="w-full py-3 px-6 rounded-full font-medium tracking-widest text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #c9a84c 0%, #f0d080 50%, #c9a84c 100%)",
            color: "#1a0a00",
            boxShadow: files.length && !uploading ? "0 4px 24px rgba(201,168,76,0.4)" : "none",
            letterSpacing: "0.15em",
          }}
        >
          {uploading ? "Yükleniyor..." : "PAYLAŞ"}
        </button>

        {done && (
          <div
            className="p-4 rounded-xl text-sm"
            style={{ background: "rgba(201,168,76,0.1)", border: "1px solid #c9a84c44", color: "#c9a84c" }}
          >
            ✓ Fotoğraflarınız başarıyla yüklendi, teşekkürler!
          </div>
        )}
        {error && (
          <div
            className="p-4 rounded-xl text-sm"
            style={{ background: "rgba(180,60,60,0.1)", border: "1px solid #b43c3c44", color: "#e07070" }}
          >
            {error}
          </div>
        )}

        <p className="text-xs" style={{ color: "#4a3520" }}>
          Merve & Devran • 10/2026
        </p>
      </div>
    </main>
  );
}
