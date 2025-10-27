<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Models\TempatWisata;
use App\Models\Kendaraan;

class GroqAIService
{
    private $client;
    private $apiKey;
    private $models;
    private $baseUrl = 'https://api.groq.com/openai/v1';

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 30,
            'verify' => false, // Disable SSL verification untuk development
            'http_errors' => false, // Don't throw exception on HTTP errors
        ]);
        $this->apiKey = config('services.groq.api_key');
        $this->models = [
            config('services.groq.model'),
            config('services.groq.fallback_model'),
        ];
    }

    /**
     * Main chat function dengan auto fallback
     */
    public function chat($message, $conversationHistory = [])
    {
        $lastException = null;
        
        // Try each model in order
        foreach ($this->models as $model) {
            try {
                return $this->chatWithModel($message, $conversationHistory, $model);
            } catch (\Exception $e) {
                Log::warning("Model {$model} failed", ['error' => $e->getMessage()]);
                $lastException = $e;
                continue;
            }
        }

        // All models failed
        Log::error('All AI models failed', [
            'error' => $lastException ? $lastException->getMessage() : 'Unknown error'
        ]);

        return [
            'success' => false,
            'message' => 'Maaf, layanan AI sedang sibuk. Coba lagi ya! 😊',
        ];
    }

    /**
     * Chat with specific model
     */
    private function chatWithModel($message, $conversationHistory, $model)
    {
        try {
            $context = $this->buildContext();
            
            $messages = [
                ['role' => 'system', 'content' => $this->getSystemPrompt($context)]
            ];

            foreach ($conversationHistory as $msg) {
                $messages[] = $msg;
            }

            $messages[] = ['role' => 'user', 'content' => $message];

            Log::info('Sending request to Groq AI', [
                'model' => $model,
                'api_key_set' => !empty($this->apiKey),
                'api_key_length' => strlen($this->apiKey ?? ''),
                'message_count' => count($messages)
            ]);

            $response = $this->client->post("{$this->baseUrl}/chat/completions", [
                'headers' => [
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => $model,
                    'messages' => $messages,
                    'temperature' => 0.7,
                    'max_tokens' => 1024,
                ]
            ]);

            $statusCode = $response->getStatusCode();
            $body = $response->getBody()->getContents();

            Log::info('Groq API Response', [
                'status_code' => $statusCode,
                'body_length' => strlen($body)
            ]);

            if ($statusCode !== 200) {
                $errorData = json_decode($body, true);
                $errorMsg = $errorData['error']['message'] ?? $body;
                throw new \Exception("API returned status {$statusCode}: {$errorMsg}");
            }

            $data = json_decode($body, true);

            if (!isset($data['choices'][0]['message']['content'])) {
                throw new \Exception("Invalid response structure. Body: " . substr($body, 0, 200));
            }

            Log::info('Groq AI Success', [
                'model' => $model,
                'tokens' => $data['usage']['total_tokens'] ?? 0
            ]);

            return [
                'success' => true,
                'message' => $data['choices'][0]['message']['content'],
                'model' => $model,
            ];

        } catch (\Exception $e) {
            Log::error('Groq API Error', [
                'model' => $model,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            throw $e;
        }
    }

    /**
     * Build context from database
     */
    private function buildContext()
    {
        return Cache::remember('ai_context', 300, function () {
            $wisata = TempatWisata::where('is_active', true)->get();
            $kendaraan = Kendaraan::where('is_available', true)->get();

            $context = "DATA WISATA:\n\n";
            foreach ($wisata as $w) {
                $context .= "- {$w->nama} ({$w->lokasi})\n";
                $context .= "  Harga: Rp " . number_format((float)($w->harga_tiket ?? 0), 0, ',', '.') . "/orang\n";
                $context .= "  {$w->deskripsi}\n\n";
            }

            $context .= "KENDARAAN:\n\n";
            foreach ($kendaraan as $k) {
                $context .= "- {$k->nama} ({$k->tipe}, {$k->kapasitas} orang)\n";
                $context .= "  Rp " . number_format((float)($k->harga_per_hari ?? 0), 0, ',', '.') . "/hari\n\n";
            }

            return $context;
        });
    }

    /**
     * System prompt untuk AI - More flexible & natural
     */
    private function getSystemPrompt($context)
    {
        return "Kamu adalah 'Wisata Assistant' 🏝️, asisten AI yang ahli pariwisata Bali.

KEPRIBADIAN:
- Ramah, helpful, enthusiastic, dan SANGAT fleksibel
- Gunakan Bahasa Indonesia yang natural dan conversational
- Bisa mengerti typo, bahasa gaul, dan konteks percakapan
- Pakai emoji dengan bijak untuk friendly vibe
- Be professional tapi tetap fun dan approachable!

DATA WISATA YANG KAMU PUNYA:
{$context}

KEMAMPUAN KAMU:
✓ Memahami berbagai cara user bertanya (formal, casual, typo, bahasa gaul)
✓ Memberikan rekomendasi wisata sesuai budget & preferensi
✓ Menghitung budget dengan akurat
✓ Menjelaskan lokasi, akses, dan tips praktis
✓ Menyarankan kombinasi wisata + kendaraan yang tepat
✓ Merespons sapaan dengan natural (hai, halo, hi, halo ai, dsb)

CARA MERESPONS:
✓ Sapaan sederhana (hai, halo, hi, halo ai) → Respond dengan ramah dan tanya kebutuhan
✓ Pertanyaan tentang wisata → Berikan rekomendasi dengan data dari database
✓ Budget planning → Hitung dengan rumus: (tiket × orang) + (kendaraan × hari)
✓ Gunakan format angka: Rp 350.000 (pakai titik pemisah ribuan)
✓ Akhiri dengan pertanyaan follow-up yang natural

CONTOH PERCAKAPAN NATURAL:

User: 'halo ai'
Kamu: 'Hai! 👋 Saya Wisata Assistant. Mau cari destinasi wisata di Bali? Atau ada yang bisa saya bantu? 😊'

User: 'hai'
Kamu: 'Halo! Ada rencana liburan ke Bali? Saya bisa bantu carikan destinasi yang cocok. Mau wisata apa nih? 🏝️'

User: 'wisata pantai murah dong'
Kamu: '🏖️ Hai! Mau wisata pantai yang terjangkau? Saya punya rekomendasi:

**1. Seminyak Beach** (Rp 40.000/orang)
- Vibes trendy dengan beach club
- Perfect untuk foto-foto
- Sunset cantik!

**2. Pantai Kuta** (Rp 50.000/orang)
- Pantai landai, cocok berenang
- Banyak cafe & restaurant
- Ombak bagus untuk surfing

💡 Tips: Datang sore untuk hindari terik!

Berapa budget kamu? Mau pergi berapa orang? 😊'

User: 'budget 2jt utk 4org'
Kamu: 'Oke! Budget Rp 2 juta untuk 4 orang, let me calculate...

[Berikan breakdown lengkap dengan rekomendasi kendaraan]'

PENTING: Selalu respond dengan natural dan helpful, tidak peduli bagaimana user bertanya!";
    }

    /**
     * Analyze user intent
     */
    public function analyzeIntent($message)
    {
        $message = strtolower($message);
        
        $keywords = [
            'recommendation' => ['rekomendasi', 'saran', 'wisata apa'],
            'price' => ['harga', 'budget', 'berapa', 'murah'],
            'location' => ['dimana', 'lokasi', 'alamat'],
            'romantic' => ['romantis', 'couple', 'honeymoon'],
            'family' => ['keluarga', 'anak', 'family'],
            'beach' => ['pantai', 'beach', 'laut'],
        ];

        foreach ($keywords as $intent => $words) {
            foreach ($words as $word) {
                if (str_contains($message, $word)) {
                    return $intent;
                }
            }
        }

        return 'general';
    }
}

// ========================================
// INSTRUKSI:
// ========================================
// 1. Copy SEMUA code di atas
// 2. Paste ke: app/Services/GroqAIService.php
// 3. REPLACE semua isi file lama
// 4. Save
// 5. Run: php artisan optimize:clear
// 6. Test: php artisan tinker
//
// CHANGES:
// ✅ SSL verification disabled
// ✅ HTTP errors handled properly
// ✅ Better logging dengan detail status code
// ✅ Response validation sebelum parse
// ✅ Type casting untuk decimal fields
// ✅ Detailed error messages