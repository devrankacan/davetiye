"use client";

import { useState, useRef } from "react";

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
    if (!name.trim() || !surname.trim()) {
      setError("Ad ve soyad alanları zorunludur");
      return;
    }
    setUploading(true);
    setError("");
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        form.append("name", name.trim());
        form.append("surname", surname.trim());
        form.append("note", note.trim());
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Yükleme başarısız");
        }
      }
      setDone(true);
      setFiles([]);
      setNote("");
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setUploading(false);
    }
  }

  const inp: React.CSSProperties = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(201,168,76,0.3)",
    color: "#f5e6c0",
    borderRadius: "14px",
    padding: "14px 16px",
    width: "100%",
    outline: "none",
    fontSize: "16px", // 16px → iOS'ta zoom olmaz
    WebkitAppearance: "none",
  };

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(160deg,#1a0a00 0%,#2d1200 40%,#1a0a00 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "env(safe-area-inset-top,24px) 20px env(safe-area-inset-bottom,24px)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Başlık */}
        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <p style={{ color: "#c9a84c", fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 8 }}>
            Nişan Hatırası
          </p>
          <h1 style={{
            color: "#f5e6c0",
            fontSize: "clamp(26px,7vw,36px)",
            fontWeight: 300,
            fontFamily: "Georgia,serif",
            letterSpacing: "0.04em",
            margin: 0,
            whiteSpace: "nowrap",
            textShadow: "0 2px 18px rgba(201,168,76,0.2)",
          }}>
            Merve <span style={{ color: "#c9a84c" }}>&</span> Devran
          </h1>
          <p style={{ color: "#9e8060", fontSize: 13, marginTop: 6 }}>Bu güzel anı bizimle paylaşın</p>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,transparent,rgba(201,168,76,0.35))" }} />
          <span style={{ color: "#c9a84c", fontSize: 12 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left,transparent,rgba(201,168,76,0.35))" }} />
        </div>

        {/* Ad / Soyad */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={{ display: "block", color: "#9e8060", fontSize: 11, marginBottom: 6, letterSpacing: "0.05em" }}>
              Ad <span style={{ color: "#c9a84c" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Adınız"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="given-name"
              style={inp}
            />
          </div>
          <div>
            <label style={{ display: "block", color: "#9e8060", fontSize: 11, marginBottom: 6, letterSpacing: "0.05em" }}>
              Soyad <span style={{ color: "#c9a84c" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Soyadınız"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              autoComplete="family-name"
              style={inp}
            />
          </div>
        </div>

        {/* Not */}
        <div>
          <label style={{ display: "block", color: "#9e8060", fontSize: 11, marginBottom: 6, letterSpacing: "0.05em" }}>
            Not <span style={{ color: "#7a5c3a" }}>(isteğe bağlı)</span>
          </label>
          <textarea
            placeholder="Bir mesaj bırakmak ister misiniz?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            style={{ ...inp, resize: "none", lineHeight: 1.5 }}
          />
        </div>

        {/* Upload alanı */}
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            border: "1.5px dashed rgba(201,168,76,0.35)",
            borderRadius: 18,
            padding: "28px 16px",
            textAlign: "center",
            cursor: "pointer",
            background: "rgba(255,255,255,0.03)",
            transition: "border-color 0.2s",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            style={{ display: "none" }}
            onChange={handleSelect}
          />
          {files.length > 0 ? (
            <>
              <div style={{ fontSize: 32, marginBottom: 8 }}>
                {files.some((f) => f.type.startsWith("video/")) ? "🎬" : "🖼️"}
              </div>
              <p style={{ color: "#f5e6c0", fontSize: 15, fontWeight: 500 }}>{files.length} dosya seçildi</p>
              <p style={{ color: "#9e8060", fontSize: 13, marginTop: 4 }}>Değiştirmek için tekrar tıklayın</p>
            </>
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📷</div>
              <p style={{ color: "#d4b87a", fontSize: 15 }}>Fotoğraf veya video seçin</p>
              <p style={{ color: "#7a5c3a", fontSize: 11, marginTop: 6, lineHeight: 1.6 }}>
                JPG · PNG · HEIC · MP4 · MOV
              </p>
            </>
          )}
        </div>

        {/* Önizleme */}
        {files.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {files.slice(0, 6).map((f, i) => (
              <div
                key={i}
                style={{
                  width: 60, height: 60, borderRadius: 10, overflow: "hidden",
                  border: "1px solid rgba(201,168,76,0.3)", background: "#2d1a00",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {f.type.startsWith("image/") ? (
                  <img src={URL.createObjectURL(f)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 24 }}>🎬</span>
                )}
              </div>
            ))}
            {files.length > 6 && (
              <div style={{
                width: 60, height: 60, borderRadius: 10, background: "#2d1a00",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#c9a84c", fontSize: 13,
              }}>
                +{files.length - 6}
              </div>
            )}
          </div>
        )}

        {/* Buton */}
        <button
          onClick={handleUpload}
          disabled={!files.length || uploading}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 50,
            border: "none",
            background: files.length && !uploading
              ? "linear-gradient(135deg,#c9a84c 0%,#f0d080 50%,#c9a84c 100%)"
              : "rgba(201,168,76,0.25)",
            color: files.length && !uploading ? "#1a0a00" : "#7a5c3a",
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "0.15em",
            cursor: files.length && !uploading ? "pointer" : "not-allowed",
            boxShadow: files.length && !uploading ? "0 4px 24px rgba(201,168,76,0.35)" : "none",
            transition: "all 0.25s",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {uploading ? "Yükleniyor..." : "PAYLAŞ"}
        </button>

        {done && (
          <div style={{
            padding: "14px 16px", borderRadius: 14, fontSize: 14, textAlign: "center",
            background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", color: "#c9a84c",
          }}>
            ✓ Yüklendi, teşekkürler!
          </div>
        )}
        {error && (
          <div style={{
            padding: "14px 16px", borderRadius: 14, fontSize: 14, textAlign: "center",
            background: "rgba(180,60,60,0.1)", border: "1px solid rgba(180,60,60,0.3)", color: "#e07070",
          }}>
            {error}
          </div>
        )}

        <p style={{ color: "#4a3520", fontSize: 11, textAlign: "center", paddingBottom: 8 }}>
          Merve & Devran • 10/10/2026
        </p>
      </div>
    </main>
  );
}
