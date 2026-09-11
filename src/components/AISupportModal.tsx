import React, { useState } from 'react';
import { X, MessageCircle, Send, Sparkles, HelpCircle, Phone } from 'lucide-react';
import { Language } from '../types';
import { translations, buildWhatsAppLink, BOUTIQUE_PHONE } from '../lib/i18n';

interface AISupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AISupportModal: React.FC<AISupportModalProps> = ({ isOpen, onClose, language }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: language === 'ar'
        ? 'مرحباً بك في خدمة عملاء أتيليه زايا بالجزائر. يمكنني إجابتك فوراً عن أسعار التوصيل لـ 58 ولاية، المقاسات، الدفع عند الاستلام وطريقة الاستبدال.'
        : 'Bonjour et bienvenue chez ZAYA Atelier. Je suis votre conseillère clientèle. Posez-moi vos questions sur nos livraisons 58 wilayas, le paiement COD ou les échanges de taille.'
    }
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, language })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', text: 'Notre équipe est à votre disposition également sur WhatsApp au 0550 00 11 22.' }
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Pour une assistance personnalisée, écrivez-nous directement sur WhatsApp.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    { fr: 'Combien coûte la livraison à Oran / Constantine ?', ar: 'كم سعر التوصيل إلى وهران أو قسنطينة؟' },
    { fr: 'Comment fonctionne le paiement à la livraison (COD) ?', ar: 'كيف يتم الدفع عند الاستلام؟' },
    { fr: 'Puis-je échanger la taille si elle ne me va pas ?', ar: 'هل يمكن استبدال المقاس إذا لم يناسبني؟' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] shadow-2xl border border-[#E8E1D5] overflow-hidden my-6 flex flex-col h-[560px] animate-in fade-in zoom-in-95 duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#1A1918] text-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C5A880] text-stone-950 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif-luxury font-bold text-sm tracking-wide">
                Conciergerie Client ZAYA
              </div>
              <div className="text-[10px] text-[#C5A880] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span>En ligne • Réponse instantanée</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] p-3 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#1A1918] text-[#FAF8F5] rounded-l-md rounded-tr-md'
                    : 'bg-[#EFE9DF] text-[#3D362E] border border-[#DDD4C4] rounded-r-md rounded-tl-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-3 bg-[#EFE9DF] text-xs text-stone-600 rounded-r-md rounded-tl-md flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880] animate-spin" />
                <span>Rédaction en cours...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Question suggestions */}
        <div className="px-4 py-2 bg-[#F3EFE9] border-t border-[#EAE3D6] overflow-x-auto flex gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(language === 'ar' ? q.ar : q.fr)}
              className="px-2.5 py-1 bg-white border border-stone-300 text-[11px] text-stone-700 hover:border-[#1A1918] whitespace-nowrap transition-colors"
            >
              {language === 'ar' ? q.ar : q.fr}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-[#EAE3D6]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'ar' ? 'اكتب استفسارك هنا...' : 'Posez une question sur nos livraisons, tailles...'}
              className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-[#1A1918] hover:bg-black text-white text-xs uppercase font-semibold disabled:opacity-50 flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
            <span>Atelier Alger : Val d’Hydra</span>
            <a
              href={buildWhatsAppLink(BOUTIQUE_PHONE, 'Salam ZAYA Atelier')}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366]" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
