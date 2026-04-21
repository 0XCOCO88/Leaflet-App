import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `Kamu adalah parser ahli gizi. Dari teks leaflet diet RS yang diberikan, extract ke JSON dengan struktur EXACT berikut. Jika field tidak ada, isi string kosong atau array kosong. HANYA output JSON mentah, tanpa markdown backtick atau preamble apapun.

{
  "dietTitle": "judul utama leaflet, cth: Terapi Gizi Gagal Jantung",
  "dietSub": "sub-judul diet jika ada",
  "diseaseName": "nama penyakit utama",
  "diseaseDefinition": "definisi singkat penyakit (1-3 kalimat), boleh pakai **bold** untuk kata kunci",
  "diseaseSubNote": "keterangan tambahan singkat jika ada",
  "diseaseEmoji": "1 emoji yang paling cocok",
  "gejala": [{"label":"nama gejala","emoji":"emoji cocok"}],
  "syaratDiet": ["setiap poin syarat diet sebagai string, boleh **bold**"],
  "tujuanDiet": ["setiap poin tujuan diet jika ada"],
  "dianjurkan": [{"kategori":"cth: Karbohidrat","isi":"list bahan makanan"}],
  "dihindari": [{"kategori":"cth: Protein","isi":"list bahan makanan"}],
  "tips": ["setiap tip sebagai string"],
  "garamTersembunyi": [{"judul":"cth: Penyedap Rasa","penjelasan":"penjelasan"}],
  "contohMenu": {"sarapan":"","selinganPagi":"","makanSiang":"","selinganSore":"","makanMalam":""},
  "masalahGizi": [{"judul":"cth: Penurunan BB","solusi":["solusi1","solusi2"]}],
  "referensi": ["referensi jika ada"],
  "caraPengolahan": ["Direbus","Dikukus","Ditumis"],
  "penyebab": ["penyebab jika disebutkan"],
  "faktorRisiko": ["faktor risiko jika disebutkan"],
  "klasifikasi": [{"kategori":"","nilai":""}],
  "caraMencegah": ["cara mencegah jika ada"],
  "tandaBahaya": ["tanda bahaya jika ada"],
  "pengobatan": ["jenis pengobatan jika ada"],
  "efekSamping": ["efek samping pengobatan jika ada"],
  "anjuranGGL": {"gula":"4 sdm/50g","garam":"1 sdt/5g","lemak":"5 sdm/67g"}
}`;

export async function POST(request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "GEMINI_API_KEY tidak di-set di environment variables" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const result = await model.generateContent(`Berikut teks leaflet diet yang harus di-parse:\n\n${text}`);
    const response = result.response;
    const jsonText = response.text();

    const parsed = JSON.parse(jsonText);
    return Response.json({ data: parsed });
  } catch (err) {
    console.error("Parse error:", err);
    return Response.json({ error: err.message || "Parse failed" }, { status: 500 });
  }
}
