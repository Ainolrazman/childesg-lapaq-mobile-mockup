export function renderModals() {
    return `
        <!-- Notifications Modal -->
        <div id="notifications-modal" class="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl p-5 shadow-2xl w-full max-w-[340px] text-left space-y-4 animate-in fade-in zoom-in duration-200">
                <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div class="flex items-center space-x-2">
                        <span class="text-lg">🔔</span>
                        <h3 class="text-sm font-bold text-slate-900">Notifications & Alerts</h3>
                    </div>
                    <button onclick="window.closeNotificationsModal()" class="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs">✕</button>
                </div>
                <div id="notifications-list-container" class="space-y-3 max-h-[340px] overflow-y-auto text-xs pr-1"></div>
                <button onclick="window.markAllNotificationsRead()" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition shadow">
                    Mark All as Read ✓
                </button>
            </div>
        </div>

        <!-- Program Child Selector Modal -->
        <div id="program-child-modal" class="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl p-5 shadow-2xl w-full max-w-[320px] text-center space-y-4 animate-in fade-in zoom-in duration-200">
                <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-lg font-bold">👶</div>
                <div class="space-y-1">
                    <h3 id="prog-modal-title" class="text-sm font-bold text-slate-900">Select Child for Program</h3>
                    <p id="prog-modal-subtitle" class="text-[11px] text-slate-600"></p>
                </div>
                <div class="space-y-2 pt-1">
                    <label class="block text-[10px] font-bold text-slate-500 uppercase text-left">Choose Registered Child:</label>
                    <select id="modal-child-select" class="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                        <option value="adam">👦 Adam (8 Yrs - SK Petaling Jaya)</option>
                        <option value="maya">👧 Maya (5 Yrs - Taska Permata KEMAS)</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-2 pt-2">
                    <button onclick="window.closeProgramChildModal()" class="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 rounded-xl text-xs transition">Cancel</button>
                    <button onclick="window.confirmProgramApplication()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-md">Confirm →</button>
                </div>
            </div>
        </div>

        <!-- Payment Gateway Modal -->
        <div id="payment-gateway-modal" class="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl p-5 shadow-2xl w-full max-w-[320px] text-center space-y-4 animate-in fade-in zoom-in duration-200">
                <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">💳</div>
                <div class="space-y-1">
                    <h3 id="pay-modal-title" class="text-sm font-bold text-slate-900">Secure Payment Gateway</h3>
                    <p id="pay-modal-subtitle" class="text-[11px] text-slate-600 font-semibold"></p>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
                    <div class="flex justify-between"><span class="text-slate-500">Organization:</span><strong class="text-slate-800" id="pay-org-name">Kemaih Sdn Bhd</strong></div>
                    <div class="flex justify-between"><span class="text-slate-500">Amount Due:</span><strong class="text-indigo-600 font-extrabold text-sm" id="pay-amount-due">RM699.00</strong></div>
                    <hr class="border-slate-200">
                    <div>
                        <label class="block text-[9px] font-bold text-slate-500 uppercase mb-1">Select Payment Method:</label>
                        <select class="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold">
                            <option>FPX Online Banking (Maybank2u, CIMB Clicks)</option>
                            <option>Corporate Credit / Debit Card (Visa/Mastercard)</option>
                            <option>DuitNow QR / E-Wallet</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2 pt-1">
                    <button onclick="window.closePaymentModal()" class="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 rounded-xl text-xs transition">Cancel</button>
                    <button onclick="window.confirmPaymentSuccess()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-md">Pay Now ✓</button>
                </div>
            </div>
        </div>

        <!-- Custom Application Received Modal -->
        <div id="custom-modal-overlay" class="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-[300px] text-center space-y-4 animate-in fade-in zoom-in duration-200">
                <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                <div class="space-y-1.5">
                    <h3 id="modal-title" class="text-base font-bold text-slate-900">Application Received</h3>
                    <p id="modal-message" class="text-xs text-slate-600 leading-relaxed">Thank you for applying for the course / activity.</p>
                </div>
                <button onclick="window.closeModalOverlay()" id="modal-ok-btn" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md">OK</button>
            </div>
        </div>
    `;
}
