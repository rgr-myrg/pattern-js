var Pattern = {},

declare = function(name) {
    this.as = function(module) {
        Pattern[name] = module;
    };

    return this;
},

_isFunction = function(fn) {
    return typeof fn === "function";
},

_isObject = function(obj) {
    return typeof obj === "object";
},

_isArray = function(arr) {
    return Array.isArray(arr);
},

_getObjectIfDefined = function(obj) {
    return _isObject(obj) ? obj : {};
},

_forEach = function(arr, fn) {
    for (var x = 0, size = arr.length; x < size; x++) {
        fn(arr[x]);
    }
},

_forIn = function(obj, fn) {
    if (!_isObject(obj)) {
        return;
    }

    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            fn(i);
        }
    }
},

_execInitMethod = function(obj) {
    if (_isFunction(obj.init)) {
        obj.init();
    }
},

_functionApply = function(func, parent, args) {
    (function() {
        func.apply(parent, arguments);
    })(args);
},

_removeArrayItem = function(arr, item) {
    for (var x = 0, size = arr.length; x < size; x++) {
        if (arr[x] === item) {
            arr.splice(x, 1);

            if (_isFunction(item.onRemove)) {
                item.onRemove();
            }

            break;
        }
    }

    return arr;
};
