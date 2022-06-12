/**
 * -- Helper
 * This contains the auxiliary
 * functions.
 */

/**
 * This converts a string into
 * capitalized form.
 * 
 * @param {*} name  The name in any format.
 * @returns {String} The name in capitalized format.
 */
const capitalizeName = (name) => {
    // Split the text by space.
    const names = name.split(' ');

    // Transform each character per name.
    for (let i = 0; i < names.length; i++) {
        var newname = names[i];
        newname = newname.toLowerCase();
        newname = newname.charAt(0).toUpperCase() + newname.slice(1, newname.length);

        // Store the name.
        names[i] = newname;
    } return names.join(' ');
};

export { capitalizeName };