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
