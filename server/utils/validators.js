// Basic but real RFC-5322-ish email shape check (not just "contains @").
// Doesn't guarantee the mailbox actually exists (that requires sending a
// real email / MX lookups), but it does catch typos and obviously-fake
// addresses like "abc@abc" or "test@.com".
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isValidEmail = (email) =>
  typeof email === "string" && EMAIL_REGEX.test(email.trim());

module.exports = { isValidEmail };
