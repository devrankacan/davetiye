"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface MediaItem {
  url: string; uploadedAt: string; size: number;
  name: string; surname: string; note: string;
}

const C = {
  cream: "#f8f3eb", creamDark: "#ede5d5",
  green: "#2d4a2d", greenMid: "#4a6b4a", greenLight: "#7a9b7a",
  gold: "#b8953a", goldLight: "#d4aa50",
};

function formatDate(iso: string) { return new Date(iso).toLocaleString("tr-TR"); }

function Lightbox({ items, index, onClose, onPrev, onNext, isVideo }: {
  items: MediaItem[]; index: number;
  onClose: () => void; onPrev: () => void; onNext: () => void; isVideo: boolean;
}) {
  const item = items[index];
  const [showArrows, setShowArrows] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(20,32,20,0.96)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "env(safe-area-inset-top,16px) 16px env(safe-area-inset-bottom,16px)",
      }}
      onClick={onClose}
    >
      <div
        style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 800 }}
        onClick={(e) => { e.stopPropagation(); setShowArrows((v) => !v); }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) diff > 0 ? onNext() : onPrev();
          touchStartX.current = null;
        }}
      >
        {isVideo ? (
          <video src={item.url} controls autoPlay
            style={{ maxWidth: "100%", maxHeight: "65dvh", borderRadius: 12, outline: "none" }} />
        ) : (
          <img src={item.url} alt=""
            style={{ maxWidth: "100%", maxHeight: "65dvh", borderRadius: 12, objectFit: "contain" }} />
        )}

        {items.length > 1 && showArrows && (
          <>
            <button onClick={(e) => { e.stopPropagation(); onPrev(); }} style={{
              position: "absolute", left: 8,
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(184,149,58,0.2)", border: "1px solid rgba(184,149,58,0.4)",
              color: "#f8f3eb", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>‹</button>
            <button onClick={(e) => { e.stopPropagation(); onNext(); }} style={{
              position: "absolute", right: 8,
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(184,149,58,0.2)", border: "1px solid rgba(184,149,58,0.4)",
              color: "#f8f3eb", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>›</button>
          </>
        )}
      </div>

      <div style={{
        marginTop: 14, padding: "10px 18px", borderRadius: 10,
        background: "rgba(248,243,235,0.08)", border: "1px solid rgba(184,149,58,0.2)",
        textAlign: "center", maxWidth: 320, width: "100%",
      }} onClick={(e) => e.stopPropagation()}>
        <p style={{ color: "#f8f3eb", fontSize: 15, fontFamily: "var(--font-cormorant), Georgia, serif" }}>
          {item.name} {item.surname}
        </p>
        {item.note && <p style={{ color: "#9e8060", fontSize: 13, marginTop: 4, fontStyle: "italic" }}>{item.note}</p>}
        <p style={{ color: "#7a5c3a", fontSize: 11, marginTop: 4 }}>{formatDate(item.uploadedAt)}</p>
      </div>

      <p style={{ color: "#7a5c3a", fontSize: 11, marginTop: 8 }}>{index + 1} / {items.length}</p>

      <button style={{
        position: "absolute", top: "max(16px,env(safe-area-inset-top))", right: 16,
        width: 44, height: 44, borderRadius: "50%",
        background: "rgba(248,243,235,0.1)", border: "none",
        color: "#f8f3eb", fontSize: 22, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }} onClick={onClose}>×</button>

      <a href={item.url} download style={{
        position: "absolute", bottom: "max(16px,env(safe-area-inset-bottom))", right: 16,
        padding: "10px 20px", borderRadius: 50, fontSize: 13, fontWeight: 600,
        background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: "#fff", textDecoration: "none",
      }} onClick={(e) => e.stopPropagation()}>İndir</a>
    </div>
  );
}

function MediaGrid({ items, isVideo }: { items: MediaItem[]; isVideo: boolean }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => setLightboxIndex((i) => i === null ? 0 : (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setLightboxIndex((i) => i === null ? 0 : (i + 1) % items.length), [items.length]);

  if (items.length === 0) return (
    <p style={{ color: C.greenLight, fontSize: 14, textAlign: "center", padding: "32px 0", fontStyle: "italic" }}>
      Henüz {isVideo ? "video" : "fotoğraf"} yüklenmemiş
    </p>
  );

  const thumbSize = "calc(50vw - 28px)";

  return (
    <>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollSnapType: "x mandatory" }}>
        {items.map((item, i) => (
          <div key={item.url} onClick={() => setLightboxIndex(i)} style={{
            flexShrink: 0, width: thumbSize, maxWidth: 180, aspectRatio: "1/1",
            borderRadius: 10, overflow: "hidden", cursor: "pointer",
            border: `1px solid ${C.creamDark}`, scrollSnapAlign: "start", position: "relative",
          }}>
            {isVideo ? (
              <div style={{
                width: "100%", height: "100%", background: C.cream,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <span style={{ fontSize: 28 }}>🎬</span>
                <span style={{ color: C.greenLight, fontSize: 11, textAlign: "center", padding: "0 8px" }}>
                  {item.name} {item.surname}
                </span>
              </div>
            ) : (
              <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            )}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "20px 8px 6px",
              background: "linear-gradient(to top,rgba(45,74,45,0.7),transparent)",
            }}>
              <p style={{ color: "#fff", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.name} {item.surname}
              </p>
            </div>
          </div>
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox items={items} index={lightboxIndex} onClose={close} onPrev={prev} onNext={next} isVideo={isVideo} />
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
    background: "#fff", border: `1px solid ${C.creamDark}`,
    borderRadius: 10, padding: "13px 14px", width: "100%",
    outline: "none", fontSize: 16, color: C.green,
    fontFamily: "var(--font-cormorant), Georgia, serif",
    boxSizing: "border-box",
  };

  if (!authed) {
    return (
      <main style={{
        minHeight: "100dvh", background: `url('/bg.png') center center / cover no-repeat`,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px",
      }}>
        <div style={{
          width: "100%", maxWidth: 360, background: "#fff",
          border: `1px solid ${C.creamDark}`, borderRadius: 4,
          padding: "36px 28px", boxShadow: "0 2px 24px rgba(45,74,45,0.07)",
          display: "flex", flexDirection: "column", gap: 16, textAlign: "center",
        }}>
          <p style={{ color: C.greenMid, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", margin: 0 }}>
            Admin Paneli
          </p>
          <div style={{ fontFamily: "var(--font-script), cursive", color: C.green, fontSize: 44, lineHeight: 1.1 }}>
            Merve
          </div>
          <div style={{ color: C.gold, fontSize: 22, lineHeight: 1, marginTop: -8 }}>&</div>
          <div style={{ fontFamily: "var(--font-script), cursive", color: C.green, fontSize: 44, lineHeight: 1.1, marginTop: -8, marginBottom: 4 }}>
            Devran
          </div>
          <div style={{ height: 1, background: C.creamDark }} />
          <input type="password" placeholder="Şifre" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()} style={inp} />
          <button type="button" onClick={login} disabled={loading || !password} style={{
            padding: "14px", borderRadius: 50, border: "none",
            background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
            color: "#fff", fontWeight: 600, fontSize: 13, letterSpacing: "0.15em",
            cursor: loading || !password ? "not-allowed" : "pointer",
            opacity: loading || !password ? 0.5 : 1,
            fontFamily: "var(--font-cormorant), Georgia, serif",
          }}>
            {loading ? "Giriş yapılıyor..." : "GİRİŞ YAP"}
          </button>
          {error && <p style={{ color: "#b43c3c", fontSize: 13 }}>{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100dvh", background: `url('/bg.png') center center / cover no-repeat`,
      padding: "env(safe-area-inset-top,16px) 16px env(safe-area-inset-bottom,24px)",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", paddingTop: 12 }}>
          <div>
            <h1 style={{
              color: C.green, fontSize: 22, fontWeight: 400, margin: 0,
              fontFamily: "var(--font-cormorant), Georgia, serif",
            }}>
              Merve <span style={{ color: C.gold }}>&</span> Devran
            </h1>
            <p style={{ color: C.greenLight, fontSize: 12, marginTop: 4 }}>
              {photos.length} fotoğraf · {videos.length} video
            </p>
          </div>
          <button onClick={refresh} disabled={loading} style={{
            padding: "8px 16px", borderRadius: 50,
            border: `1px solid ${C.creamDark}`, background: "#fff",
            color: C.greenMid, fontSize: 13, cursor: "pointer",
            fontFamily: "var(--font-cormorant), Georgia, serif",
          }}>
            {loading ? "..." : "Yenile"}
          </button>
        </div>

        {/* QR */}
        <div style={{
          borderRadius: 10, padding: 16, background: "#fff",
          border: `1px solid ${C.creamDark}`,
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{ background: C.cream, borderRadius: 8, padding: 6, flexShrink: 0 }}>
            <img src={`/api/qr?url=${encodeURIComponent(siteUrl)}`} alt="QR"
              style={{ width: 80, height: 80, display: "block" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: C.green, fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Misafir Yükleme QR</p>
            <p style={{ color: C.greenLight, fontSize: 11, wordBreak: "break-all", marginBottom: 6 }}>{siteUrl}</p>
            <a href={`/api/qr?url=${encodeURIComponent(siteUrl)}`} download="qr-kod.svg"
              style={{ color: C.gold, fontSize: 12, textDecoration: "none" }}>↓ SVG indir</a>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {(["photos", "videos"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "11px 8px", borderRadius: 50, fontSize: 13, fontWeight: 500, cursor: "pointer",
              fontFamily: "var(--font-cormorant), Georgia, serif", letterSpacing: "0.05em",
              background: tab === t ? `linear-gradient(135deg,${C.gold},${C.goldLight})` : "#fff",
              color: tab === t ? "#fff" : C.greenMid,
              border: tab === t ? "none" : `1px solid ${C.creamDark}`,
            } as React.CSSProperties}>
              {t === "photos" ? `Fotoğraflar (${photos.length})` : `Videolar (${videos.length})`}
            </button>
          ))}
        </div>

        {/* Grid */}
        {tab === "photos" ? <MediaGrid items={photos} isVideo={false} /> : <MediaGrid items={videos} isVideo={true} />}
      </div>
    </main>
  );
}
