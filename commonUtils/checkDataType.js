/**
 * Check data is email address.
 */
function IsEmailAddress(emailAddress) {
    return /^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i.test(emailAddress);
}

module.exports = function() {
    IsEmailAddress: IsEmailAddress(emailAddress);
};