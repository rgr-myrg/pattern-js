/* pattern-js v1.2.0 Mon Sep 10 2018 20:43:15 */
(function(){
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


declare('Notifier').as(function() {
    var receivers = [];

    return {
        addReceiver: function(receiver) {
            if (_isFunction(receiver.notify)) {
                receivers.push(receiver);
            }
        },

        add: function(receivers) {
            if (_isArray(receivers)) {
                _forEach(receivers, this.addReceiver.bind(this));
            } else {
                this.addReceiver(receivers);
            }

            return this;
        },

        remove: function(receiver) {
            receivers = _removeArrayItem(receivers, receiver);

            return this;
        },

        notifyWith: function(obj) {
            _forIn(obj, (function(i) {
                this[i] = obj[i];
            }).bind(this));

            return this;
        },

        notify: function(eventName, eventData) {
            _forEach(receivers, (function(receiver) {
                receiver.notify(eventName, eventData);
            }).bind(this));
        }
    };
});

declare('Observable').as(function() {
    var observers = [];

    return {
        addObserver: function(observer) {
            if (!_isObject(observer) || !_isFunction(observer.onUpdate)) {
                return observer;
            }

            observer._observable = this;
            observers.push(observer);

            if (_isFunction(observer.onRegister)) {
                observer.onRegister();
            }

            return this;
        },

        addObservers: function(observerList) {
            _forEach(observerList, this.addObserver.bind(this));

            return this;
        },

        remove: function(observer) {
            observers = _removeArrayItem(observers, observer);

            return this;
        },

        notifyWith: function(obj) {
            _forIn(obj, (function(i) {
                this[i] = obj[i];
            }).bind(this));

            return this;
        },

        notify: function(eventName, eventData) {
            _forEach(observers, (function(observer) {
                observer.onUpdate(eventName, eventData);
            }).bind(this));
        }
    };
});

declare('Observer').as(function(object) {
    var observer = _getObjectIfDefined(object);

    observer.onUpdate = function(eventName, eventData) {
        if (_isFunction(observer[eventName])) {
            _functionApply(observer[eventName], observer, eventData);
        }

        return eventName;

    };

    _execInitMethod(observer);

    return observer;
});

declare('Publisher').as(function() {
    var subscribers = [];

    return {
        register: function(subscriberList) {
            _forEach(subscriberList, function(subscriber) {
                if (_isObject(subscriber)) {
                    subscribers.push(subscriber);
                }
            });

            return this;
        },

        notifyWith: function(obj) {
            _forIn(obj, (function(i) {
                this[i] = obj[i];
            }).bind(this));

            return this;
        },

        remove: function(subscriber) {
            subscribers = _removeArrayItem(subscribers, subscriber);

            return this;
        },

        notify: function(eventName, eventData) {
            _forEach(subscribers, function(subscriber) {
                if (_isFunction(subscriber[eventName])) {
                    _functionApply(subscriber[eventName], subscriber, eventData);
                }
            });
        },

        getSubscribers: function() {
            return subscribers;
        }
    };
});

declare('Receiver').as(function() {
    var callbacks = {},
        callOnce = {},

        addCallback = function(collection, eventName, eventCallback) {
            if (!collection[eventName] && _isFunction(eventCallback)) {
                collection[eventName] = eventCallback;
            }

            return collection;
        };

    return {
        on: function(eventName, eventCallback) {
            callbacks = addCallback(callbacks, eventName, eventCallback);

            return this;
        },

        once: function(eventName, eventCallback) {
            callOnce = addCallback(callOnce, eventName, eventCallback);

            return this;
        },

        notify: function(eventName, eventData) {
            if (_isFunction(callOnce[eventName])) {
                _functionApply(callOnce[eventName], this, eventData);

                delete callOnce[eventName];
            }

            if (_isFunction(callbacks[eventName])){
                _functionApply(callbacks[eventName], this, eventData);
            }

            return eventName;
        }
    };
});

declare('Signal').as(function() {
    var slots = [];

    return {
        addSlot: function(slot) {
            if (_isFunction(slot)) {
                slots.push(slot);
            }
        },

        add: function(slots) {
            if (_isArray(slots)) {
                _forEach(slots, this.addSlot.bind(this));
            } else {
                this.addSlot(slots);
            }

            return this;
        },

        remove: function(slot) {
            slots = _removeArrayItem(slots, slot);

            return this;
        },

        dispatch: function() {
            var _args = arguments;

            _forEach(slots, (function(slot) {
                slot.apply(this, _args);
            }).bind(this));
        }
    };
});

(typeof window === 'object') && (window.Pattern = Pattern);

return Pattern;

})();