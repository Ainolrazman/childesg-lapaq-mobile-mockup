import { state } from '../state/store.js';

let html5QrCode = null;

export function startScanner(onSuccessCallback) {
    if (typeof Html5Qrcode !== 'undefined') {
        if (html5QrCode) {
            try { html5QrCode.stop().catch(() => {}); } catch(e){}
        }
        html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            (decodedText) => {
                const child = state.childrenData[state.selectedChild];
                child.totalTokens += 25;
                child.impactTokens += 25;
                const resultEl = document.getElementById('scan-result');
                if (resultEl) {
                    resultEl.innerText = `Success! Partner QR Scanned: ${decodedText}. +25 Tokens Minted!`;
                }
                html5QrCode.stop().catch(() => {});
                if (onSuccessCallback) onSuccessCallback(decodedText);
            },
            (errorMessage) => {}
        ).catch((err) => { 
            const resultEl = document.getElementById('scan-result');
            if (resultEl) {
                resultEl.innerText = `Camera error or permission denied: Please use Localhost or HTTPS.`; 
            }
        });
    } else {
        const resultEl = document.getElementById('scan-result');
        if (resultEl) {
            resultEl.innerText = `Scanner library loading... Please refresh.`;
        }
    }
}

export function simulateScan() {
    const child = state.childrenData[state.selectedChild];
    child.totalTokens += 25;
    child.impactTokens += 25;
    const resultEl = document.getElementById('scan-result');
    if (resultEl) {
        resultEl.innerText = `Success! Simulated Partner QR Scanned: STATION-KEMAIH-01. +25 Tokens Minted to ${child.name}!`;
    }
}

export function stopScannerIfActive() {
    if (html5QrCode) {
        try { html5QrCode.stop(); } catch(e){}
        html5QrCode = null;
    }
}
