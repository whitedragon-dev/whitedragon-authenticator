// ============================================================
// WHITEDRAGON-AUTHENTICATOR - With Dark/Light Theme Toggle
// Theme preference saved in localStorage
// ============================================================

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Whitedragon Authenticator</title>
    <style>
        /* ========== CSS VARIABLES ========== */
        :root {
            /* Light Theme (Default) */
            --bg-primary: #f5f7fa;
            --bg-secondary: #ffffff;
            --bg-card: #ffffff;
            --bg-input: #f8f9fb;
            --bg-code: #f8f9fb;
            --bg-hover: #f0f2f5;
            --bg-modal-overlay: rgba(0, 0, 0, 0.4);
            
            --text-primary: #1a2332;
            --text-secondary: #4a5568;
            --text-muted: #8892a0;
            --text-light: #b0b8c0;
            
            --border-color: #e8ecf0;
            --border-hover: #d0d5dc;
            
            --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
            --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.15);
            
            --gradient-primary: linear-gradient(135deg, #f0b34b, #e8503a);
            --gradient-progress: linear-gradient(90deg, #4caf50, #ff9800, #f44336);
            
            --color-fresh: #2e7d32;
            --color-mid: #f57c00;
            --color-expiring: #c62828;
            
            --toast-bg: #1a2332;
            --toast-success: #2e7d32;
            --toast-error: #c62828;
            
            --scrollbar-track: transparent;
            --scrollbar-thumb: #d0d5dc;
            --scrollbar-thumb-hover: #b0b8c0;
        }
        
        /* ========== DARK THEME ========== */
        [data-theme="dark"] {
            --bg-primary: #0a0e17;
            --bg-secondary: #151e2f;
            --bg-card: #151e2f;
            --bg-input: #1a2332;
            --bg-code: #1a2332;
            --bg-hover: #1f2a3f;
            --bg-modal-overlay: rgba(0, 0, 0, 0.7);
            
            --text-primary: #e8eaf0;
            --text-secondary: #b0b8c0;
            --text-muted: #6b7a8a;
            --text-light: #4a5568;
            
            --border-color: #1f2a3f;
            --border-hover: #2a3a55;
            
            --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
            --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
            --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.6);
            
            --color-fresh: #4ade80;
            --color-mid: #fbbf24;
            --color-expiring: #e8503a;
            
            --toast-bg: #1f2a3f;
            --toast-success: #2e7d32;
            --toast-error: #c62828;
            
            --scrollbar-track: transparent;
            --scrollbar-thumb: #2a3a55;
            --scrollbar-thumb-hover: #3a4a6f;
        }
        
        /* ========== RESET & BASE ========== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            transition: background 0.3s ease, color 0.3s ease;
        }
        
        .container {
            max-width: 560px;
            width: 100%;
            margin: 0 auto;
        }
        
        /* ========== TRANSITIONS ========== */
        .account-card,
        .empty-state,
        .login-container,
        .modal,
        .code-container,
        .form-input,
        .header,
        .footer,
        .toast {
            transition: background 0.3s ease, 
                        color 0.3s ease, 
                        border-color 0.3s ease,
                        box-shadow 0.3s ease;
        }
        
        /* ========== LOGIN SCREEN ========== */
        .login-container {
            background: var(--bg-secondary);
            border-radius: 20px;
            padding: 40px 32px;
            max-width: 400px;
            width: 100%;
            margin: 0 auto;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
        }
        
        .login-logo {
            text-align: center;
            margin-bottom: 32px;
        }
        
        .login-logo .icon {
            font-size: 48px;
            display: block;
            margin-bottom: 12px;
        }
        
        .login-logo h1 {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-primary);
        }
        
        .login-logo p {
            font-size: 14px;
            color: var(--text-muted);
            margin-top: 4px;
        }
        
        .login-form .form-group {
            margin-bottom: 20px;
        }
        
        .login-form .form-label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: var(--text-secondary);
            margin-bottom: 6px;
        }
        
        .login-form .form-input {
            width: 100%;
            padding: 12px 16px;
            background: var(--bg-input);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            color: var(--text-primary);
            font-size: 15px;
            transition: all 0.2s ease;
            font-family: inherit;
        }
        
        .login-form .form-input:focus {
            outline: none;
            border-color: #f0b34b;
            background: var(--bg-secondary);
            box-shadow: 0 0 0 3px rgba(240, 179, 75, 0.1);
        }
        
        .login-form .form-input::placeholder {
            color: var(--text-light);
        }
        
        .login-btn {
            width: 100%;
            padding: 14px;
            background: var(--gradient-primary);
            border: none;
            border-radius: 10px;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 12px rgba(232, 80, 58, 0.2);
        }
        
        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(232, 80, 58, 0.3);
        }
        
        .login-btn:active {
            transform: translateY(0);
        }
        
        .login-error {
            background: #fff5f5;
            border: 1px solid #fecaca;
            color: #c62828;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 16px;
            display: none;
        }
        
        .login-error.show {
            display: block;
        }
        
        .login-hint {
            text-align: center;
            font-size: 12px;
            color: var(--text-light);
            margin-top: 16px;
        }
        
        /* ========== MAIN APP ========== */
        .app-container {
            display: none;
        }
        
        .app-container.active {
            display: block;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0 30px 0;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 30px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: var(--gradient-primary);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: 700;
            color: white;
            box-shadow: 0 2px 12px rgba(232, 80, 58, 0.2);
        }
        
        .logo-text {
            font-size: 22px;
            font-weight: 700;
            color: var(--text-primary);
        }
        
        .logo-sub {
            font-size: 12px;
            color: var(--text-muted);
            font-weight: 400;
            letter-spacing: 0.5px;
        }
        
        .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .theme-toggle {
            background: var(--bg-input);
            border: 1px solid var(--border-color);
            color: var(--text-muted);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .theme-toggle:hover {
            background: var(--bg-hover);
            color: var(--text-primary);
            border-color: var(--border-hover);
        }
        
        .logout-btn {
            background: none;
            border: 1px solid var(--border-color);
            color: var(--text-muted);
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .logout-btn:hover {
            background: var(--bg-hover);
            color: var(--text-primary);
        }
        
        .add-btn {
            background: var(--gradient-primary);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 22px;
            font-weight: 300;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 12px rgba(232, 80, 58, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .add-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 20px rgba(232, 80, 58, 0.3);
        }
        
        .add-btn:active {
            transform: scale(0.95);
        }
        
        /* ========== ACCOUNT CARDS ========== */
        .account-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 16px;
            transition: all 0.2s ease;
            animation: slideIn 0.3s ease-out;
            box-shadow: var(--shadow-sm);
        }
        
        .account-card:hover {
            border-color: var(--border-hover);
            box-shadow: var(--shadow-md);
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
        }
        
        .card-name {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .card-name .icon {
            font-size: 18px;
        }
        
        .delete-btn {
            background: none;
            border: none;
            color: var(--text-light);
            font-size: 18px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        
        .delete-btn:hover {
            color: #e8503a;
            background: rgba(232, 80, 58, 0.06);
        }
        
        .code-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 12px 16px;
            background: var(--bg-code);
            border-radius: 12px;
            border: 1px solid var(--border-color);
            margin-bottom: 12px;
        }
        
        .code-display {
            font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 4px;
            color: var(--text-primary);
            transition: color 0.3s ease;
        }
        
        .code-display.fresh {
            color: var(--color-fresh);
        }
        
        .code-display.mid {
            color: var(--color-mid);
        }
        
        .code-display.expiring {
            color: var(--color-expiring);
            animation: pulse 1s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .code-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .timer {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-muted);
            font-variant-numeric: tabular-nums;
            min-width: 32px;
            text-align: center;
        }
        
        .copy-btn {
            background: rgba(0, 0, 0, 0.04);
            border: none;
            color: var(--text-muted);
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        [data-theme="dark"] .copy-btn {
            background: rgba(255, 255, 255, 0.06);
        }
        
        .copy-btn:hover {
            background: var(--bg-hover);
            color: var(--text-primary);
        }
        
        .copy-btn.copied {
            background: rgba(46, 125, 50, 0.1);
            color: var(--color-fresh);
        }
        
        .progress-track {
            width: 100%;
            height: 3px;
            background: var(--border-color);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 1s linear;
            background: var(--gradient-progress);
        }
        
        /* ========== EMPTY STATE ========== */
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            background: var(--bg-secondary);
            border-radius: 16px;
            border: 1px solid var(--border-color);
        }
        
        .empty-state .icon {
            font-size: 64px;
            margin-bottom: 20px;
            opacity: 0.5;
        }
        
        .empty-state h2 {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 8px;
        }
        
        .empty-state p {
            font-size: 14px;
            color: var(--text-muted);
            line-height: 1.6;
        }
        
        /* ========== MODAL ========== */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--bg-modal-overlay);
            backdrop-filter: blur(8px);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            z-index: 1000;
            animation: fadeIn 0.2s ease-out;
        }
        
        .modal-overlay.active {
            display: flex;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal {
            background: var(--bg-secondary);
            border-radius: 20px;
            padding: 32px;
            max-width: 440px;
            width: 100%;
            animation: slideUp 0.3s ease-out;
            box-shadow: var(--shadow-lg);
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.98);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        
        .modal-title {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
        }
        
        .modal-close {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 24px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 8px;
            transition: all 0.2s ease;
        }
        
        .modal-close:hover {
            color: var(--text-primary);
            background: var(--bg-hover);
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: var(--text-secondary);
            margin-bottom: 6px;
        }
        
        .form-input {
            width: 100%;
            padding: 12px 16px;
            background: var(--bg-input);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            color: var(--text-primary);
            font-size: 15px;
            transition: all 0.2s ease;
            font-family: inherit;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #f0b34b;
            background: var(--bg-secondary);
            box-shadow: 0 0 0 3px rgba(240, 179, 75, 0.1);
        }
        
        .form-input::placeholder {
            color: var(--text-light);
        }
        
        .form-hint {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 4px;
        }
        
        .modal-actions {
            display: flex;
            gap: 10px;
            margin-top: 8px;
        }
        
        .btn {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .btn-secondary {
            background: var(--bg-input);
            color: var(--text-secondary);
        }
        
        .btn-secondary:hover {
            background: var(--bg-hover);
        }
        
        .btn-primary {
            background: var(--gradient-primary);
            color: white;
            box-shadow: 0 2px 12px rgba(232, 80, 58, 0.2);
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(232, 80, 58, 0.3);
        }
        
        .btn-primary:active {
            transform: translateY(0);
        }
        
        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        /* ========== TOAST ========== */
        .toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--toast-bg);
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 14px;
            color: var(--text-primary);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            z-index: 2000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border-color);
        }
        
        .toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        
        .toast.success {
            border-color: var(--color-fresh);
        }
        
        .toast.error {
            border-color: var(--color-expiring);
        }
        
        /* ========== FOOTER ========== */
        .footer {
            margin-top: 40px;
            padding: 20px 0;
            text-align: center;
            font-size: 12px;
            color: var(--text-light);
            border-top: 1px solid var(--border-color);
            width: 100%;
        }
        
        /* ========== SCROLLBAR ========== */
        ::-webkit-scrollbar {
            width: 4px;
        }
        ::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover);
        }
        
        /* ========== RESPONSIVE ========== */
        @media (max-width: 480px) {
            body {
                padding: 12px;
                justify-content: flex-start;
                padding-top: 40px;
            }
            
            .login-container {
                padding: 32px 20px;
            }
            
            .header {
                padding: 12px 0 20px 0;
                margin-bottom: 20px;
            }
            
            .logo-text {
                font-size: 18px;
            }
            
            .logo-sub {
                font-size: 10px;
            }
            
            .logo-icon {
                width: 34px;
                height: 34px;
                font-size: 18px;
            }
            
            .add-btn,
            .theme-toggle {
                width: 38px;
                height: 38px;
                font-size: 18px;
            }
            
            .logout-btn {
                font-size: 12px;
                padding: 6px 12px;
            }
            
            .account-card {
                padding: 16px;
                border-radius: 12px;
            }
            
            .code-display {
                font-size: 22px;
                letter-spacing: 3px;
            }
            
            .code-container {
                padding: 10px 14px;
            }
            
            .modal {
                padding: 24px 20px;
            }
            
            .modal-title {
                font-size: 18px;
            }
            
            .card-name {
                font-size: 14px;
            }
            
            .empty-state {
                padding: 40px 16px;
            }
            
            .empty-state .icon {
                font-size: 48px;
            }
            
            .empty-state h2 {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <!-- ========== LOGIN SCREEN ========== -->
    <div class="container" id="loginContainer">
        <div class="login-container">
            <div class="login-logo">
                <span class="icon">🐉</span>
                <h1>Whitedragon</h1>
                <p>Enter your password to access your codes</p>
            </div>
            <form class="login-form" id="loginForm">
                <div class="login-error" id="loginError">Invalid password. Please try again.</div>
                <div class="form-group">
                    <label class="form-label" for="passwordInput">Password</label>
                    <input class="form-input" id="passwordInput" type="password" placeholder="Enter your password..." required autofocus />
                </div>
                <button type="submit" class="login-btn" id="loginBtn">Unlock 🔓</button>
                <div class="login-hint">Default password: whitedragon</div>
            </form>
        </div>
    </div>

    <!-- ========== MAIN APP ========== -->
    <div class="container app-container" id="appContainer">
        <header class="header">
            <div class="logo">
                <div class="logo-icon">🐉</div>
                <div>
                    <div class="logo-text">Whitedragon</div>
                    <div class="logo-sub">Authenticator</div>
                </div>
            </div>
            <div class="header-actions">
                <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" title="Toggle theme">
                    🌙
                </button>
                <button class="logout-btn" id="logoutBtn">Logout</button>
                <button class="add-btn" id="openModalBtn" aria-label="Add account">+</button>
            </div>
        </header>
        <div id="accountList"></div>
    </div>

    <!-- ========== MODAL ========== -->
    <div class="modal-overlay" id="modalOverlay">
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">Add Account</h2>
                <button class="modal-close" id="closeModalBtn">✕</button>
            </div>
            <form id="addForm" autocomplete="off">
                <div class="form-group">
                    <label class="form-label" for="accountName">Account Name</label>
                    <input class="form-input" id="accountName" type="text" placeholder="e.g. GitHub, Google..." required />
                </div>
                <div class="form-group">
                    <label class="form-label" for="accountSecret">Secret Key</label>
                    <input class="form-input" id="accountSecret" type="text" placeholder="JBSWY3DPEHPK3PXP" required spellcheck="false" />
                    <div class="form-hint">Base32 encoded secret (case insensitive)</div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn btn-primary" id="submitBtn">Add Account</button>
                </div>
            </form>
        </div>
    </div>

    <div class="toast" id="toast"></div>
    <div class="footer" id="footer">Made with 🐉 on Cloudflare Workers</div>

    <script>
    (function() {
        'use strict';

        // ========== PASSWORD CONFIG ==========
        var CORRECT_PASSWORD = 'whitedragon';

        // ========== THEME MANAGEMENT ==========
        function getPreferredTheme() {
            var saved = localStorage.getItem('whitedragon_theme');
            if (saved) return saved;
            
            // Auto-detect system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        }

        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('whitedragon_theme', theme);
            
            // Update toggle button icon
            var toggle = document.getElementById('themeToggle');
            if (toggle) {
                toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
                toggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
            }
        }

        function toggleTheme() {
            var current = document.documentElement.getAttribute('data-theme') || 'light';
            var next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
            showToast(next === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'success');
        }

        // ========== DOM REFS ==========
        var loginContainer = document.getElementById('loginContainer');
        var appContainer = document.getElementById('appContainer');
        var loginForm = document.getElementById('loginForm');
        var passwordInput = document.getElementById('passwordInput');
        var loginBtn = document.getElementById('loginBtn');
        var loginError = document.getElementById('loginError');
        var logoutBtn = document.getElementById('logoutBtn');
        var themeToggle = document.getElementById('themeToggle');

        var accountList = document.getElementById('accountList');
        var modalOverlay = document.getElementById('modalOverlay');
        var openModalBtn = document.getElementById('openModalBtn');
        var closeModalBtn = document.getElementById('closeModalBtn');
        var cancelBtn = document.getElementById('cancelBtn');
        var addForm = document.getElementById('addForm');
        var accountName = document.getElementById('accountName');
        var accountSecret = document.getElementById('accountSecret');
        var submitBtn = document.getElementById('submitBtn');
        var toast = document.getElementById('toast');
        var footer = document.getElementById('footer');

        var accounts = [];
        var refreshInterval = null;
        var toastTimeout = null;
        var isAuthenticated = false;

        // ========== INIT THEME ==========
        setTheme(getPreferredTheme());

        // ========== THEME TOGGLE EVENT ==========
        themeToggle.addEventListener('click', toggleTheme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('whitedragon_theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });

        // ========== SESSION MANAGEMENT ==========
        function checkSession() {
            var session = sessionStorage.getItem('whitedragon_auth');
            if (session === 'true') {
                isAuthenticated = true;
                showApp();
            } else {
                showLogin();
            }
        }

        function showLogin() {
            loginContainer.style.display = 'block';
            appContainer.classList.remove('active');
            passwordInput.value = '';
            passwordInput.focus();
            loginError.classList.remove('show');
        }

        function showApp() {
            loginContainer.style.display = 'none';
            appContainer.classList.add('active');
            fetchAccounts().then(function() {
                startRefreshLoop();
            });
        }

        function logout() {
            sessionStorage.removeItem('whitedragon_auth');
            isAuthenticated = false;
            if (refreshInterval) {
                clearInterval(refreshInterval);
                refreshInterval = null;
            }
            showLogin();
            showToast('Logged out', 'success');
        }

        // ========== LOGIN HANDLER ==========
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var password = passwordInput.value;
            
            if (password === CORRECT_PASSWORD) {
                sessionStorage.setItem('whitedragon_auth', 'true');
                isAuthenticated = true;
                loginError.classList.remove('show');
                showApp();
                showToast('Welcome back! 🐉', 'success');
            } else {
                loginError.classList.add('show');
                passwordInput.value = '';
                passwordInput.focus();
                showToast('Invalid password', 'error');
            }
        });

        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });

        // ========== LOGOUT ==========
        logoutBtn.addEventListener('click', logout);

        // ========== BASE32 DECODER ==========
        var BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

        function base32Decode(encoded) {
            encoded = encoded.toUpperCase().replace(/[^A-Z2-7]/g, '');
            if (encoded.length === 0) return new Uint8Array(0);
            
            var bytes = [];
            var bits = 0;
            var value = 0;
            
            for (var i = 0; i < encoded.length; i++) {
                var idx = BASE32_ALPHABET.indexOf(encoded[i]);
                if (idx === -1) continue;
                
                value = (value << 5) | idx;
                bits += 5;
                
                if (bits >= 8) {
                    bits -= 8;
                    bytes.push((value >> bits) & 0xFF);
                }
            }
            
            return new Uint8Array(bytes);
        }

        // ========== TOTP GENERATOR ==========
        async function generateTOTP(secret) {
            try {
                var keyBytes = base32Decode(secret);
                if (keyBytes.length === 0) return null;
                
                var counter = Math.floor(Date.now() / 1000 / 30);
                var counterBytes = new Uint8Array(8);
                var tempCounter = counter;
                for (var i = 7; i >= 0; i--) {
                    counterBytes[i] = tempCounter & 0xFF;
                    tempCounter >>= 8;
                }
                
                var cryptoKey = await crypto.subtle.importKey(
                    'raw',
                    keyBytes,
                    { name: 'HMAC', hash: 'SHA-1' },
                    false,
                    ['sign']
                );
                
                var signature = await crypto.subtle.sign(
                    'HMAC',
                    cryptoKey,
                    counterBytes
                );
                
                var hash = new Uint8Array(signature);
                var offset = hash[hash.length - 1] & 0xF;
                
                var binary = ((hash[offset] & 0x7F) << 24) |
                             ((hash[offset + 1] & 0xFF) << 16) |
                             ((hash[offset + 2] & 0xFF) << 8) |
                             (hash[offset + 3] & 0xFF);
                
                var digits = 6;
                var code = binary % Math.pow(10, digits);
                return code.toString().padStart(digits, '0');
            } catch (e) {
                return null;
            }
        }

        function getTimeRemaining() {
            var now = Math.floor(Date.now() / 1000);
            return 30 - (now % 30);
        }

        function getCodeStatus(seconds) {
            if (seconds > 20) return 'fresh';
            if (seconds > 10) return 'mid';
            return 'expiring';
        }

        function escapeHtml(text) {
            var div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function showToast(message, type) {
            type = type || 'success';
            if (toastTimeout) {
                clearTimeout(toastTimeout);
                toast.classList.remove('show', 'success', 'error');
            }
            
            toast.textContent = message;
            toast.className = 'toast ' + type;
            
            void toast.offsetWidth;
            
            toast.classList.add('show');
            
            toastTimeout = setTimeout(function() {
                toast.classList.remove('show');
                toastTimeout = null;
            }, 2500);
        }

        async function renderAccounts() {
            if (accounts.length === 0) {
                accountList.innerHTML = 
                    '<div class="empty-state">' +
                        '<div class="icon">🔐</div>' +
                        '<h2>No accounts yet</h2>' +
                        '<p>Add your first 2FA account to get started</p>' +
                    '</div>';
                return;
            }
            
            var html = '';
            var remaining = getTimeRemaining();
            
            for (var i = 0; i < accounts.length; i++) {
                var acc = accounts[i];
                var code = await generateTOTP(acc.secret);
                var displayCode = code || '------';
                var status = getCodeStatus(remaining);
                var progress = ((30 - remaining) / 30) * 100;
                
                var formattedCode = displayCode.split('').map(function(c, idx) {
                    return idx === 3 ? c + ' ' : c;
                }).join('');
                
                html += 
                    '<div class="account-card" data-id="' + acc.id + '">' +
                        '<div class="card-header">' +
                            '<div class="card-name">' +
                                '<span class="icon">🔑</span>' +
                                escapeHtml(acc.name) +
                            '</div>' +
                            '<button class="delete-btn" data-id="' + acc.id + '" aria-label="Delete account">✕</button>' +
                        '</div>' +
                        '<div class="code-container">' +
                            '<div class="code-display ' + status + '">' + formattedCode + '</div>' +
                            '<div class="code-actions">' +
                                '<span class="timer">' + remaining + 's</span>' +
                                '<button class="copy-btn" data-id="' + acc.id + '" data-code="' + displayCode + '">📋</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="progress-track">' +
                            '<div class="progress-fill" style="width: ' + progress + '%"></div>' +
                        '</div>' +
                    '</div>';
            }
            
            accountList.innerHTML = html;
            
            document.querySelectorAll('.delete-btn').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    deleteAccount(btn.dataset.id);
                });
            });
            
            document.querySelectorAll('.copy-btn').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var code = btn.dataset.code;
                    if (code && code !== '------') {
                        navigator.clipboard.writeText(code).then(function() {
                            btn.classList.add('copied');
                            btn.textContent = '✓';
                            showToast('Code copied!', 'success');
                            setTimeout(function() {
                                btn.classList.remove('copied');
                                btn.textContent = '📋';
                            }, 2000);
                        }).catch(function() {
                            showToast('Failed to copy', 'error');
                        });
                    }
                });
            });
        }

        async function fetchAccounts() {
            try {
                var res = await fetch('/api/accounts');
                if (!res.ok) throw new Error('Failed to fetch accounts');
                accounts = await res.json();
                await renderAccounts();
            } catch (e) {
                showToast('Failed to load accounts', 'error');
            }
        }

        async function deleteAccount(id) {
            if (!confirm('Delete this account?')) return;
            
            try {
                var res = await fetch('/api/accounts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'delete', id: id })
                });
                
                if (!res.ok) throw new Error('Failed to delete');
                
                var data = await res.json();
                accounts = data.accounts;
                await renderAccounts();
                showToast('Account deleted', 'success');
            } catch (e) {
                showToast('Failed to delete account', 'error');
            }
        }

        async function addAccount(name, secret) {
            try {
                var res = await fetch('/api/accounts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'add', name: name, secret: secret })
                });
                
                if (!res.ok) throw new Error('Failed to add');
                
                var data = await res.json();
                accounts = data.accounts;
                await renderAccounts();
                showToast('Account added!', 'success');
                return true;
            } catch (e) {
                showToast('Failed to add account', 'error');
                return false;
            }
        }

        function startRefreshLoop() {
            if (refreshInterval) clearInterval(refreshInterval);
            
            refreshInterval = setInterval(function() {
                var remaining = getTimeRemaining();
                var status = getCodeStatus(remaining);
                var progress = ((30 - remaining) / 30) * 100;
                
                document.querySelectorAll('.timer').forEach(function(el) {
                    el.textContent = remaining + 's';
                });
                
                document.querySelectorAll('.progress-fill').forEach(function(el) {
                    el.style.width = progress + '%';
                });
                
                document.querySelectorAll('.code-display').forEach(function(el) {
                    el.className = 'code-display ' + status;
                });
                
                if (remaining === 30 || remaining === 0) {
                    renderAccounts();
                }
            }, 1000);
        }

        function openModal() {
            modalOverlay.classList.add('active');
            accountName.value = '';
            accountSecret.value = '';
            accountName.focus();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add Account';
        }

        function closeModal() {
            modalOverlay.classList.remove('active');
        }

        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var name = accountName.value.trim();
            var secret = accountSecret.value.trim().toUpperCase().replace(/\s/g, '');
            
            if (!name) {
                showToast('Please enter an account name', 'error');
                accountName.focus();
                return;
            }
            
            if (!secret || secret.length < 8) {
                showToast('Please enter a valid secret key', 'error');
                accountSecret.focus();
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            addAccount(name, secret).then(function(success) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Account';
                if (success) {
                    closeModal();
                }
            });
        });

        openModalBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) closeModal();
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });

        // Keyboard shortcut: Ctrl+Shift+T for theme toggle
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && (e.key === 'T' || e.key === 't')) {
                e.preventDefault();
                toggleTheme();
            }
        });

        // ========== INIT ==========
        checkSession();
    })();
    </script>
