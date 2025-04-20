import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IoMdClose } from "react-icons/io";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Gemini AI Konfigürasyonu
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

  // İlk açılış mesajı efekti
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: "Salam! Necə kömək edə bilərəm? 😊",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  }, [isOpen, messages.length]);

  // Mesajları otomatik aşağı kaydır
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Gerçek API Entegrasyonu
  const generateAIResponse = async (prompt) => {
    setIsLoading(true);
    try {
      const result = await model.generateContent(`
        Aşağıdaki soruya Azerbaycan Türkçesinde samimi ve eğlenceli bir şekilde cevap ver:
        ${prompt}
        
        Kurallar:
        1. Emojiler kullan
        2. Resmi dil kullanma
        3. Kısa ve öz olsun
        4. Basit ve anlaşılır olsun
        5. Biraz mizahi ol
        7. Sorulara cevap verirken, sorunun içeriğine göre cevap ver
        8. bak sen bir online sinav platformunda chatbot gibi davranıyorsun, sorulara cevap veriyorsun
        9. biz bir online sinav platformuyuz, sorulara cevap veriyorsun.
        10.iletisim bilgilerimiz:
        - Email:balabebir.info@outlook.com
        - Telefon: +994 70 545 30 35
        - instagram: @balabebir
        11.iletisim bilgilerimizi isteyen olursa ver her zaman verme 
        
      `);
      
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("API Hatası:", error);
      return "Üzr istəyirəm, cavab verə bilmədim 😔";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setMessages(prev => [...prev, { 
      text: inputText, 
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    }]);
    
    const userInput = inputText;
    setInputText('');

    const aiResponse = await generateAIResponse(userInput);

    setMessages(prev => [...prev, { 
      text: aiResponse, 
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence mode='popLayout'>
        {/* Maskot Butonu */}
        {!isOpen && (
          <motion.div
            key="mascot"
            className="relative cursor-pointer bg-white rounded-full shadow-lg p-2 group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={() => setIsOpen(true)}
          >
            <img
              src="https://res.cloudinary.com/dwvmtepwh/image/upload/v1737813135/e4xxqslqmqqkocbrvxp5.png"
              alt="Bebir AI"
              className="w-16 h-16 group-hover:scale-150 transition-transform duration-300"
            />
          </motion.div>
        )}

        {/* Sohbet Penceresi */}
        {isOpen && (
          <motion.div
            key="chat"
            className="bg-white w-[95vw] md:w-96 h-[80vh] md:h-[500px] shadow-xl rounded-2xl flex flex-col mx-2"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            {/* Header */}
            <div className="bg-blue-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Bebir Asistan</h2>
                <p className="text-base">Necə kömək edə bilərəm?</p>
              </div>
              <IoMdClose 
                size={30}
                className="cursor-pointer hover:scale-125 transition-transform"
                onClick={() => setIsOpen(false)}
              />
            </div>

            {/* Mesajlar Alanı */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, x: message.isUser ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div
                    className={`max-w-[90%] md:max-w-[80%] p-3 rounded-2xl ${
                      message.isUser 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                    <span className="text-xs opacity-70 block mt-1">
                      {message.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <span>Bebir yazır...</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Alanı */}
            <form 
              onSubmit={handleSubmit}
              className="border-t p-4 flex flex-col md:flex-row gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Bura yazın..."
                className="flex-1 border-2 border-blue-500 rounded-lg p-2 focus:outline-none w-full"
                disabled={isLoading}
              />
              <motion.button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 w-full md:w-auto"
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? '...' : 'Gönder'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;