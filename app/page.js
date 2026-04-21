"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import LeafletPreview, { THEMES } from "../components/LeafletPreview";

export default function Page() {
  const [stage, setStage] = useState("upload"); // upload | loading | preview
  const [leafletData, setLeafletData] = useState(null);
  const [rawText, setRawText] = useState("");
  const [theme, setTheme] = useState("navy");
  const [fileName, setFileName] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const loadingMessages = [
    "Membaca file Word...",
    "Menganalisis konten gizi...",
    "Mengekstrak syarat diet...",
    "Menyusun tanda gejala...",
    "Mendesain leaflet...",
    "Finishing touches...",
  ];

  useEffect(() => {
    if (stage !== "loading") return;
    let i = 0;
    setLoadingMsg(loadingMessages[0]);
    const interval = setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      setLoadingMsg(loadingMessages[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [stage]);

  const parseFile = useCallback(async (file) => {
    setFileName(file.name);
    setError("");
    setStage("loading");

    try {
      // Dynamically import mammoth in the browser
      const mammoth = (await import("mammoth/mammoth.browser.js")).default;
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      setRawText(text);

      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();

      if (json.error) {
        setError(json.error);
        setStage("upload");
        return;
      }
      setLeafletData(json.data);
      setStage("preview");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error membaca file");
      setStage("upload");
    }
  }, []);

  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  }, [parseFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".docx") || file.name.endsWith(".doc"))) {
      parseFile(file);
    }
  }, [parseFile]);

  const handleRegenerate = useCallback(async () => {
    if (!rawText) return;
    setStage("loading");
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });
      const json = await res.json();
      if (json.data) setLeafletData(json.data);
      setStage("preview");
    } catch (err) {
      setStage("preview");
    }
  }, [rawText]);

  const updateField = (path, value) => {
    setLeafletData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let target = copy;
      for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]];
      target[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handlePrint = () => window.print();

  return (
    <div style={{ minHeight: "100vh", background: "#0c1117" }}>

      {/* HEADER */}
      <div className="no-print" style={{ background: "linear-gradient(135deg, #0c1117, #162030)", padding: "14px 28px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #f5a623, #e8821a)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🌿</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "'Poppins', sans-serif" }}>Leaflet Gizi Generator</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Fika Nurul Uyun — Dept. Ilmu Gizi FK Undip</div>
        </div>
        <div style={{ marginLeft: "auto", background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.25)", color: "#f5a623", padding: "4px 14px", borderRadius: 20, fontSize: 10, fontWeight: 800 }}>✦ AI-POWERED</div>
      </div>

      {/* UPLOAD */}
      {stage === "upload" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", padding: 40 }}>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            style={{ width: "100%", maxWidth: 520, border: "2px dashed rgba(255,255,255,0.15)", borderRadius: 20, padding: "60px 40px", textAlign: "center", cursor: "pointer", background: "rgba(255,255,255,0.02)", transition: "all 0.3s" }}
          >
            <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.6 }}>📄</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Poppins', sans-serif", marginBottom: 8 }}>Upload File Word</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24, lineHeight: 1.6 }}>
              Drag & drop file <strong style={{ color: "rgba(255,255,255,0.6)" }}>.docx</strong> ke sini<br />
              atau klik untuk pilih file
            </div>
            <div style={{ background: "linear-gradient(135deg, #f5a623, #e8821a)", color: "#fff", padding: "12px 32px", borderRadius: 10, fontWeight: 700, fontSize: 14, display: "inline-block" }}>
              Pilih File .docx
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 16 }}>
              AI akan otomatis membaca konten → generate leaflet
            </div>
          </div>
          <input ref={fileRef} type="file" accept=".docx,.doc" style={{ display: "none" }} onChange={handleFile} />
          {error && (
            <div style={{ marginTop: 20, padding: "12px 18px", background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)", borderRadius: 10, color: "#ff8b94", fontSize: 13, maxWidth: 520 }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      )}

      {/* LOADING */}
      {stage === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", gap: 20 }}>
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <div style={{ width: 80, height: 80, border: "3px solid rgba(255,255,255,0.06)", borderTopColor: "#f5a623", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🌿</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{loadingMsg}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>File: {fileName}</div>
        </div>
      )}

      {/* PREVIEW */}
      {stage === "preview" && (
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", minHeight: "calc(100vh - 60px)" }}>

          {/* SIDEBAR */}
          <div className="no-print" style={{ background: "#0f1820", borderRight: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", padding: 20, maxHeight: "calc(100vh - 60px)" }}>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>FILE AKTIF</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", wordBreak: "break-all" }}>{fileName}</div>
            </div>

            <button
              onClick={() => { setStage("upload"); setLeafletData(null); }}
              style={{ width: "100%", padding: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              📄 Upload File Baru
            </button>

            <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>TEMA WARNA</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
              {THEMES.map((th) => (
                <div
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  title={th.label}
                  style={{
                    height: 42,
                    borderRadius: 8,
                    background: th.grad,
                    cursor: "pointer",
                    border: theme === th.id ? "2px solid #f5a623" : "2px solid transparent",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </div>

            <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>QUICK EDIT</div>

            {[
              { label: "Judul Diet", path: "dietTitle" },
              { label: "Sub-judul", path: "dietSub" },
              { label: "Nama Penyakit", path: "diseaseName" },
              { label: "Emoji", path: "diseaseEmoji" },
            ].map((f) => (
              <div key={f.path} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase" }}>{f.label}</div>
                <input
                  value={leafletData?.[f.path] || ""}
                  onChange={(e) => updateField(f.path, e.target.value)}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "7px 10px", color: "#fff", fontFamily: "inherit", fontSize: 12 }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase" }}>Definisi Penyakit</div>
              <textarea
                value={leafletData?.diseaseDefinition || ""}
                onChange={(e) => updateField("diseaseDefinition", e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "7px 10px", color: "#fff", fontFamily: "inherit", fontSize: 11, minHeight: 60, resize: "vertical" }}
              />
            </div>

            <button
              onClick={handleRegenerate}
              style={{ width: "100%", padding: 12, background: "linear-gradient(135deg, #f5a623, #e8821a)", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", marginTop: 16, boxShadow: "0 4px 20px rgba(245,166,35,0.3)" }}
            >
              ✦ Re-generate AI
            </button>

            <button
              onClick={handlePrint}
              style={{ width: "100%", padding: 10, background: "rgba(42,157,143,0.12)", border: "1px solid rgba(42,157,143,0.3)", borderRadius: 10, fontSize: 12, fontWeight: 700, color: "#2a9d8f", cursor: "pointer", marginTop: 8 }}
            >
              ⬇ Download PDF (Print)
            </button>
          </div>

          {/* PREVIEW AREA */}
          <div style={{ background: "#14181e", overflowY: "auto", padding: "28px 32px" }}>
            <div className="no-print" style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.15)", marginBottom: 16 }}>
              ↳ PREVIEW LEAFLET
            </div>
            <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
              <LeafletPreview data={leafletData} theme={theme} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
