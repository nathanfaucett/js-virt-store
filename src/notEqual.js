var has = require("@nathanfaucett/has"),
    isPrimitive = require("@nathanfaucett/is_primitive"),
    isArrayLike = require("@nathanfaucett/is_array_like"),
    isObject = require("@nathanfaucett/is_object");


module.exports = notEqual;


function notEqual(a, b) {
    if (isPrimitive(a) && isPrimitive(b)) {
        return a !== b;
    } else if (isArrayLike(a) && isArrayLike(b)) {
        return notEqualArray(a, b);
    } else if (isObject(a) && isObject(b)) {
        return notEqualObject(a, b);
    } else {
        return a !== b;
    }
}

function notEqualArray(a, b) {
    var aLength = a.length,
        i, il;

    if (aLength !== b.length) {
        return false;
    } else {
        i = -1;
        il = aLength - 1;

        while (i++ < il) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
}

function notEqualObject(a, b) {
    var localHas = has,
        key;

    for (key in a) {
        if (a[key] !== b[key]) {
            return false;
        }
    }

    for (key in b) {
        if (!localHas(a, key)) {
            return false;
        }
    }

    return true;
}