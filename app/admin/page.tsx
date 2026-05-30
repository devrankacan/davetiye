"use client";

import { useState, useEffect } from "react";

interface Photo {
  url: string;
  uploadedAt: string;
  size: number;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    setSiteUrl(window.location.origin);
  }, []);

  async function login() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/photos", {
        headers: { "x-admin-password": password },
      });
      if (!res.ok) throw new Error("Şifre hatalı");
      const data = await res.json();
      setPhotos(data.photos);
      setAuthed(true);
    } catch {
      setError("Şifre hatalı veya bağlantı sorunu");
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/photos", {
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      setPhotos(data.photos);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("tr-TR");
  }

  function formatSize(bytes: number) {
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  }

  if (!authed) {
    return (
      <main className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-sm w-full space-y-6 text-center">
          <h1 className="text-3xl font-light text-stone-800">
            Devran <span className="text-amber-600">&</span> Merve
          </h1>
          <p className="text-stone-500 text-sm">Admin Paneli</p>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-white focus:outline-none focus:border-amber-400 text-stone-700"
            />
            <button
              onClick={login}
              disabled={loading || !password}
              className="w-full py-3 rounded-full bg-amber-600 text-white font-medium hover:bg-amber-700 disabled:opacity-40 transition-colors"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-stone-800">
              Devran <span className="text-amber-600">&</span> Merve — Admin
            </h1>
            <p className="text-stone-500 text-sm">{photos.length} fotoğraf</p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="px-4 py-2 rounded-full border border-amber-200 text-amber-700 text-sm hover:bg-amber-50 transition-colors"
          >
            {loading ? "..." : "Yenile"}
          </button>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-6 border border-amber-100 flex flex-col sm:flex-row items-center gap-6">
          <img
            src={`/api/qr?url=${encodeURIComponent(siteUrl)}`}
            alt="QR Kod"
            className="w-32 h-32"
          />
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-medium text-stone-700">Misafir Yükleme QR Kodu</p>
            <p className="text-stone-500 text-sm break-all">{siteUrl}</p>
            <p className="text-stone-400 text-xs">
              Bu kodu davetlilerle paylaşın. Okutunca fotoğraf yükleme sayfası açılır.
            </p>
            <a
              href={`/api/qr?url=${encodeURIComponent(siteUrl)}`}
              download="qr-kod.svg"
              className="inline-block mt-2 text-amber-600 text-sm hover:underline"
            >
              QR kodu indir (SVG)
            </a>
          </div>
        </div>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            Henüz fotoğraf yüklenmemiş
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.url}
                className="group relative aspect-square rounded-xl overflow-hidden bg-stone-100 cursor-pointer"
                onClick={() => setSelected(photo.url)}
              >
                <img
                  src={photo.url}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs bg-black/50 rounded px-1">
                    {formatDate(photo.uploadedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <img
            src={selected}
            alt=""
            className="max-w-full max-h-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-amber-300"
            onClick={() => setSelected(null)}
          >
            ×
          </button>
          <a
            href={selected}
            download
            className="absolute bottom-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-full text-sm hover:bg-amber-700"
            onClick={(e) => e.stopPropagation()}
          >
            İndir
          </a>
        </div>
      )}
    </main>
  );
}
