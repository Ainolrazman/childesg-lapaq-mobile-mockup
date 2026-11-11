// js/modules/nutritionist.js — nutritionist directory + booking flow.

export function openNutritionistModal() {
    document.getElementById('modal-nutritionist').classList.remove('hidden');
}
export function closeNutritionistModal() {
    document.getElementById('modal-nutritionist').classList.add('hidden');
}

export function openBookingModal(expertName) {
    document.getElementById('booking-expert-name').value = expertName;
    document.getElementById('modal-nutritionist').classList.add('hidden');
    document.getElementById('modal-booking').classList.remove('hidden');
}
export function closeBookingModal() {
    document.getElementById('modal-booking').classList.add('hidden');
}

export function handleBookingSubmit(e) {
    e.preventDefault();
    const expert = document.getElementById('booking-expert-name').value;
    closeBookingModal();
    alert(`✅ Consultation Booked Successfully!\n\nYour session request has been forwarded to ${expert}.`);
}
