import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '👋 Halo! Saya Wisata Assistant, teman virtual kamu untuk eksplor Bali! 🏝️\n\nMau planning liburan, cari kuliner enak, atau sekedar ngobrol tentang Bali? Tanya aja apapun! 😊',
            timestamp: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        
        setMessages(prev => [...prev, {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        }]);

        setIsLoading(true);

        // Retry mechanism - max 2 attempts
        let attempts = 0;
        const maxAttempts = 2;

        while (attempts < maxAttempts) {
            try {
                const response = await axios.post('/ai/chat', {
                    message: userMessage
                });

                if (response.data.success) {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: response.data.message,
                        timestamp: response.data.timestamp
                    }]);
                    break; // Success, exit loop
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                attempts++;
                console.error(`AI Chat Error (attempt ${attempts}):`, error);
                
                if (attempts >= maxAttempts) {
                    // All attempts failed
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: '😅 Maaf, koneksi lagi tidak stabil. Coba tanya lagi ya!',
                        timestamp: new Date().toISOString()
                    }]);
                } else {
                    // Wait before retry
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickPrompts = [
        '🏖️ Wisata pantai',
        '💰 Budget hemat',
        '❤️ Spot romantis',
        '🍜 Kuliner enak',
        '📸 Spot foto',
        '🎭 Budaya Bali',
        '🎮 Fun fact dong!',
        '🗣️ Ajarin bahasa Bali',
    ];

    const handleQuickPrompt = (prompt) => {
        setInput(prompt);
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                aria-label="Toggle Chat"
            >
                {isOpen ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="relative">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                <span className="text-2xl">🤖</span>
                            </div>
                            <div>
                                <h3 className="font-bold">Wisata Assistant</h3>
                                <p className="text-xs text-blue-100">AI-powered by Groq 🚀</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                            aria-label="Close Chat"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                        msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                                    <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        
                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts - Only show on first message */}
                    {messages.length === 1 && (
                        <div className="p-3 bg-white border-t">
                            <p className="text-xs text-gray-500 font-medium mb-2">Coba tanyakan:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickPrompts.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickPrompt(prompt)}
                                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Tanya tentang wisata Bali..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                aria-label="Send Message"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS Animations */}
            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </>
    );
}

// ========================================
// INSTRUKSI:
// ========================================
// 1. Copy SEMUA code di atas
// 2. Paste ke: resources/js/Components/AIChat.jsx
// 3. REPLACE semua isi file lama
// 4. Save
// 5. Refresh browser (Ctrl+Shift+R)
//
// FEATURES:
// ✅ Retry mechanism (2 attempts)
// ✅ Better error handling
// ✅ 8 quick prompts (varied & fun)
// ✅ Engaging welcome message
// ✅ Loading indicator
// ✅ Smooth animations
// ✅ Auto-scroll to bottom
// ✅ Enter to send
// ✅ Timestamp untuk setiap message
// ✅ Responsive & accessible