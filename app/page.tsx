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
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-1">
          <p className="text-sm tracking-[0.3em] uppercase text-amber-700">
            Nişan Hatırası
          </p>
          <h1 className="text-4xl font-light text-stone-800">
            Devran <span className="text-amber-600">&</span> Merve
          </h1>
          <p className="text-stone-500 text-sm mt-2">
            Bu güzel anı fotoğraflarınızı bizimle paylaşın
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-amber-200" />
          <span className="text-amber-400 text-lg">✦</span>
          <div className="flex-1 h-px bg-amber-200" />
        </div>

        <div
          className="border-2 border-dashed border-amber-200 rounded-2xl p-8 cursor-pointer hover:border-amber-400 transition-colors bg-white/60"
          onClick={() => inputRef.current?.click()}
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
              <p className="text-2xl">🖼️</p>
              <p className="text-stone-700 font-medium">
                {files.length} fotoğraf seçildi
              </p>
              <p className="text-stone-400 text-sm">Değiştirmek için tıklayın</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-4xl">📷</p>
              <p className="text-stone-600">Fotoğraf seçmek için tıklayın</p>
              <p className="text-stone-400 text-xs">
                JPG, PNG, HEIC desteklenir • Birden fazla seçebilirsiniz
              </p>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {files.slice(0, 6).map((f, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100"
              >
                <img
                  src={URL.createObjectURL(f)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {files.length > 6 && (
              <div className="w-16 h-16 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 text-sm">
                +{files.length - 6}
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!files.length || uploading}
          className="w-full py-3 px-6 rounded-full bg-amber-600 text-white font-medium tracking-wide hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? "Yükleniyor..." : "Paylaş"}
        </button>

        {done && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            ✓ Fotoğraflarınız başarıyla yüklendi, teşekkürler! 🎉
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <p className="text-stone-300 text-xs">Devran & Merve • 2025</p>
      </div>
    </main>
  );
}
