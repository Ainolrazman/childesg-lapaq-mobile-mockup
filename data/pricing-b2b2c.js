<!-- ============ VIEW: PRICING ============ -->
<section id="view-pricing" class="space-y-4 hidden">

    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6">
        <div>
            <span class="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">B2B2C Partner Subscription</span>
            <h2 class="text-lg font-black text-white tracking-tight mt-1">Institutional Pricing · ChildESG™ &amp; LaPaQ</h2>
            <p class="text-xs text-slate-400 mt-0.5">Per-child pricing for partner organizations. 3 tiers in MYR · USD · IDR. Includes free Plus-tier access for every subscribed parent.</p>
        </div>
        <div class="flex items-center space-x-2 font-mono text-xs">
            <span class="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">Partner: <strong class="text-emerald-400">Kemaih Sdn Bhd</strong></span>
        </div>
    </div>

    <!-- 🔧 ADDED: Currency selector -->
    <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3">
        <div class="flex justify-between items-center mb-2 px-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Select Currency</span>
            <span class="text-[9px] font-mono text-slate-500">Rates: 1 MYR ≈ $0.21 ≈ IDR 3,300</span>
        </div>
        <div id="pricing-currency-bar" class="flex gap-2"></div>
    </div>

    <!-- Term selector -->
    <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3">
        <div class="flex justify-between items-center mb-2 px-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Billing Term</span>
            <span class="text-[9px] font-mono text-slate-500">Longer terms = bigger savings</span>
        </div>
        <div id="pricing-term-bar" class="flex gap-2"></div>
    </div>

    <!-- Plan cards (3 tiers) -->
    <div id="pricing-plans-grid" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div>

    <!-- Calculator -->
    <div id="pricing-calculator"></div>

    <!-- Parent benefit callout -->
    <div id="pricing-parent-benefit"></div>

    <!-- Feature matrix -->
    <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider">📋 Full Feature Matrix</h3>
                <p class="text-[10px] text-slate-400">3 tiers · click any group to expand</p>
            </div>
            <span class="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">3 Tiers</span>
        </div>
        <div id="pricing-feature-matrix" class="space-y-2"></div>
    </div>

    <!-- Billing rules -->
    <div id="pricing-billing-rules"></div>

    <!-- Footer note -->
    <div class="bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl p-4 text-center">
        <p class="text-[11px] text-slate-400 italic">💡 <strong class="text-slate-300">Mockup notice:</strong> This pricing page is a design mockup — no real payment processing. Real checkout requires backend integration (Stripe / Billplz / Midtrans).</p>
    </div>
</section>
