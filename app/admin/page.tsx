"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface MediaItem {
  url: string;
  uploadedAt: string;
  size: number;
  name: string;
  surname: string;
  note: string;
}

const gold = "#c9a84c";
const bg = "linear-gradient(160deg,#1a0a00 0%,#2d1200 40%,#1a0a00 100%)";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR");
}

function Lightbox({
  items, index, onClose, onPrev, onNext, isVideo,
}: {
  items: MediaItem[]; index: number;
  onClose: () => void; onPrev: () => void; onNext: () => void; isVideo: boolean;
}) {
  const item = items[index];
  const [showArrows, setShowArrows] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? onNext() : onPrev();
    touchStartX.current = null;
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.95)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "env(safe-area-inset-top,16px) 16px env(safe-area-inset-bottom,16px)",
      }}
      onClick={onClose}
    >
      {/* Media */}
      <div
        style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 800 }}
        onClick={(e) => { e.stopPropagation(); setShowArrows((v) => !v); }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {isVideo ? (
          <video src={item.url} controls autoPlay
            style={{ maxWidth: "100%", maxHeight: "65dvh", borderRadius: 14, outline: "none" }} />
        ) : (
          <img src={item.url} alt=""
            style={{ maxWidth: "100%", maxHeight: "65dvh", borderRadius: 14, objectFit: "contain" }} />
        )}

        {items.length > 1 && showArrows && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              style={{
                position: "absolute", left: 8,
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)",
                color: "#f5e6c0", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >‹</button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              style={{
                position: "absolute", right: 8,
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)",
                color: "#f5e6c0", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >›</button>
          </>
        )}
      </div>

      {/* Meta */}
      <div
        style={{
          marginTop: 14, padding: "10px 18px", borderRadius: 12,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.15)",
          textAlign: "center", maxWidth: 320, width: "100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ color: "#f5e6c0", fontSize: 14 }}>{item.name} {item.surname}</p>
        {item.note && <p style={{ color: "#9e8060", fontSize: 13, marginTop: 4 }}>{item.note}</p>}
        <p style={{ color: "#7a5c3a", fontSize: 11, marginTop: 4 }}>{formatDate(item.uploadedAt)}</p>
      </div>

      <p style={{ color: "#7a5c3a", fontSize: 11, marginTop: 8 }}>{index + 1} / {items.length}</p>

      {/* Kapat */}
      <button
        style={{
          position: "absolute", top: "max(16px, env(safe-area-inset-top))", right: 16,
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", border: "none",
          color: "#f5e6c0", fontSize: 22, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onClick={onClose}
      >×</button>

      {/* İndir */}
      <a
        href={item.url} download
        style={{
          position: "absolute",
          bottom: "max(16px, env(safe-area-inset-bottom))", right: 16,
          padding: "10px 20px", borderRadius: 50, fontSize: 13, fontWeight: 600,
          background: "linear-gradient(135deg,#c9a84c,#f0d080)", color: "#1a0a00",
          textDecoration: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >İndir</a>
    </div>
  );
}

function MediaGrid({ items, isVideo }: { items: MediaItem[]; isVideo: boolean }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => setLightboxIndex((i) => i === null ? 0 : (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setLightboxIndex((i) => i === null ? 0 : (i + 1) % items.length), [items.length]);

  if (items.length === 0) {
    return <p style={{ color: "#7a5c3a", fontSize: 13, textAlign: "center", padding: "32px 0" }}>
      Henüz {isVideo ? "video" : "fotoğraf"} yüklenmemiş
    </p>;
  }

  const thumbSize = "calc(50vw - 28px)";

  return (
    <>
      <div style={{
        display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8,
        scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
      }}>
        {items.map((item, i) => (
          <div
            key={item.url}
            onClick={() => setLightboxIndex(i)}
            style={{
              flexShrink: 0, width: thumbSize, maxWidth: 180, aspectRatio: "1/1",
              borderRadius: 14, overflow: "hidden", cursor: "pointer",
              border: "1px solid rgba(201,168,76,0.2)", scrollSnapAlign: "start",
              position: "relative",
            }}
          >
            {isVideo ? (
              <div style={{
                width: "100%", height: "100%", background: "#1a0a00",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <span style={{ fontSize: 32 }}>🎬</span>
                <span style={{ color: "#9e8060", fontSize: 11, textAlign: "center", padding: "0 8px" }}>
                  {item.name} {item.surname}
                </span>
              </div>
            ) : (
              <img src={item.url} alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            )}
            {/* isim overlay */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "20px 8px 6px",
              background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)",
            }}>
              <p style={{ color: "#fff", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.name} {item.surname}
              </p>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox items={items} index={lightboxIndex}
          onClose={close} onPrev={prev} onNext={next} isVideo={isVideo} />
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
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/photos", { headers: { "x-admin-password": password } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPhotos(data.photos); setVideos(data.videos); setAuthed(true);
    } catch { setError("Şifre hatalı veya bağlantı sorunu"); }
    finally { setLoading(false); }
  }

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/photos", { headers: { "x-admin-password": password } });
      const data = await res.json();
      setPhotos(data.photos); setVideos(data.videos);
    } finally { setLoading(false); }
  }

  const inp: React.CSSProperties = {
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(201,168,76,0.3)",
    color: "#f5e6c0", borderRadius: 14, padding: "14px 16px",
    width: "100%", outline: "none", fontSize: 16, boxSizing: "border-box",
  };

  if (!authed) {
    return (
      <main style={{
        minHeight: "100dvh", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 20px",
      }}>
        <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16, textAlign: "center" }}>
          <h1 style={{ color: "#f5e6c0", fontSize: 28, fontWeight: 300, fontFamily: "Georgia,serif", margin: 0 }}>
            Merve <span style={{ color: gold }}>&</span> Devran
          </h1>
          <p style={{ color: "#9e8060", fontSize: 13, margin: 0 }}>Admin Paneli</p>
          <input type="password" placeholder="Şifre" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={inp} />
          <button onClick={login} disabled={loading || !password}
            style={{
              padding: "15px", borderRadius: 50, border: "none",
              background: "linear-gradient(135deg,#c9a84c,#f0d080)",
              color: "#1a0a00", fontWeight: 600, fontSize: 14, letterSpacing: "0.12em",
              cursor: loading || !password ? "not-allowed" : "pointer",
              opacity: loading || !password ? 0.5 : 1,
            }}>
            {loading ? "Giriş yapılıyor..." : "GİRİŞ YAP"}
          </button>
          {error && <p style={{ color: "#e07070", fontSize: 13 }}>{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100dvh", background: bg,
      padding: "env(safe-area-inset-top,16px) 16px env(safe-area-inset-bottom,24px)",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", paddingTop: 8 }}>
          <div>
            <h1 style={{ color: "#f5e6c0", fontSize: 20, fontWeight: 300, fontFamily: "Georgia,serif", margin: 0 }}>
              Merve <span style={{ color: gold }}>&</span> Devran
            </h1>
            <p style={{ color: "#9e8060", fontSize: 12, marginTop: 4 }}>
              {photos.length} fotoğraf · {videos.length} video
            </p>
          </div>
          <button onClick={refresh} disabled={loading}
            style={{
              padding: "8px 16px", borderRadius: 50,
              border: "1px solid rgba(201,168,76,0.3)", background: "transparent",
              color: gold, fontSize: 13, cursor: "pointer",
            }}>
            {loading ? "..." : "Yenile"}
          </button>
        </div>

        {/* QR */}
        <div style={{
          borderRadius: 18, padding: 16,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.15)",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{ background: "#fdf8f0", borderRadius: 10, padding: 8, flexShrink: 0 }}>
            <img src={`/api/qr?url=${encodeURIComponent(siteUrl)}`} alt="QR" style={{ width: 88, height: 88, display: "block" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: "#f5e6c0", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Misafir Yükleme QR</p>
            <p style={{ color: "#9e8060", fontSize: 11, wordBreak: "break-all", marginBottom: 6 }}>{siteUrl}</p>
            <a href={`/api/qr?url=${encodeURIComponent(siteUrl)}`} download="qr-kod.svg"
              style={{ color: gold, fontSize: 12, textDecoration: "none" }}>
              ↓ SVG indir
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {(["photos", "videos"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                flex: 1, padding: "11px 8px", borderRadius: 50,
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                background: tab === t
                  ? "linear-gradient(135deg,#c9a84c,#f0d080)"
                  : "rgba(255,255,255,0.05)",
                color: tab === t ? "#1a0a00" : "#9e8060",
                border: tab === t ? "none" : "1px solid rgba(201,168,76,0.2)",
              } as React.CSSProperties}>
              {t === "photos" ? `📷 Fotoğraflar (${photos.length})` : `🎬 Videolar (${videos.length})`}
            </button>
          ))}
        </div>

        {/* Grid */}
        {tab === "photos" ? <MediaGrid items={photos} isVideo={false} /> : <MediaGrid items={videos} isVideo={true} />}
      </div>
    </main>
  );
}
