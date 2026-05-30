"use client";

import { useState, useEffect, useCallback } from "react";

interface MediaItem {
  url: string;
  uploadedAt: string;
  size: number;
  name: string;
  surname: string;
  note: string;
}

const gold = "#c9a84c";
const bg = "linear-gradient(160deg, #1a0a00 0%, #2d1200 40%, #1a0a00 100%)";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR");
}

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
  isVideo,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  isVideo: boolean;
}) {
  const item = items[index];
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.94)" }}
      onClick={onClose}
    >
      {/* Media */}
      <div
        className="relative flex items-center justify-center w-full max-w-4xl"
        onClick={(e) => { e.stopPropagation(); setShowArrows((v) => !v); }}
      >
        {isVideo ? (
          <video
            src={item.url}
            controls
            autoPlay
            className="max-w-full max-h-[70vh] rounded-xl"
            style={{ outline: "none" }}
          />
        ) : (
          <img
            src={item.url}
            alt=""
            className="max-w-full max-h-[70vh] rounded-xl object-contain"
          />
        )}

        {/* Prev */}
        {items.length > 1 && showArrows && (
          <button
            className="absolute left-0 -translate-x-1 flex items-center justify-center w-10 h-10 rounded-full text-2xl transition-all"
            style={{ background: "rgba(201,168,76,0.15)", color: "#f5e6c0", border: "1px solid #c9a84c44" }}
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            ‹
          </button>
        )}
        {/* Next */}
        {items.length > 1 && showArrows && (
          <button
            className="absolute right-0 translate-x-1 flex items-center justify-center w-10 h-10 rounded-full text-2xl transition-all"
            style={{ background: "rgba(201,168,76,0.15)", color: "#f5e6c0", border: "1px solid #c9a84c44" }}
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            ›
          </button>
        )}
      </div>

      {/* Meta */}
      <div
        className="mt-4 px-5 py-3 rounded-xl text-sm text-center space-y-1 max-w-sm"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #c9a84c22" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ color: "#f5e6c0" }}>{item.name} {item.surname}</p>
        {item.note && <p style={{ color: "#9e8060" }}>{item.note}</p>}
        <p className="text-xs" style={{ color: "#7a5c3a" }}>{formatDate(item.uploadedAt)}</p>
      </div>

      {/* Counter */}
      <p className="mt-2 text-xs" style={{ color: "#7a5c3a" }}>
        {index + 1} / {items.length}
      </p>

      {/* Close */}
      <button
        className="absolute top-4 right-4 text-3xl leading-none"
        style={{ color: "#f5e6c0" }}
        onClick={onClose}
      >
        ×
      </button>

      {/* Download */}
      <a
        href={item.url}
        download
        className="absolute bottom-4 right-4 px-5 py-2 rounded-full text-sm font-medium"
        style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#1a0a00" }}
        onClick={(e) => e.stopPropagation()}
      >
        İndir
      </a>
    </div>
  );
}

function MediaGrid({ items, isVideo }: { items: MediaItem[]; isVideo: boolean }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => setLightboxIndex((i) => (i === null ? 0 : (i - 1 + items.length) % items.length)), [items.length]);
  const next = useCallback(() => setLightboxIndex((i) => (i === null ? 0 : (i + 1) % items.length)), [items.length]);

  if (items.length === 0) {
    return (
      <p className="text-center py-8 text-sm" style={{ color: "#7a5c3a" }}>
        Henüz {isVideo ? "video" : "fotoğraf"} yüklenmemiş
      </p>
    );
  }

  return (
    <>
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, i) => (
          <div
            key={item.url}
            className="group relative flex-shrink-0 rounded-xl overflow-hidden cursor-pointer"
            style={{
              width: "200px",
              height: "200px",
              border: "1px solid #c9a84c22",
              scrollSnapAlign: "start",
            }}
            onClick={() => setLightboxIndex(i)}
          >
            {isVideo ? (
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-2"
                style={{ background: "#1a0a00" }}
              >
                <span className="text-4xl">🎬</span>
                <span className="text-xs" style={{ color: "#9e8060" }}>
                  {item.name} {item.surname}
                </span>
              </div>
            ) : (
              <img
                src={item.url}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs bg-black/60 rounded px-1 truncate">
                {item.name} {item.surname}
              </p>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          index={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
          isVideo={isVideo}
        />
      )}
    </>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"photos" | "videos">("photos");
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => { setSiteUrl(window.location.origin); }, []);

  async function login() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/photos", { headers: { "x-admin-password": password } });
      if (!res.ok) throw new Error("Şifre hatalı");
      const data = await res.json();
      setPhotos(data.photos);
      setVideos(data.videos);
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
      const res = await fetch("/api/photos", { headers: { "x-admin-password": password } });
      const data = await res.json();
      setPhotos(data.photos);
      setVideos(data.videos);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid #c9a84c44",
    color: "#f5e6c0",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    width: "100%",
    outline: "none",
  };

  if (!authed) {
    return (
      <main className="flex items-center justify-center min-h-screen px-4" style={{ background: bg }}>
        <div className="max-w-sm w-full space-y-6 text-center">
          <h1 className="text-3xl font-light" style={{ color: "#f5e6c0", fontFamily: "Georgia, serif" }}>
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
              style={inputStyle}
            />
            <button
              onClick={login}
              disabled={loading || !password}
              className="w-full py-3 rounded-full font-medium text-sm disabled:opacity-40 transition-all"
              style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#1a0a00", letterSpacing: "0.15em" }}
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
            <h1 className="text-2xl font-light" style={{ color: "#f5e6c0", fontFamily: "Georgia, serif" }}>
              Merve <span style={{ color: gold }}>&</span> Devran
              <span className="text-base ml-2" style={{ color: "#9e8060" }}>— Admin</span>
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#9e8060" }}>
              {photos.length} fotoğraf · {videos.length} video
            </p>
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
          <div className="p-2 rounded-xl" style={{ background: "#fdf8f0" }}>
            <img src={`/api/qr?url=${encodeURIComponent(siteUrl)}`} alt="QR" className="w-28 h-28" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-medium" style={{ color: "#f5e6c0" }}>Misafir Yükleme QR Kodu</p>
            <p className="text-sm break-all" style={{ color: "#9e8060" }}>{siteUrl}</p>
            <p className="text-xs" style={{ color: "#7a5c3a" }}>
              Bu kodu davetlilerle paylaşın. Okutunca yükleme sayfası açılır.
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

        {/* Tabs */}
        <div className="flex gap-2">
          {(["photos", "videos"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={
                tab === t
                  ? { background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#1a0a00" }
                  : { border: "1px solid #c9a84c44", color: "#9e8060" }
              }
            >
              {t === "photos" ? `Fotoğraflar (${photos.length})` : `Videolar (${videos.length})`}
            </button>
          ))}
        </div>

        {/* Grid */}
        {tab === "photos" ? (
          <MediaGrid items={photos} isVideo={false} />
        ) : (
          <MediaGrid items={videos} isVideo={true} />
        )}
      </div>
    </main>
  );
}
