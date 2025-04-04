import { useState, useRef, useEffect } from 'react';
import styles from '../styles/AIChat.module.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const AIChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('https://api.dify.ai/v1/chat-messages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: userMessage,
                    inputs: {},
                    response_mode: "streaming",
                    user: "user_001",
                    conversation_id: ""
                })
            });

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error("无法获取响应流");
            }

            let assistantMessage = '';
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const events = chunk.split('\n\n').filter(Boolean);
                
                for (const event of events) {
                    if (event.startsWith('data: ')) {
                        const jsonStr = event.slice(6);
                        try {
                            const data = JSON.parse(jsonStr);
                            if (data.answer) {
                                assistantMessage += data.answer;
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    const lastMessage = newMessages[newMessages.length - 1];
                                    if (lastMessage && lastMessage.role === 'assistant') {
                                        lastMessage.content = assistantMessage;
                                        return [...newMessages];
                                    } else {
                                        return [...prev, { role: 'assistant', content: assistantMessage }];
                                    }
                                });
                            }
                        } catch (e) {
                            // 忽略非 JSON 数据
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: '抱歉，发生了错误，请稍后再试。' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.messagesContainer}>
                {messages.map((message, index) => (
                    <div 
                        key={index} 
                        className={`${styles.message} ${
                            message.role === 'user' ? styles.userMessage : styles.assistantMessage
                        }`}
                    >
                        <div className={styles.messageContent}>
                            {message.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className={styles.inputForm}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入您的问题..."
                    disabled={isLoading}
                    className={styles.input}
                />
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={styles.submitButton}
                >
                    {isLoading ? '发送中...' : '发送'}
                </button>
            </form>
        </div>
    );
};

export default AIChat; 