</body>
</html>`;

// ============================================================
// CLOUDFLARE WORKER
// ============================================================

export default {
    async fetch(request, env, ctx) {
        var url = new URL(request.url);
        var path = url.pathname;

        // Serve HTML Dashboard
        if (path === '/' || path === '') {
            return new Response(HTML, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'public, max-age=3600'
                }
            });
        }

        // GET /api/accounts
        if (path === '/api/accounts' && request.method === 'GET') {
            try {
                var data = await env.WHITEDRAGON_ACCOUNTS.get('accounts', 'json');
                return new Response(JSON.stringify(data || []), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });
            } catch (e) {
                return new Response(JSON.stringify([]), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // POST /api/accounts
        if (path === '/api/accounts' && request.method === 'POST') {
            try {
                var body = await request.json();
                var action = body.action;
                var id = body.id;
                var name = body.name;
                var secret = body.secret;
                
                var accounts = await env.WHITEDRAGON_ACCOUNTS.get('accounts', 'json') || [];
                
                if (action === 'add') {
                    var newAccount = {
                        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
                        name: name.trim(),
                        secret: secret.toUpperCase().replace(/\s/g, '')
                    };
                    accounts.push(newAccount);
                    
                } else if (action === 'delete') {
                    accounts = accounts.filter(function(acc) {
                        return acc.id !== id;
                    });
                    
                } else {
                    return new Response(JSON.stringify({ error: 'Invalid action' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                
                await env.WHITEDRAGON_ACCOUNTS.put('accounts', JSON.stringify(accounts));
                
                return new Response(JSON.stringify({ success: true, accounts: accounts }), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });
                
            } catch (e) {
                return new Response(JSON.stringify({ error: 'Server error: ' + e.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        return new Response('Not Found', { status: 404 });
    }
};
