"use client";

import { useState, useRef } from "react";

const C = {
  cream: "#f8f3eb",
  creamDark: "#ede5d5",
  green: "#2d4a2d",
  greenMid: "#4a6b4a",
  greenLight: "#7a9b7a",
  gold: "#b8953a",
  goldLight: "#d4aa50",
};

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [note, setNote] = useState("");
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
    if (!name.trim() || !surname.trim()) { setError("Ad ve soyad alanları zorunludur"); return; }
    setUploading(true); setError("");
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        form.append("name", name.trim());
        form.append("surname", surname.trim());
        form.append("note", note.trim());
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Yükleme başarısız"); }
      }
      setDone(true); setFiles([]); setNote("");
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally { setUploading(false); }
  }

  const inp: React.CSSProperties = {
    background: "#fff",
    border: `1px solid ${C.creamDark}`,
    borderRadius: 10,
    padding: "12px 14px",
    width: "100%",
    outline: "none",
    fontSize: 16,
    color: C.green,
    fontFamily: "var(--font-cormorant), Georgia, serif",
  };

  return (
    <main style={{
      minHeight: "100dvh",
      background: `url('/bg.png') center center / cover no-repeat`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "env(safe-area-inset-top,24px) 20px env(safe-area-inset-bottom,24px)",
    }}>
      <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 0 }}>

        {/* Çerçeve kartı */}
        <div style={{
          background: "rgba(255,255,255,0.72)",
          border: `1px solid rgba(184,149,58,0.25)`,
          borderRadius: 4,
          padding: "32px 28px 28px",
          boxShadow: "0 4px 32px rgba(45,74,45,0.10)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>

          {/* Başlık */}
          <div style={{ textAlign: "center" }}>
            {/* Üst ornament çizgisi */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: C.gold, opacity: 0.4 }} />
              <span style={{ color: C.gold, fontSize: 14, opacity: 0.7 }}>✦</span>
              <div style={{ flex: 1, height: 1, background: C.gold, opacity: 0.4 }} />
            </div>

            <p style={{
              color: C.greenMid, fontSize: 10, letterSpacing: "0.4em",
              textTransform: "uppercase", margin: "0 0 6px",
              fontFamily: "var(--font-cormorant), Georgia, serif",
            }}>
              Nişan Daveti
            </p>

            {/* Script isimler */}
            <div style={{
              fontFamily: "var(--font-script), cursive",
              color: C.green,
              fontSize: "clamp(42px,11vw,62px)",
              lineHeight: 1.1,
              margin: "4px 0",
            }}>
              Merve
            </div>
            <div style={{ color: C.gold, fontSize: 28, lineHeight: 1, margin: "2px 0" }}>&</div>
            <div style={{
              fontFamily: "var(--font-script), cursive",
              color: C.green,
              fontSize: "clamp(42px,11vw,62px)",
              lineHeight: 1.1,
              margin: "2px 0 10px",
            }}>
              Devran
            </div>

            {/* Alt ornament */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
              <div style={{ flex: 1, height: 1, background: C.gold, opacity: 0.4 }} />
              <span style={{ color: C.gold, fontSize: 14, opacity: 0.7 }}>✦</span>
              <div style={{ flex: 1, height: 1, background: C.gold, opacity: 0.4 }} />
            </div>

            <p style={{ color: C.greenLight, fontSize: 14, margin: "12px 0 0", fontStyle: "italic" }}>
              Bu güzel anı bizimle paylaşın
            </p>
          </div>

          {/* Ad / Soyad */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ display: "block", color: C.greenMid, fontSize: 12, marginBottom: 5, letterSpacing: "0.05em" }}>
                Ad <span style={{ color: C.gold }}>*</span>
              </label>
              <input type="text" placeholder="Adınız" value={name}
                onChange={(e) => setName(e.target.value)} autoComplete="given-name" style={inp} />
            </div>
            <div>
              <label style={{ display: "block", color: C.greenMid, fontSize: 12, marginBottom: 5, letterSpacing: "0.05em" }}>
                Soyad <span style={{ color: C.gold }}>*</span>
              </label>
              <input type="text" placeholder="Soyadınız" value={surname}
                onChange={(e) => setSurname(e.target.value)} autoComplete="family-name" style={inp} />
            </div>
          </div>

          {/* Not */}
          <div>
            <label style={{ display: "block", color: C.greenMid, fontSize: 12, marginBottom: 5, letterSpacing: "0.05em" }}>
              Not <span style={{ color: C.greenLight, fontSize: 11 }}>(isteğe bağlı)</span>
            </label>
            <textarea placeholder="Bir mesaj bırakmak ister misiniz?" value={note}
              onChange={(e) => setNote(e.target.value)} rows={2}
              style={{ ...inp, resize: "none", lineHeight: 1.5 }} />
          </div>

          {/* Upload alanı */}
          <div
            onClick={() => inputRef.current?.click()}
            style={{
              border: `1.5px dashed ${C.creamDark}`,
              borderRadius: 10,
              padding: "22px 16px",
              textAlign: "center",
              cursor: "pointer",
              background: C.cream,
              transition: "border-color 0.2s",
              WebkitTapHighlightColor: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.gold)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.creamDark)}
          >
            <input ref={inputRef} type="file" accept="image/*,video/*" multiple
              style={{ display: "none" }} onChange={handleSelect} />
            {files.length > 0 ? (
              <>
                <div style={{ fontSize: 28, marginBottom: 6 }}>
                  {files.some((f) => f.type.startsWith("video/")) ? "🎬" : "🖼️"}
                </div>
                <p style={{ color: C.green, fontSize: 15, fontWeight: 500 }}>{files.length} dosya seçildi</p>
                <p style={{ color: C.greenLight, fontSize: 13, marginTop: 3 }}>Değiştirmek için tekrar tıklayın</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 34, marginBottom: 8 }}>📷</div>
                <p style={{ color: C.greenMid, fontSize: 15 }}>Fotoğraf veya video seçin</p>
                <p style={{ color: C.greenLight, fontSize: 11, marginTop: 5 }}>JPG · PNG · HEIC · MP4 · MOV</p>
              </>
            )}
          </div>

          {/* Önizleme */}
          {files.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {files.slice(0, 6).map((f, i) => (
                <div key={i} style={{
                  width: 56, height: 56, borderRadius: 8, overflow: "hidden",
                  border: `1px solid ${C.creamDark}`, background: C.cream,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {f.type.startsWith("image/") ? (
                    <img src={URL.createObjectURL(f)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : <span style={{ fontSize: 22 }}>🎬</span>}
                </div>
              ))}
              {files.length > 6 && (
                <div style={{
                  width: 56, height: 56, borderRadius: 8, background: C.cream,
                  border: `1px solid ${C.creamDark}`, display: "flex",
                  alignItems: "center", justifyContent: "center", color: C.greenMid, fontSize: 13,
                }}>+{files.length - 6}</div>
              )}
            </div>
          )}

          {/* Buton */}
          <button
            onClick={handleUpload}
            disabled={!files.length || uploading}
            style={{
              width: "100%", padding: "14px", borderRadius: 50, border: "none",
              background: files.length && !uploading
                ? `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 50%, ${C.gold} 100%)`
                : C.creamDark,
              color: files.length && !uploading ? "#fff" : C.greenLight,
              fontWeight: 600, fontSize: 13, letterSpacing: "0.18em",
              cursor: files.length && !uploading ? "pointer" : "not-allowed",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              boxShadow: files.length && !uploading ? `0 4px 20px rgba(184,149,58,0.3)` : "none",
              transition: "all 0.25s",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {uploading ? "Yükleniyor..." : "PAYLAŞ"}
          </button>

          {done && (
            <div style={{
              padding: "12px 16px", borderRadius: 10, fontSize: 14, textAlign: "center",
              background: `rgba(45,74,45,0.06)`, border: `1px solid rgba(45,74,45,0.15)`, color: C.greenMid,
            }}>
              ✓ Yüklendi, teşekkürler!
            </div>
          )}
          {error && (
            <div style={{
              padding: "12px 16px", borderRadius: 10, fontSize: 14, textAlign: "center",
              background: "rgba(180,60,60,0.06)", border: "1px solid rgba(180,60,60,0.2)", color: "#b43c3c",
            }}>
              {error}
            </div>
          )}

          {/* Alt bilgi */}
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1, height: 1, background: C.gold, opacity: 0.3 }} />
              <span style={{ color: C.gold, fontSize: 12, opacity: 0.6 }}>✦</span>
              <div style={{ flex: 1, height: 1, background: C.gold, opacity: 0.3 }} />
            </div>
            <p style={{ color: C.greenLight, fontSize: 12, fontStyle: "italic" }}>
              Merve & Devran · 10.10.2026
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
