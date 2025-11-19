// =============================================
// CHATBOT WIDGET - Enhanced Version
// File: chatbot-widget.js
// Floating chatbot widget for DocShare
// =============================================

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================
    const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api' 
        : '/api';

    // ========================================
    // WIDGET HTML
    // ========================================
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
                        <button class="chatbot-header-btn" onclick="chatbotWidget.openFullScreen()" title="Mở rộng">
                            🔲
                        </button>
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
                        <p>Tôi là trợ lý AI của DocShare. Tôi có thể:</p>
                        <div class="welcome-features">
                            <div>🔍 Tìm tài liệu học tập</div>
                            <div>📤 Upload file tự động</div>
                            <div>💬 Trả lời câu hỏi</div>
                        </div>
                        
                        <div class="chatbot-suggestions">
                            <button class="suggestion-chip" onclick="chatbotWidget.sendSuggestion(this.textContent)">
                                Tìm tài liệu về Toán
                            </button>
                            <button class="suggestion-chip" onclick="chatbotWidget.sendSuggestion(this.textContent)">
                                Tìm tài liệu lập trình
                            </button>
                            <button class="suggestion-chip" onclick="chatbotWidget.sendSuggestion(this.textContent)">
                                Hướng dẫn sử dụng
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

                <!-- File Preview -->
                <div id="chatbotFilePreview" class="chatbot-file-preview" style="display: none;">
                    <div class="file-preview-content">
                        <span class="file-icon">📄</span>
                        <span class="file-name" id="chatbotFileName">file.pdf</span>
                        <button class="file-remove" onclick="chatbotWidget.removeFile()" title="Xóa">×</button>
                    </div>
                </div>

                <!-- Input -->
                <div class="chatbot-input">
                    <label class="chatbot-file-btn" title="Gửi file">
                        <input type="file" id="chatbotFileInput" style="display: none;" 
                               accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                               onchange="chatbotWidget.handleFileSelect(event)"/>
                        📎
                    </label>
                    <input 
                        type="text" 
                        id="chatbotInput" 
                        placeholder="Nhập câu hỏi hoặc gửi file..."
                        onkeypress="if(event.key==='Enter') chatbotWidget.sendMessage()"
                    />
                    <button onclick="chatbotWidget.sendMessage()" class="chatbot-send-btn" id="chatbotSendBtn">
                        <span>📤</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    // ========================================
    // WIDGET CSS
    // ========================================
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
            width: 350px;
            max-width: calc(100vw - 24px);
            height: 500px;
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
            padding: 12px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chatbot-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .chatbot-avatar {
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }

        .chatbot-header-info h3 {
            margin: 0;
            font-size: 15px;
            font-weight: 600;
        }

        .chatbot-status {
            margin: 2px 0 0 0;
            font-size: 11px;
            opacity: 0.9;
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
            background: rgba(255, 255, 255, 0.2);
            border: none;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
            color: white;
        }

        .chatbot-header-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 14px 12px;
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
            padding: 10px 0;
        }

        .chatbot-welcome-icon {
            font-size: 40px;
            margin-bottom: 12px;
        }

        .chatbot-welcome h4 {
            margin: 0 0 8px 0;
            color: #1e293b;
            font-size: 17px;
            font-weight: 600;
        }

        .chatbot-welcome p {
            margin: 0 0 12px 0;
            color: #64748b;
            font-size: 13px;
            line-height: 1.5;
        }

        .welcome-features {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 14px;
            font-size: 12px;
            color: #475569;
        }

        .welcome-features div {
            background: white;
            padding: 6px 10px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }

        .chatbot-suggestions {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .suggestion-chip {
            background: white;
            border: 1px solid #e2e8f0;
            padding: 10px 14px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 13px;
            color: #475569;
            transition: all 0.2s;
            text-align: left;
            font-weight: 500;
        }

        .suggestion-chip:hover {
            background: #667eea;
            color: white;
            border-color: #667eea;
            transform: translateX(4px);
        }

        .chatbot-message {
            margin-bottom: 14px;
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
            max-width: 85%;
            padding: 11px 14px;
            border-radius: 14px;
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
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
        }

        .chatbot-documents {
            margin: 12px 0;
        }

        .documents-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .document-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px;
            display: flex;
            gap: 10px;
            align-items: center;
            text-decoration: none;
            color: inherit;
            transition: all 0.2s;
            cursor: pointer;
        }

        .document-card:hover {
            border-color: #667eea;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
            transform: translateY(-2px);
        }

        .doc-icon {
            font-size: 28px;
            flex-shrink: 0;
        }

        .doc-info {
            flex: 1;
            min-width: 0;
        }

        .doc-info h4 {
            margin: 0 0 4px 0;
            font-size: 13px;
            font-weight: 600;
            color: #1e293b;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .doc-meta {
            display: flex;
            gap: 8px;
            font-size: 11px;
            color: #64748b;
        }

        .doc-meta span {
            display: flex;
            align-items: center;
            gap: 3px;
        }

        .doc-arrow {
            font-size: 18px;
            color: #667eea;
            flex-shrink: 0;
        }

        .chatbot-typing {
            padding: 10px 14px;
            display: flex;
            gap: 4px;
            align-items: center;
            background: #f8f9fa;
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

        .chatbot-file-preview {
            padding: 8px 12px;
            background: #f1f5f9;
            border-top: 1px solid #e2e8f0;
        }

        .file-preview-content {
            display: flex;
            align-items: center;
            gap: 8px;
            background: white;
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }

        .file-icon {
            font-size: 20px;
        }

        .file-name {
            flex: 1;
            font-size: 12px;
            color: #475569;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .file-remove {
            background: #ef4444;
            color: white;
            border: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
        }

        .chatbot-input {
            display: flex;
            gap: 6px;
            padding: 12px;
            background: white;
            border-top: 1px solid #e2e8f0;
            align-items: center;
        }

        .chatbot-file-btn {
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 18px;
            transition: all 0.2s;
        }

        .chatbot-file-btn:hover {
            background: #667eea;
            border-color: #667eea;
        }

        .chatbot-input input[type="text"] {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 9px 14px;
            font-size: 13px;
            outline: none;
            transition: border-color 0.2s;
        }

        .chatbot-input input[type="text"]:focus {
            border-color: #667eea;
        }

        .chatbot-send-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .chatbot-send-btn:hover {
            transform: scale(1.08);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .chatbot-send-btn:active {
            transform: scale(0.95);
        }

        .chatbot-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        @media (max-width: 480px) {
            .chatbot-widget {
                bottom: 10px;
                right: 10px;
            }
            .chatbot-window {
                width: calc(100vw - 20px);
                height: calc(100vh - 80px);
                bottom: 70px;
                right: -10px;
            }
        }
    `;

    // ========================================
    // WIDGET CONTROLLER
    // ========================================
    window.chatbotWidget = {
        sessionId: null,
        isOpen: false,
        selectedFile: null,

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
            this.sessionId = 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

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

        openFullScreen: function() {
            // Open full chatbot page
            window.open('./chatbotAI/chat.html', '_blank');
        },

        handleFileSelect: function(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Check file size (50MB max)
            if (file.size > 50 * 1024 * 1024) {
                alert('File quá lớn! Kích thước tối đa 50MB.');
                event.target.value = '';
                return;
            }

            this.selectedFile = file;
            document.getElementById('chatbotFileName').textContent = file.name;
            document.getElementById('chatbotFilePreview').style.display = 'block';
        },

        removeFile: function() {
            this.selectedFile = null;
            document.getElementById('chatbotFileInput').value = '';
            document.getElementById('chatbotFilePreview').style.display = 'none';
        },

        sendMessage: async function() {
            const input = document.getElementById('chatbotInput');
            const message = input.value.trim();

            // Check if we have file or message
            if (!this.selectedFile && !message) return;

            // Disable input
            const sendBtn = document.getElementById('chatbotSendBtn');
            input.disabled = true;
            sendBtn.disabled = true;

            try {
                if (this.selectedFile) {
                    // Upload file
                    await this.uploadFile(message || 'Upload tài liệu');
                } else {
                    // Regular chat
                    await this.chatMessage(message);
                }

                input.value = '';
                this.removeFile();

            } catch (error) {
                console.error('Send error:', error);
                this.addMessage('Có lỗi xảy ra. Vui lòng thử lại!', 'bot');
            } finally {
                input.disabled = false;
                sendBtn.disabled = false;
                input.focus();
            }
        },

        async uploadFile(message) {
            const token = localStorage.getItem('token');
            
            if (!token) {
                this.addMessage('Bạn cần đăng nhập để upload tài liệu!', 'bot');
                return;
            }

            // Add user message
            this.addMessage(`📤 ${message}\n📄 ${this.selectedFile.name}`, 'user');
            this.showTyping();

            const formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('session_id', this.sessionId);
            formData.append('message', message);

            try {
                const response = await fetch(`${API_URL}/chatbot/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const data = await response.json();
                this.hideTyping();

                if (response.ok) {
                    this.addMessage(data.message, 'bot');
                } else {
                    this.addMessage(data.message || 'Upload thất bại!', 'bot');
                }
            } catch (error) {
                this.hideTyping();
                console.error('Upload error:', error);
                this.addMessage('Không thể upload. Vui lòng thử lại!', 'bot');
            }
        },

        async chatMessage(message) {
            // Add user message
            this.addMessage(message, 'user');
            this.showTyping();

            try {
                const response = await fetch(`${API_URL}/chatbot/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    },
                    body: JSON.stringify({
                        message: message,
                        session_id: this.sessionId,
                        context: window.location.pathname
                    })
                });

                const data = await response.json();
                this.hideTyping();

                if (response.ok) {
                    this.addMessage(data.message, 'bot');
                    
                    // If documents are found, show them
                    if (data.documents && data.documents.length > 0) {
                        this.addDocuments(data.documents);
                    }
                } else {
                    this.addMessage('Xin lỗi, tôi gặp sự cố. Vui lòng thử lại! 😔', 'bot');
                }
            } catch (error) {
                this.hideTyping();
                console.error('Chat error:', error);
                this.addMessage('Không thể kết nối. Vui lòng thử lại sau.', 'bot');
            }

            this.saveMessages();
        },

        sendSuggestion: function(text) {
            document.getElementById('chatbotInput').value = text;
            this.sendMessage();
        },

        showTyping: function() {
            document.getElementById('chatbotTyping').style.display = 'flex';
            this.scrollToBottom();
        },

        hideTyping: function() {
            document.getElementById('chatbotTyping').style.display = 'none';
        },

        scrollToBottom: function() {
            const messagesDiv = document.getElementById('chatbotMessages');
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        },

        addMessage: function(text, sender) {
            const messagesDiv = document.getElementById('chatbotMessages');
            
            // Remove welcome message if exists
            const welcome = messagesDiv.querySelector('.chatbot-welcome');
            if (welcome) welcome.remove();

            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${sender}`;
            messageDiv.innerHTML = `<div class="message-bubble">${this.escapeHtml(text).replace(/\n/g, '<br>')}</div>`;
            
            messagesDiv.appendChild(messageDiv);
            this.scrollToBottom();

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
                // Construct URL based on document ID
                const docUrl = `./documents/detail.html?id=${doc.ma_tai_lieu}`;
                
                html += `
                    <a href="${docUrl}" target="_blank" class="document-card">
                        <div class="doc-icon">📄</div>
                        <div class="doc-info">
                            <h4>${this.escapeHtml(doc.tieu_de)}</h4>
                            <div class="doc-meta">
                                <span>📚 ${this.escapeHtml(doc.ten_mon_hoc || 'N/A')}</span>
                                <span>👁️ ${doc.luot_xem || 0}</span>
                                <span>⬇️ ${doc.luot_tai || 0}</span>
                            </div>
                        </div>
                        <div class="doc-arrow">→</div>
                    </a>
                `;
            });
            html += '</div>';
            
            docsDiv.innerHTML = html;
            messagesDiv.appendChild(docsDiv);
            this.scrollToBottom();
        },

        clearChat: function() {
            if (!confirm('Bạn có chắc muốn xóa lịch sử chat?')) return;

            const messagesDiv = document.getElementById('chatbotMessages');
            messagesDiv.innerHTML = `
                <div class="chatbot-welcome">
                    <div class="chatbot-welcome-icon">👋</div>
                    <h4>Xin chào!</h4>
                    <p>Tôi là trợ lý AI của DocShare. Tôi có thể:</p>
                    <div class="welcome-features">
                        <div>🔍 Tìm tài liệu học tập</div>
                        <div>📤 Upload file tự động</div>
                        <div>💬 Trả lời câu hỏi</div>
                    </div>
                    
                    <div class="chatbot-suggestions">
                        <button class="suggestion-chip" onclick="chatbotWidget.sendSuggestion(this.textContent)">
                            Tìm tài liệu về Toán
                        </button>
                        <button class="suggestion-chip" onclick="chatbotWidget.sendSuggestion(this.textContent)">
                            Tìm tài liệu lập trình
                        </button>
                        <button class="suggestion-chip" onclick="chatbotWidget.sendSuggestion(this.textContent)">
                            Hướng dẫn sử dụng
                        </button>
                    </div>
                </div>
            `;

            localStorage.removeItem('chatbot_messages_' + this.sessionId);
            this.sessionId = 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },

        saveMessages: function() {
            const messagesDiv = document.getElementById('chatbotMessages');
            const messages = Array.from(messagesDiv.querySelectorAll('.chatbot-message')).map(msg => ({
                text: msg.querySelector('.message-bubble').innerHTML.replace(/<br>/g, '\n'),
                sender: msg.classList.contains('user') ? 'user' : 'bot'
            }));
            localStorage.setItem('chatbot_messages_' + this.sessionId, JSON.stringify(messages));
        },

        loadMessages: function() {
            const saved = localStorage.getItem('chatbot_messages_' + this.sessionId);
            if (saved) {
                try {
                    const messages = JSON.parse(saved);
                    messages.forEach(msg => this.addMessage(msg.text, msg.sender));
                } catch (e) {
                    console.error('Load messages error:', e);
                }
            }
        },

        escapeHtml: function(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };

    // ========================================
    // AUTO-INIT
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => chatbotWidget.init());
    } else {
        chatbotWidget.init();
    }
})();