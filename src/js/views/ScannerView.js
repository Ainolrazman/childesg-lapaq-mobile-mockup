export function renderScannerPage() {
    return `
        <div class="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg">
            <span class="bg-violet-500/50 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Camera Integration</span>
            <h2 class="text-xl font-bold mt-1">QR & Badge Scanner</h2>
            <p class="text-xs text-violet-100 mt-1">Scan physical activity or eco-habit station QR codes</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3 text-center">
            <div id="reader" class="w-full overflow-hidden rounded-lg bg-slate-100 min-h-[200px]"></div>
            <div id="scan-result" class="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 font-mono">
                Status: Camera ready. Aim at Partner Organization station QR code.
            </div>
            <button onclick="window.startScanner()" class="w-full bg-violet-600 text-white py-2.5 rounded-xl font-semibold text-sm shadow hover:bg-violet-700 transition">Start Camera Scanner</button>
            <button onclick="window.simulateSuccessfulScan()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs shadow transition">⚡ Simulate Successful Scan (Test Mode)</button>
        </div>
    `;
}
