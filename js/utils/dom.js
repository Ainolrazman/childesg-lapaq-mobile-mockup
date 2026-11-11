// js/utils/dom.js — small DOM helpers.

/**
 * Safely write text into an element by id.
 * No-ops silently if the element is missing.
 */
export function setCardText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}
