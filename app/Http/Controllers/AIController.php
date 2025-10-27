<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GroqAIService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class AIController extends Controller
{
    private $aiService;

    public function __construct(GroqAIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Main chat endpoint with retry mechanism
     */
    public function chat(Request $request)
    {
        try {
            $request->validate([
                'message' => 'required|string|max:1000'
            ]);

            $message = trim($request->input('message'));
            
            // Get conversation history from session
            $history = Session::get('ai_conversation', []);
            
            // Analyze intent
            $intent = $this->aiService->analyzeIntent($message);

            Log::info('AI Chat Request', [
                'message' => $message,
                'intent' => $intent,
                'history_count' => count($history)
            ]);

            // Retry mechanism (max 2 attempts)
            $maxRetries = 2;
            $attempt = 0;
            $response = null;
            
            while ($attempt < $maxRetries) {
                $response = $this->aiService->chat($message, $history);
                
                if ($response['success']) {
                    break; // Success, exit loop
                }
                
                $attempt++;
                Log::warning("AI chat attempt {$attempt} failed, retrying...");
                
                if ($attempt < $maxRetries) {
                    usleep(500000); // Wait 0.5 second before retry
                }
            }

            if ($response['success']) {
                // Save to history
                $history[] = ['role' => 'user', 'content' => $message];
                $history[] = ['role' => 'assistant', 'content' => $response['message']];
                
                // Keep only last 10 messages (5 exchanges)
                if (count($history) > 10) {
                    $history = array_slice($history, -10);
                }
                
                Session::put('ai_conversation', $history);
                
                return response()->json([
                    'success' => true,
                    'message' => $response['message'],
                    'intent' => $intent,
                    'timestamp' => now()->toIso8601String()
                ]);
            } else {
                // All retries failed
                return response()->json([
                    'success' => false,
                    'message' => 'Maaf, AI sedang sibuk. Coba lagi dalam beberapa saat ya! 😊',
                    'intent' => $intent,
                    'timestamp' => now()->toIso8601String()
                ], 503);
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pesan tidak valid. Silakan coba lagi.',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('AI Chat Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan. Coba lagi ya! 😊'
            ], 500);
        }
    }

    /**
     * Clear conversation history
     */
    public function clearHistory()
    {
        Session::forget('ai_conversation');
        
        return response()->json([
            'success' => true,
            'message' => 'Riwayat percakapan berhasil dihapus'
        ]);
    }
}