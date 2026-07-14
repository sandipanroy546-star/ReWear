// Escapes RegExp special characters in user-supplied input before it is
// interpolated into a `new RegExp(...)` call. Without this, values like
// `.*` or `(a+)+$` coming straight from req.body/req.query/req.params could
// be used to bypass exact-match lookups or trigger catastrophic backtracking.
const escapeRegex = (value = '') => {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = escapeRegex;
