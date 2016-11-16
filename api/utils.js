"use strict";

/**
 * Tests whether string can be interpreted as an integer of radix 10
 * @param {string} n - the string to test
 * @returns {boolean} true if the string is an integer of radix 10, false otherwise
 */
function isInt (n) {
    return !isNaN(n) && (function (x) { return (x | 0) === x; })(parseFloat(n)); // eslint-disable-line no-bitwise
}
module.exports.isInt = isInt;
