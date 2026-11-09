// Checks the contact details every lead form asks for: name, email and an optional phone number.

import { formatPhone, isFullPhone } from "./phone.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates {name, email, phone} (phone optional) and returns
 * {error} with a message for the visitor, or {contact} with the phone formatted.
 * `missingName` is the message shown when the name is blank, e.g. "Enter your name to see your results."
 */
export function checkContact({ name, email, phone }, missingName) {
  if (!name) return { error: missingName };
  if (!EMAIL.test(email)) return { error: "Enter a valid email address, like you@company.com." };
  if (phone && !isFullPhone(phone)) return { error: "Enter a 10-digit phone number, like (864) 555-0100, or leave it blank." };
  return { contact: { name, email, phone: formatPhone(phone) } };
}
