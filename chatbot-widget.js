// Chatbot Widget - Embed on any page
(function() {
    'use strict';

    // Widget HTML
    const widgetHTML = `
        <div id="chatbotWidget" class="chatbot-widget">
            <!-- Chatbot Button -->
            <button id="chatbotToggle" class="chatbot-toggle" title="Chat với AI trợ lý">
                <span class="chatbot-icon">💬</span>
                <span class="chatbot-badge" id="chatbotBadge" style="display: none;">1</span>
            </button>

            <!-- Chatbot Window -->
            <div id="chatbotWindow" class="chatbot-window" style="display: none;">
                <!-- Header -->
                <div class="chatbot-header">
                    <div class="chatbot-header-left">
                        <div class="chatbot-avatar">🤖</div>
                        <div class="chatbot-header-info">
                            <h3>AI Trợ Lý</h3>
                            <p class="chatbot-status">
                                <span class="status-dot"></span>
                                Trực tuyến
                            </p>
                        </div>
                    </div>
                    <div class="chatbot-header-actions">
                        <button class="chatbot-header-btn" onclick="chatbotWidget.clearChat()" title="Xóa lịch sử">
                            🗑️
                        </button>
                        <button class="chatbot-header-btn" onclick="chatbotWidget.minimize()" title="Thu nhỏ">
                            ➖
                        </button>
                    </div>
                </div>

                <!-- Messages -->
                <div id="chatbotMessages" class="chatbot-messages">
                    <div class="chatbot-welcome">
                        <div class="chatbot-welcome-icon">👋</div>
                        <h4>Xin chào!</h4>
                        <p>Tôi là trợ lý AI. Tôi có thể giúp bạn tìm tài liệu, trả lời câu hỏi về môn học và hướng dẫn sử dụng website.</p>
                        
                        <div class="chatbot-suggestions">
                            <button class="suggestion-chip" onclick="chatbotWidget.sendSuggestion(this.textContent)">
                                Tìm tài liệu về lập trình
                            </button>
                            <button class="suggestion-chip" onclick="chatbotWidget.sendSuggestion(this.textContent)">
                                Có môn nào hay không?
                            </button>
                            <button class="suggestion-chip" onclick="chatbotWidget.sendSuggestion(this.textContent)">
                                Hướng dẫn upload tài liệu
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Typing Indicator -->
                <div id="chatbotTyping" class="chatbot-typing" style="display: none;">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <!-- Input -->
                <div class="chatbot-input">
                    <input 
                        type="text" 
                        id="chatbotInput" 
                        placeholder="Nhập câu hỏi của bạn..."
                        onkeypress="if(event.key==='Enter') chatbotWidget.sendMessage()"
                    />
                    <button onclick="chatbotWidget.sendMessage()" class="chatbot-send-btn">
                        <span>📤</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Widget CSS
    const widgetCSS = `
        .chatbot-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .chatbot-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            position: relative;
        }

        .chatbot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
        }

        .chatbot-icon {
            font-size: 28px;
        }

        .chatbot-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #f44336;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }

        .chatbot-window {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 300px;
            max-width: calc(100vw - 24px);
            height: 420px;
            max-height: calc(100vh - 90px);
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(102, 126, 234, 0.18), 0 1.5px 8px rgba(0,0,0,0.08);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: slideUp 0.3s ease;
            border: 1.5px solid #e2e8f0;
        }

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

        .chatbot-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-height: 44px;
        }

        .chatbot-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .chatbot-avatar {
            width: 32px;
            height: 32px;
            background: rgba(255, 255, 255, 0.18);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .chatbot-header-info h3 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
        }

        .chatbot-status {
            margin: 2px 0 0 0;
            font-size: 11px;
            opacity: 0.85;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .chatbot-header-actions {
            display: flex;
            gap: 4px;
        }

        .chatbot-header-btn {
            background: rgba(255, 255, 255, 0.18);
            border: none;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 15px;
            transition: all 0.2s;
        }

        .chatbot-header-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 12px 10px 12px 10px;
            background: #f8f9fa;
        }

        .chatbot-messages::-webkit-scrollbar {
            width: 6px;
        }

        .chatbot-messages::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }

        .chatbot-welcome {
            text-align: center;
            padding: 10px 0 10px 0;
        }

        .chatbot-welcome-icon {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .chatbot-welcome h4 {
            margin: 0 0 6px 0;
            color: #1e293b;
            font-size: 16px;
        }

        .chatbot-welcome p {
            margin: 0 0 12px 0;
            color: #64748b;
            font-size: 12px;
            line-height: 1.5;
        }

        .chatbot-suggestions {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .suggestion-chip {
            background: white;
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 12px;
            color: #475569;
            transition: all 0.2s;
            text-align: left;
        }

        .suggestion-chip:hover {
            background: #667eea;
            color: white;
            border-color: #667eea;
            transform: translateX(4px);
        }

        .chatbot-message {
            margin-bottom: 16px;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .chatbot-message.user {
            display: flex;
            justify-content: flex-end;
        }

        .chatbot-message.bot {
            display: flex;
            justify-content: flex-start;
        }

        .message-bubble {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
        }

        .chatbot-message.user .message-bubble {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 4px;
        }

        .chatbot-message.bot .message-bubble {
            background: white;
            color: #1e293b;
            border-bottom-left-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .chatbot-documents {
            margin: 16px 0;
            animation: fadeIn 0.3s ease;
        }

        .documents-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .document-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
            display: flex;
            gap: 12px;
            align-items: center;
            text-decoration: none;
            color: inherit;
            transition: all 0.2s;
            cursor: pointer;
        }

        .document-card:hover {
            border-color: #667eea;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
        }

        .doc-icon {
            font-size: 32px;
            flex-shrink: 0;
        }

        .doc-info {
            flex: 1;
            min-width: 0;
        }

        .doc-info h4 {
            margin: 0 0 6px 0;
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .doc-meta {
            display: flex;
            gap: 12px;
            font-size: 11px;
            color: #64748b;
            margin: 4px 0;
        }

        .doc-meta span {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .doc-desc {
            font-size: 12px;
            color: #64748b;
            margin: 6px 0 0 0;
            line-height: 1.4;
        }

        .doc-arrow {
            font-size: 20px;
            color: #667eea;
            flex-shrink: 0;
        }

        .chatbot-typing {
            padding: 12px 20px;
            display: flex;
            gap: 4px;
            align-items: center;
        }

        .chatbot-typing span {
            width: 8px;
            height: 8px;
            background: #667eea;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out;
        }

        .chatbot-typing span:nth-child(1) { animation-delay: -0.32s; }
        .chatbot-typing span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        .chatbot-input {
            display: flex;
            gap: 6px;
            padding: 10px 10px 10px 10px;
            background: white;
            border-top: 1px solid #e2e8f0;
        }

        .chatbot-input input {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 8px 12px;
            font-size: 13px;
            outline: none;
            transition: border-color 0.2s;
        }

        .chatbot-input input:focus {
            border-color: #667eea;
        }

        .chatbot-send-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chatbot-send-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .chatbot-send-btn:active {
            transform: scale(0.95);
        }

        @media (max-width: 480px) {
            .chatbot-widget {
                bottom: 6px;
                right: 6px;
            }
            .chatbot-window {
                width: calc(100vw - 8px);
                height: calc(100vh - 60px);
                bottom: 54px;
                right: -4px;
            }
        }
    `;

    // Widget Controller
    window.chatbotWidget = {
        sessionId: null,
        isOpen: false,

        init: function() {
            // Inject CSS
            const style = document.createElement('style');
            style.textContent = widgetCSS;
            document.head.appendChild(style);

            // Inject HTML
            const div = document.createElement('div');
            div.innerHTML = widgetHTML;
            document.body.appendChild(div.firstElementChild);

            // Generate session ID
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            // Setup event listeners
            document.getElementById('chatbotToggle').addEventListener('click', () => this.toggle());

            // Load saved messages
            this.loadMessages();
        },

        toggle: function() {
            const window = document.getElementById('chatbotWindow');
            const badge = document.getElementById('chatbotBadge');
            
            if (this.isOpen) {
                window.style.display = 'none';
                this.isOpen = false;
            } else {
                window.style.display = 'flex';
                this.isOpen = true;
                badge.style.display = 'none';
                document.getElementById('chatbotInput').focus();
            }
        },

        minimize: function() {
            this.toggle();
        },

        sendMessage: async function() {
            const input = document.getElementById('chatbotInput');
            const message = input.value.trim();

            if (!message) return;

            // Add user message
            this.addMessage(message, 'user');
            input.value = '';

            // Show typing indicator
            document.getElementById('chatbotTyping').style.display = 'flex';

            try {
                const response = await fetch(`${API_URL}/chatbot/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message,
                        session_id: this.sessionId,
                        context: window.location.pathname
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    this.addMessage(data.message, 'bot');
                    
                    // If documents are found, show them
                    if (data.documents && data.documents.length > 0) {
                        this.addDocuments(data.documents);
                    }
                } else {
                    this.addMessage('Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau. 😔', 'bot');
                }
            } catch (error) {
                console.error('Chatbot error:', error);
                this.addMessage('Không thể kết nối đến server. Vui lòng thử lại sau.', 'bot');
            } finally {
                document.getElementById('chatbotTyping').style.display = 'none';
            }

            this.saveMessages();
        },

        sendSuggestion: function(text) {
            document.getElementById('chatbotInput').value = text;
            this.sendMessage();
        },

        addMessage: function(text, sender) {
            const messagesDiv = document.getElementById('chatbotMessages');
            
            // Remove welcome message if exists
            const welcome = messagesDiv.querySelector('.chatbot-welcome');
            if (welcome) welcome.remove();

            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${sender}`;
            messageDiv.innerHTML = `<div class="message-bubble">${this.escapeHtml(text)}</div>`;
            
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            // Show badge if window is closed
            if (!this.isOpen && sender === 'bot') {
                document.getElementById('chatbotBadge').style.display = 'flex';
            }
        },

        addDocuments: function(documents) {
            const messagesDiv = document.getElementById('chatbotMessages');
            
            const docsDiv = document.createElement('div');
            docsDiv.className = 'chatbot-documents';
            
            let html = '<div class="documents-container">';
            documents.forEach(doc => {
                html += `
                    <a href="${doc.url}" target="_blank" class="document-card">
                        <div class="doc-icon">📄</div>
                        <div class="doc-info">
                            <h4>${this.escapeHtml(doc.title)}</h4>
                            <p class="doc-meta">
                                <span>📚 ${this.escapeHtml(doc.subject || 'N/A')}</span>
                                <span>👁️ ${doc.views || 0}</span>
                                <span>⬇️ ${doc.downloads || 0}</span>
                            </p>
                            ${doc.description ? `<p class="doc-desc">${this.escapeHtml(doc.description.substring(0, 80))}...</p>` : ''}
                        </div>
                        <div class="doc-arrow">→</div>
                    </a>
                `;
            });
            html += '</div>';
            
            docsDiv.innerHTML = html;
            messagesDiv.appendChild(docsDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        },

        clearChat: function() {
            if (!confirm('Bạn có chắc muốn xóa lịch sử chat?')) return;

            const messagesDiv = document.getElementById('chatbotMessages');
            messagesDiv.innerHTML = `
                <div class="chatbot-welcome">
                    <div class="chatbot-welcome-icon">👋</div>
                    <h4>Xin chào!</h4>
                    <p>Tôi là trợ lý AI. Tôi có thể giúp bạn tìm tài liệu, trả lời câu hỏi về môn học và hướng dẫn sử dụng website.</p>
                    
                    <div class="chatbot-suggestions">
                        <button class="suggestion-chip" onclick="chatbotWidget.sendSuggestion(this.textContent)">
                            Tìm tài liệu về lập trình
                        </button>
                        <button class="suggestion-chip" onclick="chatbotWidget.sendSuggestion(this.textContent)">
                            Có môn nào hay không?
                        </button>
                        <button class="suggestion-chip" onclick="chatbotWidget.sendSuggestion(this.textContent)">
                            Hướng dẫn upload tài liệu
                        </button>
                    </div>
                </div>
            `;

            localStorage.removeItem('chatbot_messages_' + this.sessionId);
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },

        saveMessages: function() {
            const messagesDiv = document.getElementById('chatbotMessages');
            const messages = Array.from(messagesDiv.querySelectorAll('.chatbot-message')).map(msg => ({
                text: msg.querySelector('.message-bubble').textContent,
                sender: msg.classList.contains('user') ? 'user' : 'bot'
            }));
            localStorage.setItem('chatbot_messages_' + this.sessionId, JSON.stringify(messages));
        },

        loadMessages: function() {
            const saved = localStorage.getItem('chatbot_messages_' + this.sessionId);
            if (saved) {
                const messages = JSON.parse(saved);
                messages.forEach(msg => this.addMessage(msg.text, msg.sender));
            }
        },

        escapeHtml: function(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => chatbotWidget.init());
    } else {
        chatbotWidget.init();
    }
})();
