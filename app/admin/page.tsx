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

  const bg = "linear-gradient(160deg, #1a0a00 0%, #2d1200 40%, #1a0a00 100%)";
  const gold = "#c9a84c";

  if (!authed) {
    return (
      <main
        className="flex items-center justify-center min-h-screen px-4"
        style={{ background: bg }}
      >
        <div className="max-w-sm w-full space-y-6 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto"
            style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", boxShadow: "0 0 24px rgba(201,168,76,0.3)" }}
          >
            💍
          </div>
          <h1
            className="text-3xl font-light"
            style={{ color: "#f5e6c0", fontFamily: "Georgia, serif" }}
          >
            Merve <span style={{ color: gold }}>&</span> Devran
          </h1>
          <p className="text-sm" style={{ color: "#9e8060" }}>Admin Paneli</p>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid #c9a84c44",
                color: "#f5e6c0",
              }}
            />
            <button
              onClick={login}
              disabled={loading || !password}
              className="w-full py-3 rounded-full font-medium tracking-widest text-sm disabled:opacity-40 transition-all"
              style={{
                background: "linear-gradient(135deg, #c9a84c 0%, #f0d080 50%, #c9a84c 100%)",
                color: "#1a0a00",
                letterSpacing: "0.15em",
              }}
            >
              {loading ? "Giriş yapılıyor..." : "GİRİŞ YAP"}
            </button>
          </div>
          {error && <p className="text-sm" style={{ color: "#e07070" }}>{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-light"
              style={{ color: "#f5e6c0", fontFamily: "Georgia, serif" }}
            >
              Merve <span style={{ color: gold }}>&</span> Devran
              <span className="text-base ml-2" style={{ color: "#9e8060" }}>— Admin</span>
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#9e8060" }}>{photos.length} fotoğraf</p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="px-4 py-2 rounded-full text-sm transition-all"
            style={{ border: "1px solid #c9a84c44", color: gold }}
          >
            {loading ? "..." : "Yenile"}
          </button>
        </div>

        {/* QR */}
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #c9a84c22" }}
        >
          <div
            className="p-2 rounded-xl"
            style={{ background: "#fdf8f0" }}
          >
            <img
              src={`/api/qr?url=${encodeURIComponent(siteUrl)}`}
              alt="QR Kod"
              className="w-28 h-28"
            />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-medium" style={{ color: "#f5e6c0" }}>Misafir Yükleme QR Kodu</p>
            <p className="text-sm break-all" style={{ color: "#9e8060" }}>{siteUrl}</p>
            <p className="text-xs" style={{ color: "#7a5c3a" }}>
              Bu kodu davetlilerle paylaşın. Okutunca fotoğraf yükleme sayfası açılır.
            </p>
            <a
              href={`/api/qr?url=${encodeURIComponent(siteUrl)}`}
              download="qr-kod.svg"
              className="inline-block mt-1 text-sm hover:underline"
              style={{ color: gold }}
            >
              QR kodu indir (SVG)
            </a>
          </div>
        </div>

        {/* Grid */}
        {photos.length === 0 ? (
          <div className="text-center py-16" style={{ color: "#7a5c3a" }}>
            Henüz fotoğraf yüklenmemiş
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.url}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                style={{ border: "1px solid #c9a84c22" }}
                onClick={() => setSelected(photo.url)}
              >
                <img
                  src={photo.url}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs bg-black/60 rounded px-1">
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
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setSelected(null)}
        >
          <img
            src={selected}
            alt=""
            className="max-w-full max-h-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-3xl leading-none transition-colors"
            style={{ color: "#f5e6c0" }}
            onClick={() => setSelected(null)}
          >
            ×
          </button>
          <a
            href={selected}
            download
            className="absolute bottom-4 right-4 px-5 py-2 rounded-full text-sm font-medium"
            style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#1a0a00" }}
            onClick={(e) => e.stopPropagation()}
          >
            İndir
          </a>
        </div>
      )}
    </main>
  );
}
