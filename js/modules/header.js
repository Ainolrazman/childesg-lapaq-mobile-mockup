// js/modules/header.js — profile dropdown + logout.

export function toggleProfileDropdown() {
    document.getElementById('profile-dropdown-panel').classList.toggle('hidden');
}

export function handleUserLogout() {
    toggleProfileDropdown();
    if (confirm("🔒 Are you sure you want to securely log out of Ainol Razman's CEO Executive session?")) {
        alert("✅ Successfully logged out. Redirecting to Partner Portal Login...");
        // Deferred import: auth.js lives in Phase 8c. Phase 9's main.js will expose
        // openAuthModal on window via Object.assign(window, {...}), so this works then too.
        if (window.openAuthModal) window.openAuthModal();
        else import('./auth.js').then(m => m.openAuthModal());
    }
}

/**
 * Register outside-click listener to auto-close the dropdown.
 * Call once at app startup (Phase 9).
 */
export function initHeaderListeners() {
    window.addEventListener('click', function (e) {
        const panel = document.getElementById('profile-dropdown-panel');
        if (panel && !panel.classList.contains('hidden')) {
            if (!e.target.closest('button[onclick="toggleProfileDropdown()"]') && !e.target.closest('#profile-dropdown-panel')) {
                panel.classList.add('hidden');
            }
        }
    });
}
