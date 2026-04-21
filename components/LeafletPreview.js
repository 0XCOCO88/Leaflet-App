"use client";

export const THEMES = [
  { id: "navy", label: "Navy Gold", bg: "#1e3a5f", accent: "#f5a623", leftBg: "rgba(0,0,0,0.2)", redAccent: "#e63946", grad: "linear-gradient(135deg,#1e3a5f,#f5a623)" },
  { id: "teal", label: "Teal Cyan", bg: "#0d4f4f", accent: "#64dfdf", leftBg: "rgba(0,0,0,0.15)", redAccent: "#f77f00", grad: "linear-gradient(135deg,#0d4f4f,#64dfdf)" },
  { id: "forest", label: "Forest", bg: "#1b4332", accent: "#52b788", leftBg: "rgba(0,0,0,0.15)", redAccent: "#e63946", grad: "linear-gradient(135deg,#1b4332,#52b788)" },
  { id: "maroon", label: "Maroon", bg: "#4a1228", accent: "#ffb347", leftBg: "rgba(0,0,0,0.2)", redAccent: "#ff6b6b", grad: "linear-gradient(135deg,#4a1228,#ffb347)" },
  { id: "slate", label: "Slate Blue", bg: "#1e2d3d", accent: "#90e0ef", leftBg: "rgba(0,0,0,0.15)", redAccent: "#e63946", grad: "linear-gradient(135deg,#1e2d3d,#90e0ef)" },
  { id: "ocean", label: "Deep Ocean", bg: "#0f2027", accent: "#e0c3fc", leftBg: "rgba(0,0,0,0.2)", redAccent: "#ff6b6b", grad: "linear-gradient(135deg,#0f2027,#e0c3fc)" },
];

function parseBold(text) {
  if (!text) return "";
  return text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff">$1</strong>');
}

