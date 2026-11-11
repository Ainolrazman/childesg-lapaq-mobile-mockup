// js/modules/auth.js — partner portal login (Google / Facebook / work-email stubs).

import { state } from '../state.js';

export function initSocialSDKs() {
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
            callback:  handleGoogleCredentialResponse
        });
    }
    window.fbAsyncInit = function () {
        FB.init({ appId: 'YOUR_FACEBOOK_APP_ID', cookie: true, xfbml: true, version: 'v18.0' });
    };
}

export function loginWithGoogle() {
    if (window.google && google.accounts.id) google.accounts.id.prompt();
    else                                     simulateAuthSuccess('Google OAuth 2.0');
}
export function handleGoogleCredentialResponse(response) {
    simulateAuthSuccess('Google OAuth 2.0');
}

export function loginWithFacebook() {
    if (window.FB) {
        FB.login(function (response) {
            if (response.authResponse) simulateAuthSuccess('Facebook OAuth');
        }, { scope: 'public_profile,email' });
    } else {
        simulateAuthSuccess('Facebook OAuth');
    }
}

export function simulateAuthSuccess(provider) {
    const btn = document.getElementById('auth-header-btn');
    btn.className = "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5";
    btn.innerHTML = `<span>✓</span><span>Authenticated (${provider})</span>`;
    closeAuthModal();
    alert(`✅ Successfully authenticated using ${provider}! Executive portal access granted.`);
}

/* ── Auth modal open / close / mode toggle ────────────────── */
export function openAuthModal() {
    document.getElementById('modal-auth').classList.remove('hidden');
}
export function closeAuthModal() {
    document.getElementById('modal-auth').classList.add('hidden');
}

export function setAuthMode(mode) {
    state.authMode = mode;
    if (mode === 'login') {
        document.getElementById('mode-btn-login').className    = "flex-1 pb-2 border-b-2 border-indigo-500 text-indigo-400";
        document.getElementById('mode-btn-register').className = "flex-1 pb-2 border-b-2 border-transparent text-slate-400 hover:text-slate-200";
        document.getElementById('register-fields').classList.add('hidden');
    } else {
        document.getElementById('mode-btn-register').className = "flex-1 pb-2 border-b-2 border-indigo-500 text-indigo-400";
        document.getElementById('mode-btn-login').className    = "flex-1 pb-2 border-b-2 border-transparent text-slate-400 hover:text-slate-200";
        document.getElementById('register-fields').classList.remove('hidden');
    }
}

export function handleAuthSubmit(e) {
    e.preventDefault();
    simulateAuthSuccess('Work Email');
}
