// Checks the "where should we send it" step shared by the assessments.

import { formatPhone, isFullPhone } from "./phone.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates {name, email, phone} (phone optional) and returns
 * {error} with a message for the visitor, or {contact} with the phone formatted.
 * `goal` finishes the name message, e.g. "your results" or "your report".
 */
export function checkContact({ name, email, phone }, goal) {
  if (!name) return { error: `Enter your name to see ${goal}.` };
  if (!EMAIL.test(email)) return { error: "Enter a valid email address, like you@company.com." };
  if (phone && !isFullPhone(phone)) return { error: "Enter a 10-digit phone number, like (864) 555-0100, or leave it blank." };
  return { contact: { name, email, phone: formatPhone(phone) } };
}
