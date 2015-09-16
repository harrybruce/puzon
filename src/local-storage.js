function setValue(key, value) {
    localStorage.setItem(key, value);
}

function getValue(key) {
    return localStorage.getItem(key);
}

var LocalStore = {
    set: setValue,
    get: getValue
};

module.exports = LocalStore;
