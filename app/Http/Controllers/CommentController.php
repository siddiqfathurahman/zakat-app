<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CommentController extends Controller
{
    /**
     * Public - Kirim komentar baru
     */
    public function store(Request $request, $slug)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'body' => 'required|string|max:1000',
        ]);

        $news = News::where('slug', $slug)->firstOrFail();

        $sentiment = $this->analyzeSentiment($request->body);

        Comment::create([
            'news_id'   => $news->id,
            'name'      => $request->name,
            'body'      => $request->body,
            'sentiment' => $sentiment,
        ]);

        if ($sentiment === 'negative') {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'body' => 'Komentar Anda mengandung konten yang tidak pantas. Mohon gunakan bahasa yang sopan dan santun.',
            ]);
        }

        return back()->with('success', 'Komentar berhasil dikirim!');
    }            

    /**
     * Admin - List semua komentar per berita
     */
    public function adminIndex(Request $request, $slug)
    {
        $news = News::where('slug', $slug)->firstOrFail();

        $query = $news->comments()->latest();

        if ($request->filled('sentiment')) {
            $query->where('sentiment', $request->sentiment);
        }

        $comments = $query->paginate(20);

        return Inertia::render('dashboard/AdminKomentar', [
            'news'     => $news,
            'comments' => $comments->items(),
            'pagination' => [
                'total'        => $comments->total(),
                'current_page' => $comments->currentPage(),
                'last_page'    => $comments->lastPage(),
            ],
            'filters' => [
                'sentiment' => $request->get('sentiment', ''),
            ],
        ]);
    }

    /**
     * Admin - Hapus komentar
     */
    public function destroy(Comment $comment)
    {
        $slug = $comment->news->slug;
        $comment->delete();

        return redirect()->route('admin.comments', $slug)
            ->with('success', 'Komentar berhasil dihapus.');
    }

    /**
     * Analisis sentiment: keyword dulu → jika lolos baru AI
     */
    private function analyzeSentiment(string $text): string
    {
        // ── Tahap 1: Filter keyword negatif ──
        $negativeKeywords = [
            // Kata kasar umum
            'anjing', 'anjir', 'anjg', 'babi', 'bangsat', 'bajingan', 'brengsek',
            'keparat', 'kampret', 'kamprit', 'kontol', 'memek', 'pepek', 'jancok',
            'jancuk', 'cok', 'cuk', 'asu', 'celeng', 'berengsek', 'sialan',
            'setan', 'iblis', 'laknat', 'terkutuk', 'jahannam',

            // Hinaan / penghinaan
            'bodoh', 'tolol', 'idiot', 'goblok', 'dungu', 'pandir', 'bego',
            'bloon', 'loading', 'lemot otak', 'otak udang', 'otak kosong',
            'tidak becus', 'tidak kompeten', 'tidak berguna', 'tidak bisa apa',
            'payah', 'parah banget', 'jelek sekali', 'buruk sekali',
            'sampah', 'tai', 'tahi', 'kotoran', 'busuk', 'brengsek',

            // Ujaran kebencian / SARA
            'kafir', 'sesat', 'murtad', 'haram', 'bid\'ah', 'musyrik',
            'pendosa', 'munafik', 'fasik', 'zalim',
            'rasis', 'diskriminasi', 'ras', 'etnis', 'suku rendah',
            'agama sesat', 'agama salah', 'agama palsu',

            // Kalimat negatif umum
            'tidak suka', 'tidak bagus', 'tidak baik', 'tidak bermanfaat',
            'tidak profesional', 'tidak amanah', 'tidak jujur', 'tidak transparan',
            'tidak bertanggung jawab', 'tidak peduli', 'tidak perhatian',
            'mengecewakan', 'kecewa', 'sangat kecewa', 'amat kecewa',
            'buruk', 'jelek', 'parah', 'hancur', 'rusak', 'berantakan',
            'gagal', 'cacat', 'salah', 'bohong', 'dusta', 'tipu', 'penipu',
            'korupsi', 'korup', 'suap', 'pungli',

            // Ancaman / kekerasan
            'bunuh', 'habisi', 'hajar', 'pukul', 'tampar', 'tendang',
            'ancam', 'teror', 'serang', 'bakar', 'hancurkan', 'rusak',
            'laporkan', 'tuntut', 'gugat', 'penjarakan',

            // Spam / tidak relevan
            'klik disini', 'klik link', 'follow ig', 'follow instagram',
            'subscribe', 'promo', 'diskon', 'jual', 'beli', 'murah',
            'wa kami', 'hubungi kami', 'call center', 'order sekarang',
            'slot online', 'judi', 'togel', 'casino', 'poker', 'bet',

            // Konten dewasa
            'bokep', 'porno', 'mesum', 'cabul', 'seronok', 'bugil',
            'telanjang', 'nakal', 'esek', 'ml', 'making love',

            // Ekspresi kasar
            'wtf', 'wth', 'omg', 'fck', 'f*ck', 'sh*t', 'b*bi',
            'a*jing', 'k*ntol', 'b*ngsat',

            // Kritik menyerang pengurus masjid
            'pengurus tidak becus', 'pengurus korup', 'takmir tidak amanah',
            'imam tidak layak', 'khatib tidak kompeten', 'ustadz palsu',
            'masjid rusak', 'masjid kotor', 'masjid jorok',
        ];

        $lowerText = strtolower($text);

        // Nomor HP Indonesia
        if (preg_match('/(?:\+62|62|0)8[\d\s-]{8,15}/', $text)) {
            \Log::info('Sentiment: negative by phone number');
            return 'negative';
        }

        // Email
        if (preg_match('/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i', $text)) {
            \Log::info('Sentiment: negative by email');
            return 'negative';
        }

        // URL
        if (preg_match('/https?:\/\/|www\./i', $text)) {
            \Log::info('Sentiment: negative by URL');
            return 'negative';
        }

        // Username media sosial
        if (preg_match('/@[A-Za-z0-9_.]{3,}/', $text)) {
            \Log::info('Sentiment: negative by username');
            return 'negative';
        }

        foreach ($negativeKeywords as $keyword) {
            if (str_contains($lowerText, $keyword)) {
                \Log::info('Sentiment: negative by keyword [' . $keyword . ']');
                return 'negative';
            }
        }

        // ── Tahap 2: Lolos keyword → cek AI Gemini
        return $this->analyzeWithAI($text);
    }

    /**
     * Analisis lanjutan dengan Gemini AI
     */
    private function analyzeWithAI(string $text): string
    {
        try {
            $apiKey = config('services.gemini.key');

            if (!$apiKey) {
                return 'positive';
            }

            $prompt = "Analisis sentimen komentar berikut untuk konteks berita masjid Islam di Indonesia. Jawab HANYA dengan satu kata: \"positive\" atau \"negative\".\n\nKomentar dianggap NEGATIVE jika mengandung kritik menyerang, hinaan, konten tidak pantas, atau hal negatif tentang masjid/pengurusnya.\n\nKomentar: \"{$text}\"\n\nJawaban:";

            $response = Http::timeout(10)->post(
                "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key={$apiKey}",
                [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ],
                    'generationConfig' => [
                        'temperature'     => 0.1,
                        'maxOutputTokens' => 10,
                    ],
                ]
            );

            if ($response->successful()) {
                $parts = $response->json('candidates.0.content.parts') ?? [];
                $result = '';
                foreach ($parts as $part) {
                    if (isset($part['text'])) {
                        $result .= $part['text'];
                    }
                }

                $result = strtolower(trim($result));
                \Log::info('Sentiment AI result: [' . $result . ']');

                return str_contains($result, 'negative') ? 'negative' : 'positive';
            }

            \Log::warning('Gemini AI failed: ' . $response->status());

        } catch (\Exception $e) {
            \Log::error('Sentiment AI error: ' . $e->getMessage());
        }

        return 'positive';
    }
}