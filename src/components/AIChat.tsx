import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import styles from '../styles/AIChat.module.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const WELCOME_MESSAGE = {
    role: 'assistant' as const,
    content: '你好！我是你的AI助教。我可以帮助你解答问题、提供学习建议，让我们开始对话吧！'
};

const AIChat = () => {
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 自动调整输入框高度
    const adjustTextareaHeight = () => {
        const textarea = inputRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

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
                                scrollToBottom();
                            }
                        } catch (e) {
                            console.error('解析响应数据时出错:', e);
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
                        <div className={styles.messageAvatar}>
                            {message.role === 'user' ? '👤' : '🤖'}
                        </div>
                        <div className={styles.messageContent}>
                            {message.role === 'user' ? (
                                message.content
                            ) : (
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        // 自定义代码块样式
                                        code({node, inline, className, children, ...props}) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline ? (
                                                <pre className={styles.codeBlock}>
                                                    <code
                                                        className={match ? `language-${match[1]}` : ''}
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </code>
                                                </pre>
                                            ) : (
                                                <code className={styles.inlineCode} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className={styles.inputForm}>
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        adjustTextareaHeight();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="输入您的问题...（按Enter发送，Shift+Enter换行）"
                    disabled={isLoading}
                    className={styles.input}
                    rows={1}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className={styles.submitButton}
                >
                    {isLoading ? '发送中...' : '发送'}
                </button>
            </form>
        </div>
    );
};

export default AIChat; 