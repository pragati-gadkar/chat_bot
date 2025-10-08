(function() {
    // =================================================================
    // 0. ABSOLUTE PATH DEFINITIONS (CRITICAL FIX)
    // =================================================================
    // THIS MUST BE THE CORRECT, LIVE RAILWAY DOMAIN
    const BASE_URL = 'https://chatbot-production-1e94.up.railway.app/';
    const BASE_ASSET_URL = BASE_URL + 'assets/';
    
    // =================================================================
    // 1. EMBEDDED CSS, HTML, and Global Dependencies
    // =================================================================

    // PASTE THE MINIFIED CONTENT OF style.css HERE
    const WIDGET_CSS = `
  /* Reset + base */
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: 'Roboto', sans-serif;
    background-color: #f8f9fa;
    color: #212529;
    line-height: 1.6;
    font-size: 18px; /* reduced from 22px */
}
/* ✅ MODIFIED GLOBAL RESPONSIVENESS */
html, body { 
    width: 100%; 
    height: 100%; 
    margin: 0; 
    padding: 0; 
    overflow-x: hidden; 
}
/* END OF MODIFICATION */

/* Floating Chat Image */
.chat-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  cursor: pointer;
  z-index: 1000;
  transition: transform .2s ease;
}
.chat-toggle:hover { transform: scale(1.05); }
.chat-toggle img {
  width: 130px; /* reduced from 160px */
  height: auto;
  object-fit: contain;
  display: block;
}

/* Chat container - Main wrapper */
#chatContainer {
  position: fixed;
  bottom: 100px;   /* slightly lifted */
  right: 20px;
  z-index: 999;
  display: none;
  justify-content: flex-end; /* Align chatbox to the right */
  max-width: 420px; /* New: Set a sensible max-width */
  width: 90vw;      /* New: Make it responsive up to max-width */
  height: 550px;    /* New: Adjusted height */
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
#chatContainer.show { display: flex; opacity: 1; transform: translateY(0); }

/* Chatbox container - The actual box */
.chat-container {
  width: 100%; /* Now takes full width of #chatContainer */
  max-width: 100%;
  background: linear-gradient(135deg, #c0e2f5, #c5edfb, #ddf7fc, #f4fdff);
  border-radius: 1rem;
  box-shadow: 0 12px 30px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  height: 100%; /* Takes full height of #chatContainer */
  overflow: hidden;
  font-size: 14px; /* Scaled text down slightly for widget */
  /* REMOVED: transform: translateX(50px) scale(0.75); */
  transform-origin: top right;
}

/* Header */
.chat-header {
  background: linear-gradient(135deg, #0077b6, #0096c7, #00b4d8, #90e0ef);
  padding: 1rem;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
}
.header-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.3rem;  /* reduced from 1.6rem */
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color .2s;
}
.header-button:hover { background-color: rgba(255,255,255,0.15); }
.icon { width: 1.5rem; height: 1.5rem; }
.header-content { display: flex; align-items: center; flex: 1; margin: 0 0.6rem; }
.header-text { text-align: center; flex: 1; }
.hospital-name { font-weight: bold; font-size: 1.4rem; color: white; } /* Adjusted size */
.support-text { font-size: 1rem; color: #f9f9f9; } /* Adjusted size */

/* Hospital logo inside white circle */
.hospital-logo-container {
    width: 50px; /* Adjusted size */
    height: 50px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.6rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    overflow: hidden;
}
.hospital-logo {
    width: 85%;
    height: 85%;
    object-fit: contain;
    display: block;
}

/* Doctor Profile with white circle */
.doctor-profile {
  display: flex;
  justify-content: center;
  padding: 0.8rem;
  background: linear-gradient(90deg, #e8ecee, #fcfcfc, #fafafa);
}
.doctor-avatar-container {
  width: 80px;  /* Adjusted size */
  height: 80px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.doctor-avatar {
  width: 70px; /* Adjusted size */
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

/* Chat Messages Area */
.chat-messages {
  flex: 1;
  padding: 0.8rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 16px; /* consistent message font size */
  background: linear-gradient(90deg, #e8ecee, #fcfcfc, #fafafa);
}

/* Message Styles */
.message { display: flex; align-items: flex-start; gap: 0.6rem; }
.message.user { justify-content: flex-end; }

/* Bot & User icons */
.bot-icon, .user-icon {
  width: 2rem; /* Adjusted size */
  height: 2rem;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.bot-icon img, .user-icon img {
  width: 1.8rem; /* Adjusted size */
  height: 1.8rem;
  object-fit: contain;
}

/* Chat bubbles */
.chat-bubble-bot, .chat-bubble-user {
  font-size: 16px; /* consistent message font size */
}
.chat-bubble-bot {
  background: linear-gradient(135deg, #ffffff, #f0f7fb, #e6f0f5);
  border-radius: 18px 18px 18px 6px;
  padding: 14px 18px;
  max-width: 90%;
  line-height: 1.5;
  color: #212529;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.chat-bubble-user {
  background: linear-gradient(135deg, #ffffff, #edf6fa, #dfeef7);
  color: #212529;
  border-radius: 18px 18px 6px 18px;
  padding: 12px 16px;
  max-width: 80%;
  line-height: 1.5;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* ✅ FIXED: Remove default margins from HTML elements inside bot bubbles */
.chat-bubble-bot p {
  margin: 0;
  margin-bottom: 0.5em;
}

.chat-bubble-bot p:last-child {
  margin-bottom: 0;
}

.chat-bubble-bot h1,
.chat-bubble-bot h2,
.chat-bubble-bot h3,
.chat-bubble-bot h4,
.chat-bubble-bot h5,
.chat-bubble-bot h6 {
  margin: 0;
  margin-bottom: 0.5em;
  font-size: inherit;
  font-weight: 600;
}

.chat-bubble-bot h1:last-child,
.chat-bubble-bot h2:last-child,
.chat-bubble-bot h3:last-child,
.chat-bubble-bot h4:last-child,
.chat-bubble-bot h5:last-child,
.chat-bubble-bot h6:last-child {
  margin-bottom: 0;
}

/* ✅ FIXED: Ensure lists have proper spacing without extra margins */
.chat-bubble-bot ul,
.chat-bubble-bot ol {
  margin: 0;
  margin-bottom: 0.5em;
  padding-left: 1.2em;
}

.chat-bubble-bot ul:last-child,
.chat-bubble-bot ol:last-child {
  margin-bottom: 0;
}

.chat-bubble-bot ul li,
.chat-bubble-bot ol li {
  margin: 0;
  margin-bottom: 0.2em;
  line-height: 1.4;
}

.chat-bubble-bot ul li:last-child,
.chat-bubble-bot ol li:last-child {
  margin-bottom: 0;
}

/* ✅ FIXED: Remove extra space from blockquotes */
.chat-bubble-bot blockquote {
  margin: 0;
  margin-bottom: 0.5em;
  padding-left: 1em;
  border-left: 3px solid #ddd;
  font-style: italic;
}

.chat-bubble-bot blockquote:last-child {
  margin-bottom: 0;
}

/* ✅ FIXED: Fix spacing for code blocks */
.chat-bubble-bot pre,
.chat-bubble-bot code {
  margin: 0;
  font-size: 0.9em;
  font-family: 'Courier New', monospace;
}

.chat-bubble-bot pre {
  margin-bottom: 0.5em;
  padding: 0.5em;
  background-color: #f5f5f5;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-bubble-bot pre:last-child {
  margin-bottom: 0;
}

.chat-bubble-bot code {
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

/* ✅ FIXED: Handle strong/em tags properly */
.chat-bubble-bot strong,
.chat-bubble-bot b {
  font-weight: 600;
}

.chat-bubble-bot em,
.chat-bubble-bot i {
  font-style: italic;
}

/* ✅ FIXED: Handle line breaks properly */
.chat-bubble-bot br {
  line-height: 0.5;
}

/* Category Buttons */
.category-buttons { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.category-button {
  background: linear-gradient(90deg, #0096c7, #00b4d8);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 8px 16px; /* Adjusted size */
  font-size: 16px; /* Adjusted size */
  font-weight: 500;
  cursor: pointer;
  transition: all .2s ease;
}
.category-button:hover {
  background: linear-gradient(90deg, #0077b6, #0096c7);
  transform: translateY(-2px);
}

/* Input Area */
.message-input-area {
  padding: 0.8rem;
  background-color: rgba(255,255,255,0.9);
  border-top: 1px solid #e5e7eb;
}
.input-container { display: flex; gap: 0.6rem; }
.message-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  font-size: 16px; /* Adjusted size */
}
.send-button {
  width: 2.2rem; /* Adjusted size */
  height: 2.2rem;
  background-color: white;
  border: 2px solid #0077b6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all .2s;
}
.send-button img { width: 18px; height: 18px; object-fit: contain; } /* Adjusted size */
.send-button:disabled { cursor: not-allowed; }

/* Menu Popup */
.menu-popup {
  position: absolute;
  top: 60px;
  right: 12px;
  background: white;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: none;
  width: 180px;
  z-index: 100;
}
.menu-popup.show { display: block; }
.menu-item {
  display: block;
  padding: 8px 12px;
  font-size: 16px; /* Adjusted size */
  color: #333;
  text-decoration: none;
  cursor: pointer;
  transition: background .2s;
}
.menu-item:hover { background: #f0f0f0; }

/* Typing Indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background-color: rgba(255,255,255,0.9);
  border-radius: 18px 18px 18px 6px;
  gap: 5px;
  max-width: 70px;
}
.typing-indicator span {
  height: 8px;
  width: 8px;
  background-color: #666;
  border-radius: 50%;
  display: inline-block;
  animation: typingBounce 1.4s infinite ease-in-out;
}
.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
.typing-indicator span:nth-child(3) { animation-delay: 0; }

@keyframes typingBounce {
  0%,80%,100% { transform: scale(.6); opacity: .4; }
  40% { transform: scale(1); opacity: 1; }
}

/* Animations */
.chat-bubble-animated { animation-duration: 0.45s; animation-fill-mode: both; animation-timing-function: ease-out; }
.message.bot .chat-bubble-animated { animation-name: slideInLeft; }
.message.user .chat-bubble-animated { animation-name: slideInRight; }

@keyframes slideInLeft {
  0% { opacity: 0; transform: translateX(-30px) scale(0.95); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes slideInRight {
  0% { opacity: 0; transform: translateX(30px) scale(0.95); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}

/* ✅ Responsive adjustments */

/* Tablet (max-width: 1024px) - Covers iPad Mini, Air, Pro, Surface Pro 7, Asus Zenbook Fold */
@media (max-width: 1024px) {
  #chatContainer {
    max-width: 400px; /* New: Slightly smaller max-width */
    right: 15px;
    bottom: 80px;
    height: 500px; /* Adjusted height */
    transform: scale(1); /* New: IMPORTANT - Remove scaling for standard tablet view */
    transform-origin: bottom right;
  }
  .chat-toggle img {
    width: 100px; /* Adjusted size */
  }
}

/* Mobile (max-width: 768px) - Covers smaller devices like Nest Hub Max, and large phones */
@media (max-width: 768px) {
  #chatContainer {
    width: 90%;
    right: 2.5%;
    bottom: 20px;
    height: 480px;
    max-width: 100%; /* Allow it to grow if needed */
  }
  .chat-container {
    font-size: 14px;
  }
  .chat-toggle img {
    width: 90px;
  }
}

/* Small Mobile (fullscreen chat) - Covers small phones */
@media (max-width: 480px) {
  #chatContainer {
    width: 100%;
    right: 0;
    bottom: 0;
    border-radius: 0;
    height: 100vh; /* Full screen */
    transform: scale(1);
  }
  .chat-container {
    height: 100vh;
    border-radius: 0;
    font-size: 16px; /* Slightly larger text for full screen */
  }
  .chat-toggle {
    bottom: 16px;
    right: 16px;
  }
  .chat-toggle img {
    width: 70px;
  }
}

/* mobile updated css */

/* 📱 Small Mobile (half-screen chat at bottom) */
@media (max-width: 480px) {
  #chatContainer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;

    width: 100%;
    height: 60vh;   /* ✅ only half of the screen */
    border-radius: 1rem 1rem 0 0; /* rounded top corners */
    transform: scale(1);
    margin: 0;
  }

  .chat-container {
    height: 100%;
    border-radius: 1rem 1rem 0 0;
    font-size: 15px;
    display: flex;
    flex-direction: column;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;  /* ✅ scroll only inside messages */
    -webkit-overflow-scrolling: touch;
  }

  .chat-toggle {
    bottom: 16px;
    right: 16px;
  }

  .chat-toggle img {
    width: 70px;
  }
}
    `;

    // PASTE THE ENTIRE CHAT WIDGET HTML HERE (from index.html)
    const WIDGET_HTML = `
      <div class="chat-toggle" id="chatToggle" title="Open chat">
        <img src="${BASE_ASSET_URL}chat bot icon.png" alt="Sainath Chatbot" />
      </div>
      <div class="app-container" id="chatContainer">
        <div class="chat-container">
          <div class="chat-header" data-testid="chat-header">
            <div class="header-content">
              <div class="hospital-logo-container">
                <img src="${BASE_ASSET_URL}hospital icon.png" alt="Sainath Hospital" class="hospital-logo" />
              </div>
              <div class="header-text">
                <div class="hospital-name">Sainath Care</div>
                <div class="support-text">Virtual Assistant</div>
              </div>
            </div>
            <button class="header-button" data-testid="menu-button">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
            <div class="menu-popup" id="menuPopup">
              <div class="menu-item" id="refreshChat">Refresh Chat</div>
              <a class="menu-item" href="https://maps.google.com?q=Sainath+Hospital+Moshi,Pune" target="_blank">Google Map</a>
              <a class="menu-item" href="tel:+911234567890">Contact</a>
              <div class="menu-item" id="backToMenu">Back to Menu</div>
            </div>
            <button class="header-button" id="closeChat">✖</button>
          </div>
          <div class="doctor-profile" data-testid="doctor-profile">
            <img src="${BASE_ASSET_URL}doctor-circle.png" alt="Professional doctor" class="doctor-avatar" />
          </div>
          <div class="chat-messages" data-testid="chat-messages" id="chatMessages"></div>
          <div class="message-input-area" data-testid="message-input-area">
            <div class="input-container">
              <input type="text" id="messageInput" placeholder="Type your question..."
                     class="message-input" disabled data-testid="message-input" />
              <button class="send-button" id="sendButton" disabled data-testid="send-button">
                <img src="${BASE_ASSET_URL}send-message.png" alt="Send" class="send-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Helper to load external scripts like Marked.js
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    // =================================================================
    // 2. BUBBLE FUNCTIONS (from bubble.js)
    // =================================================================

    /* Create a chat bubble for the user */
    function createUserBubble(text) {
        const wrapper = document.createElement("div");
        wrapper.className = "message user";
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble-user chat-bubble-animated";
        bubble.textContent = text;
        const icon = document.createElement("div");
        icon.className = "user-icon";
        icon.innerHTML = `<img src="${BASE_ASSET_URL}user-icon.png" alt="You" />`;
        wrapper.appendChild(bubble);
        wrapper.appendChild(icon);
        return wrapper;
    }

    /* Create a chat bubble for the bot */
    function createBotBubble(text, isHTML = false) {
        const wrapper = document.createElement("div");
        wrapper.className = "message bot";
        const icon = document.createElement("div");
        icon.className = "bot-icon";
        icon.innerHTML = `<img src="${BASE_ASSET_URL}bot icon.png" alt="Sainath Bot" />`;
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble-bot chat-bubble-animated";
        bubble[isHTML ? "innerHTML" : "textContent"] = text;
        bubble.style.whiteSpace = "pre-wrap";
        bubble.style.wordBreak = "break-word";
        wrapper.appendChild(icon);
        wrapper.appendChild(bubble);
        return wrapper;
    }

    /* Create a typing indicator bubble */
    function createTypingBubble() {
        const wrapper = document.createElement("div");
        wrapper.className = "message bot typing-message";
        const icon = document.createElement("div");
        icon.className = "bot-icon";
        icon.innerHTML = `<img src="${BASE_ASSET_URL}bot icon.png" alt="Sainath Bot" />`;
        const bubble = document.createElement("div");
        bubble.className = "typing-indicator chat-bubble-animated";
        bubble.innerHTML = `<span></span><span></span><span></span>`;
        wrapper.appendChild(icon);
        wrapper.appendChild(bubble);
        return wrapper;
    }

    // =================================================================
    // 3. CHATBOT CLASS (from script.js)
    // =================================================================

    class Chatbot {
        constructor() {
            this.messages = [];
            this.isTyping = false;
            this.inputEnabled = false;
            
            // ✅ API URL assignment using the global BASE_URL
            this.apiBaseUrl = BASE_URL + 'chat.php'; 
            this.saveAppointmentUrl = BASE_URL + 'save_appointment.php'; 
            this.appointmentStep = 0;
            this.appointmentData = {};

            // DOM elements must exist when constructor runs, so we get them here
            this.chatMessages = document.getElementById('chatMessages');
            this.messageInput = document.getElementById('messageInput');
            this.sendButton = document.getElementById('sendButton');

            this.initializeEventListeners();
            this.initializeChatbot();
        }

        initializeEventListeners() {
            // Check if elements exist before adding listeners
            if (this.sendButton) {
                this.sendButton.addEventListener('click', () => this.handleSendMessage());
            }
            if (this.messageInput) {
                this.messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.handleSendMessage();
                });
                this.messageInput.addEventListener('input', () => {
                    this.sendButton.disabled = !this.inputEnabled || !this.messageInput.value.trim();
                });
            }

            // Chat Toggle/Menu listeners (now inside the class scope)
            const menuButton = document.querySelector('[data-testid="menu-button"]');
            const menuPopup = document.getElementById('menuPopup');
            const chatToggle = document.getElementById('chatToggle');
            const chatContainer = document.getElementById('chatContainer');
            const closeChat = document.getElementById('closeChat');
            const refreshChat = document.getElementById('refreshChat');
            const backToMenu = document.getElementById('backToMenu');
            
            if(menuButton) menuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if(menuPopup) menuPopup.classList.toggle('show');
            });
            
            document.addEventListener('click', (e) => {
                if (menuPopup && !menuPopup.contains(e.target) && !menuButton.contains(e.target)) {
                    menuPopup.classList.remove('show');
                }
            });

            if(refreshChat) refreshChat.addEventListener('click', () => location.reload());

            if(backToMenu) backToMenu.addEventListener('click', () => {
                this.chatMessages.innerHTML = "";
                this.inputEnabled = false;
                this.messageInput.disabled = true;
                this.addMessage("Hello! How can I help you today at Sainath Hospital?", true);
                this.inputEnabled = true;
                this.messageInput.disabled = false;
                if(menuPopup) menuPopup.classList.remove('show');
            });

            if(chatToggle) chatToggle.addEventListener('click', () => {
                if(chatContainer) chatContainer.classList.add('show');
                chatToggle.style.display = 'none';
            });

            if(closeChat) closeChat.addEventListener('click', () => {
                if(chatContainer) chatContainer.classList.remove('show');
                if(chatToggle) chatToggle.style.display = 'block';
            });
        }

        scrollToBottom() {
            setTimeout(() => {
                if(this.chatMessages) this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }, 100);
        }

        addMessage(content, isBot, isHTML = false) {
            const bubble = isBot
                ? createBotBubble(content, isHTML)
                : createUserBubble(content);
            if(this.chatMessages) this.chatMessages.appendChild(bubble);
            this.scrollToBottom();
        }

        setTyping(typing) {
            const existing = document.querySelector('.typing-message');
            if (existing) existing.remove();

            if (typing) {
                const bubble = createTypingBubble();
                if(this.chatMessages) this.chatMessages.appendChild(bubble);
                this.scrollToBottom();
            }
        }

        processMarkdownText(text) {
            if (typeof marked === 'undefined') return text; // Fallback if Marked.js didn't load
            if (!text) return '';
            let cleanedText = text.replace(/\n\n+/g, '\n\n').trim();
            let htmlContent = marked.parse(cleanedText);

            if (!cleanedText.includes('\n\n') && !cleanedText.includes('*') && !cleanedText.includes('#')) {
                htmlContent = cleanedText;
            } else {
                htmlContent = htmlContent
                    .replace(/^<p>|<\/p>$/g, '')
                    .replace(/<p><\/p>/g, '')
                    .replace(/\s+<\/p>/g, '</p>')
                    .replace(/<p>\s+/g, '<p>')
                    .trim();
            }

            return htmlContent;
        }

        isAppointmentTrigger(text) {
            if (!text) return false;
            const t = text.toLowerCase();
            const triggers = [
                "book appointment","book an appointment","book a appointment","book appoinment","apointment",
                "schedule appointment","i want to book","i want appointment","book apointment",
                "need appointment","want to schedule","want to book",
                "can i book","can i schedule","reserve appointment",
                "make appointment","set up appointment","arrange appointment",
                "request appointment","book my appointment","schedule my appointment",
                "i need to book","i need appointment","i want to see doctor",
                "i want to meet doctor","doctor appointment","schedule a meeting",
                "book doctor","i need doctor appointment","appointment"
            ];
            return triggers.some(tr => new RegExp(`\\b${tr}\\b`, 'i').test(t));
        }

        startAppointmentFlow() {
            this.appointmentStep = 1;
            this.appointmentData = {};
            this.addMessage("Sure — I can help book an appointment. Please provide your full name.", true);
        }

        validatePhone(raw) {
            const digits = String(raw).replace(/\D/g, '');
            return /^\d{10}$/.test(digits);
        }

        async sendAppointmentData() {
            try {
                this.setTyping(true);
                // Use the new saveAppointmentUrl property
                const response = await fetch(this.saveAppointmentUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.appointmentData)
                });
                const result = await response.json();
                this.setTyping(false);

                if (result && result.status === 'success') {
                    this.addMessage("Thank you — your appointment request is saved. Our team will contact you soon for booking.", true);
                } else {
                    console.error('Save appointment error:', result);
                    this.addMessage("There was an error saving your appointment. Please try again later.", true);
                }
            } catch (err) {
                this.setTyping(false);
                console.error(err);
                this.addMessage("Failed to save appointment. Please try again later.", true);
            }
        }

        async handleAppointmentFlow(userInput) {
            if (this.appointmentStep === 1) {
                const name = userInput.trim();
                if (!name || !/^[a-zA-Z\s]+$/.test(name)) {
                    this.addMessage("Please enter a valid full name (letters and spaces only).", true);
                    return;
                }
                this.appointmentData.name = name;
                this.appointmentStep = 2;
                this.addMessage("Got it. Please share your contact number (10 digits).", true);
                return;
            }

            if (this.appointmentStep === 2) {
                const digits = String(userInput).replace(/\D/g, '');
                if (!this.validatePhone(digits)) {
                    this.addMessage("Please enter a valid 10-digit contact number (example: 9876543210).", true);
                    return;
                }
                this.appointmentData.contact = digits;
                this.appointmentStep = 3;
                this.addMessage("Thanks! Lastly, give a short reason for the appointment (e.g., knee pain).", true);
                return;
            }

            if (this.appointmentStep === 3) {
                const reason = userInput.trim();
                if (!reason || reason.length > 200) {
                    this.addMessage("Please provide a brief reason for the appointment (max 200 characters).", true);
                    return;
                }
                this.appointmentData.reason = reason;
                await this.sendAppointmentData();
                this.appointmentStep = 0;
                this.appointmentData = {};
            }
        }

        async sendQuestionToAPI(question) {
            try {
                const response = await fetch(this.apiBaseUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: "u2", question })
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error('Error sending question:', error);
                return null;
            }
        }

        async sendQuestionWithAPI(question) {
            this.setTyping(true);
            try {
                const data = await this.sendQuestionToAPI(question);
                this.setTyping(false);

                if (data && data.answer) {
                    const processedAnswer = this.processMarkdownText(data.answer);
                    const isHTML = processedAnswer !== data.answer.trim();
                    this.addMessage(processedAnswer, true, isHTML);
                } else {
                    this.addMessage("I couldn't find a relevant answer. (If this issue persists, please check the 'chat.php' connection to the external AI API.)", true);
                }
            } catch {
                this.setTyping(false);
                this.addMessage("Sorry, I'm having trouble connecting to the server.", true);
            }
        }

        async initializeChatbot() {
            setTimeout(() => {
                const hour = new Date().getHours();
                let greeting;
                if (hour < 12) greeting = "Good morning! 🌞 Welcome to Sainath Hospital. How may I assist you today?";
                else if (hour < 17) greeting = "Good afternoon! ☀️ How may I support you at Sainath Hospital?";
                else if (hour < 21) greeting = "Good evening! 🌆 Welcome to Sainath Hospital Chat Support. How can I help you?";
                else greeting = "Hello! 🌙 Even though it's late, I'm here to help you with your queries at Sainath Hospital.";
                this.addMessage(greeting, true);
                this.inputEnabled = true;
                if(this.messageInput) this.messageInput.disabled = false;
            }, 500);
        }

        async handleSendMessage() {
            if (!this.messageInput.value.trim() || !this.inputEnabled) return;
            const question = this.messageInput.value.trim();

            this.addMessage(question, false);
            this.messageInput.value = '';

            if (this.appointmentStep > 0) {
                await this.handleAppointmentFlow(question);
                return;
            }

            if (this.isAppointmentTrigger(question)) {
                this.startAppointmentFlow();
                return;
            }

            await this.sendQuestionWithAPI(question);
        }
    }

    // =================================================================
    // 4. WIDGET INITIALIZATION & INJECTION
    // =================================================================
    function initSainathChatbot() {
        // 1. Inject CSS
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = WIDGET_CSS;
        document.head.appendChild(style);

        // 2. Inject HTML
        const container = document.createElement('div');
        container.innerHTML = WIDGET_HTML;
        document.body.appendChild(container);
        
        // 3. Initialize Chatbot
        // Load Marked.js first, then initialize the Chatbot class
        loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js', () => {
             window.chatbot = new Chatbot();
        });
    }

    // Run initialization logic when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSainathChatbot);
    } else {
        initSainathChatbot();
    }
})();