export default function LeafletPreview({ data, theme }) {
  if (!data) return null;
  const t = THEMES.find(th => th.id === theme) || THEMES[0];

  const pageStyle = {
    background: t.bg,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
    fontFamily: "'Poppins', sans-serif",
    marginBottom: 24,
    color: "#fff",
    fontSize: 11,
    lineHeight: 1.55,
  };

  const SectionTitle = ({ text, emoji }) => (
    <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10, display: "flex", alignItems: "center", gap: 6, color: "#fff" }}>
      {emoji && <span style={{ fontSize: 14 }}>{emoji}</span>}
      {text}
    </div>
  );

  const Bullet = ({ text, icon = "▸", color = t.accent }) => (
    <div style={{ display: "flex", gap: 6, marginBottom: 3, fontSize: 10, color: "rgba(255,255,255,0.82)" }}>
      <span style={{ color, fontSize: 8, marginTop: 3, flexShrink: 0 }}>{icon}</span>
      <span dangerouslySetInnerHTML={{ __html: parseBold(text) }} />
    </div>
  );

  const hasTujuan = data.tujuanDiet?.length > 0;
  const hasMasalah = data.masalahGizi?.length > 0;
  const hasMenu = data.contohMenu && Object.values(data.contohMenu).some(v => v);
  const hasGaram = data.garamTersembunyi?.length > 0;
  const hasPenyebab = data.penyebab?.length > 0;
  const hasKlasifikasi = data.klasifikasi?.length > 0 && data.klasifikasi[0]?.kategori;
  const hasPencegahan = data.caraMencegah?.length > 0;
  const hasPengobatan = data.pengobatan?.length > 0;
  const hasEfekSamping = data.efekSamping?.length > 0;
  const hasTandaBahaya = data.tandaBahaya?.length > 0;
  const hasRisiko = data.faktorRisiko?.length > 0;
  const hasSubNote = data.diseaseSubNote && data.diseaseSubNote.length > 0;
  const hasTips = data.tips?.length > 0;

  return (
    <div id="leaflet-render">
      {/* PAGE 1 */}
      <div style={pageStyle} className="print-page">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", minHeight: 500 }}>

          {/* LEFT */}
          <div style={{ background: t.leftBg, padding: "20px 16px" }}>
            <div style={{ width: "100%", height: 120, background: "rgba(255,255,255,0.06)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, marginBottom: 16 }}>
              {data.diseaseEmoji || "🏥"}
            </div>

            {hasPenyebab && (
              <>
                <SectionTitle text="Penyebab" emoji="🔍" />
                {data.penyebab.map((p, i) => <Bullet key={i} text={p} />)}
                <div style={{ height: 12 }} />
              </>
            )}

            {hasRisiko && (
              <>
                <SectionTitle text="Faktor Risiko" emoji="⚡" />
                {data.faktorRisiko.map((r, i) => <Bullet key={i} text={r} />)}
                <div style={{ height: 12 }} />
              </>
            )}

            <SectionTitle text="Syarat Diet" emoji="📋" />
            {data.syaratDiet?.map((s, i) => <Bullet key={i} text={s} />)}

            {hasKlasifikasi && (
              <>
                <div style={{ height: 12 }} />
                <SectionTitle text="Klasifikasi" />
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: 8, fontSize: 9 }}>
                  {data.klasifikasi.map((k, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ color: "rgba(255,255,255,0.7)" }}>{k.kategori}</span>
                      <span style={{ fontWeight: 700, color: t.accent }}>{k.nilai}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* MIDDLE */}
          <div style={{ padding: "20px 18px" }}>
            <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>{data.diseaseName}</div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.75)", marginBottom: 6, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: parseBold(data.diseaseDefinition) }} />
            {hasSubNote && (
              <div style={{ fontSize: 10, color: t.accent, fontStyle: "italic", marginBottom: 14 }}>→ {data.diseaseSubNote}</div>
            )}

            {hasTujuan && (
              <>
                <SectionTitle text="Tujuan Diet" emoji="🎯" />
                {data.tujuanDiet.map((tt, i) => <Bullet key={i} text={tt} />)}
                <div style={{ height: 12 }} />
              </>
            )}

            <SectionTitle text="Tanda Gejala" emoji="⚠️" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6, marginBottom: 16 }}>
              {data.gejala?.slice(0, 6).map((g, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 2 }}>{g.emoji}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase" }}>{g.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Cara Pengolahan Makanan</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                {(data.caraPengolahan?.length ? data.caraPengolahan : ["Direbus", "Dikukus", "Ditumis"]).map((c, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, margin: "0 auto 4px", color: t.bg }}>
                      {["🍲", "♨️", "🥘", "🔥", "🍳"][i] || "🍳"}
                    </div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{c}</div>
                  </div>
                ))}
              </div>
            </div>

            {hasPengobatan && (
              <>
                <div style={{ height: 12 }} />
                <SectionTitle text="Pengobatan" emoji="💊" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {data.pengobatan.map((p, i) => (
                    <span key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "4px 10px", fontSize: 9, fontWeight: 700 }}>{p}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 8 }}>
              Departemen Ilmu Gizi<br />Fakultas Kedokteran<br />Universitas Diponegoro
            </div>

            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>TERAPI GIZI</div>
              <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.1, color: t.accent }}>
                {data.dietTitle || data.diseaseName}
              </div>
              {data.dietSub && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{data.dietSub}</div>}
            </div>

            <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, margin: "8px auto" }}>
              {data.diseaseEmoji || "🏥"}
            </div>

            <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: 10, marginTop: "auto" }}>
              {["Nama", "Umur", "Tinggi Badan", "Alamat", "Tanggal"].map(k => (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "65px 8px 1fr", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>{k}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>:</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>...........................</span>
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "65px 8px 1fr", padding: "3px 0" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Dietisien</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>:</span>
                <span style={{ fontSize: 9, color: "#fff" }}>Fika Nurul Uyun</span>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 6, fontSize: 8, color: t.accent, fontStyle: "italic" }}>
              Fika Nurul Uyun (22030125220050)
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2 */}
      <div style={pageStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", minHeight: 460 }}>

          {/* LEFT: TIPS */}
          <div style={{ padding: "18px 14px" }}>
            {hasTips && (
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>🏠</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>TIPS</div>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>Ketika di Rumah</div>
                  </div>
                </div>
                {data.tips.map((tt, i) => <Bullet key={i} text={tt} icon="→" />)}
              </div>
            )}

            {hasTandaBahaya && (
              <div style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.25)", borderRadius: 10, padding: 12, marginBottom: 14 }}>
                <SectionTitle text="Tanda Bahaya" emoji="🚨" />
                {data.tandaBahaya.map((tb, i) => <Bullet key={i} text={tb} icon="!" color={t.redAccent} />)}
              </div>
            )}

            {hasPencegahan && (
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 12 }}>
                <SectionTitle text="Cara Mencegah" emoji="🛡️" />
                {data.caraMencegah.map((c, i) => <Bullet key={i} text={c} />)}
              </div>
            )}

            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, marginTop: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, textAlign: "center", textTransform: "uppercase", marginBottom: 2 }}>ANJURAN KONSUMSI</div>
              <div style={{ fontSize: 9, fontWeight: 800, textAlign: "center", color: t.accent, textTransform: "uppercase", marginBottom: 10 }}>Gula · Garam · Lemak</div>
              {[
                { label: "Gula", val: data.anjuranGGL?.gula || "4 sdm / 50g" },
                { label: "Garam", val: data.anjuranGGL?.garam || "1 sdt / 5g" },
                { label: "Lemak", val: data.anjuranGGL?.lemak || "5 sdm / 67g" },
              ].map((g, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ background: i % 2 === 0 ? t.accent : t.bg, color: i % 2 === 0 ? t.bg : "#fff", fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 20, minWidth: 50, textAlign: "center" }}>{g.label}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.65)" }}>{g.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MIDDLE: BAHAN MAKANAN */}
          <div style={{ padding: "18px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>BAHAN MAKANAN</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 4 }}>— DIANJURKAN —</div>
            <div style={{ height: 2, width: 40, background: t.accent, borderRadius: 2, marginBottom: 10 }} />
            {data.dianjurkan?.map((d, i) => (
              <Bullet key={i} text={`**${d.kategori}:** ${d.isi}`} icon="✓" color={t.accent} />
            ))}

            <div style={{ height: 16 }} />
            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 4 }}>— DIBATASI / DIHINDARI —</div>
            <div style={{ height: 2, width: 40, background: t.redAccent, borderRadius: 2, marginBottom: 10 }} />
            {data.dihindari?.map((d, i) => (
              <Bullet key={i} text={`**${d.kategori}:** ${d.isi}`} icon="✗" color={t.redAccent} />
            ))}
          </div>

          {/* RIGHT: GARAM / MASALAH / MENU */}
          <div style={{ padding: "18px 14px", display: "flex", flexDirection: "column" }}>
            {hasGaram && (
              <>
                <div style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.2)", borderRadius: 8, padding: "6px 10px", fontSize: 10, fontWeight: 800, textAlign: "center", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
                  ⚠️ WASPADAI GARAM TERSEMBUNYI
                </div>
                {data.garamTersembunyi.map((g, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                      {["🧂", "🥫", "🍞", "🌶️"][i] || "🧂"}
                    </div>
                    <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
                      <strong style={{ color: "#fff" }}>{g.judul}:</strong> {g.penjelasan}
                    </div>
                  </div>
                ))}
              </>
            )}

            {hasMasalah && (
              <>
                <div style={{ height: hasGaram ? 14 : 0 }} />
                <SectionTitle text="Masalah Gizi & Solusi" emoji="💡" />
                {data.masalahGizi.slice(0, 4).map((m, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: t.accent, marginBottom: 3 }}>{String(i + 1).padStart(2, "0")}. {m.judul}</div>
                    {m.solusi?.map((s, j) => (
                      <div key={j} style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", paddingLeft: 10, marginBottom: 1, display: "flex", gap: 4 }}>
                        <span style={{ color: t.accent, fontSize: 7, marginTop: 3 }}>●</span>{s}
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}

            {hasMenu && (
              <>
                <div style={{ height: 14 }} />
                <SectionTitle text="Contoh Menu" emoji="🍽️" />
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: 10, fontSize: 9, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                  {data.contohMenu.sarapan && <div><strong style={{ color: t.accent }}>Sarapan:</strong> {data.contohMenu.sarapan}</div>}
                  {data.contohMenu.selinganPagi && <div><strong style={{ color: t.accent }}>Selingan:</strong> {data.contohMenu.selinganPagi}</div>}
                  {data.contohMenu.makanSiang && <div><strong style={{ color: t.accent }}>Siang:</strong> {data.contohMenu.makanSiang}</div>}
                  {data.contohMenu.selinganSore && <div><strong style={{ color: t.accent }}>Selingan:</strong> {data.contohMenu.selinganSore}</div>}
                  {data.contohMenu.makanMalam && <div><strong style={{ color: t.accent }}>Malam:</strong> {data.contohMenu.makanMalam}</div>}
                </div>
              </>
            )}

            {hasEfekSamping && (
              <>
                <div style={{ height: 14 }} />
                <SectionTitle text="Efek Samping Pengobatan" emoji="💊" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {data.efekSamping.map((e, i) => (
                    <span key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "3px 8px", fontSize: 8, fontWeight: 600 }}>{e}</span>
                  ))}
                </div>
              </>
            )}

            {data.referensi?.length > 0 && (
              <div style={{ marginTop: 14, padding: 10, background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
                <div style={{ fontSize: 8, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 4 }}>Referensi</div>
                {data.referensi.map((r, i) => (
                  <div key={i} style={{ fontSize: 7.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.4, marginBottom: 2 }}>{r}</div>
                ))}
              </div>
            )}

            <div style={{ marginTop: "auto", paddingTop: 12, textAlign: "center", fontSize: 8, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>
              Fika Nurul Uyun (22030125220050)<br />Dept. Ilmu Gizi FK Undip
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
