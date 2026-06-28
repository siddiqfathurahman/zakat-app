<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    public function generateNews(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string|max:1000',
        ]);

        $apiKey = config('services.gemini.key');

        $systemPrompt = <<<PROMPT
Kamu adalah asisten penulis berita resmi untuk Masjid Al Anhar, yang berlokasi di Keparakan Kidul MG 1/1232, Kota Yogyakarta.

Berdasarkan topik yang diberikan, buatkan berita masjid dalam Bahasa Indonesia yang informatif, islami, dan profesional. Gunakan nama "Masjid Al Anhar" dan lokasi "Keparakan Kidul, Yogyakarta" secara natural dalam isi berita.

Kembalikan HANYA JSON valid dengan format berikut (tanpa markdown, tanpa backtick, tanpa teks lain di luar JSON):
{
  "title": "Judul berita yang menarik, maksimal 100 karakter",
  "excerpt": "Ringkasan singkat berita, maksimal 200 karakter",
  "content": "Isi berita lengkap dalam format HTML menggunakan tag <p>, <h2>, <h3>, <ul>, <li>, <strong>. Minimal 3 paragraf yang informatif dan islami."
}
PROMPT;

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $systemPrompt . "\n\nTopik: " . $request->prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature'     => 0.7,
                    'maxOutputTokens' => 8192,
                ]
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'error'  => 'Gagal menghubungi Gemini API',
                    'status' => $response->status(),
                    'detail' => $response->json(),
                ], 500);
            }

            $text = $response->json('candidates.0.content.parts.0.text');

            // Bersihkan markdown backtick jika ada
            $text = preg_replace('/```json|```/i', '', $text);
            $text = trim($text);

            $data = json_decode($text, true);

            if (!$data || !isset($data['title'], $data['excerpt'], $data['content'])) {
                return response()->json(['error' => 'Format respons AI tidak valid'], 500);
            }

            return response()->json([
                'title'   => $data['title'],
                'excerpt' => $data['excerpt'],
                'content' => $data['content'],
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }
}