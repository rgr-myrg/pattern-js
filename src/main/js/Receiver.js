Pattern.Receiver = function() {
	var callbacks = {};
	var callOnce = {};
	var addCallback = function(collection, eventName, eventCallback) {
		if (!collection[eventName] && IS_FUNCTION(eventCallback)) {
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
            if (IS_FUNCTION(callOnce[eventName])) {
                FUNCTION_APPLY(callOnce[eventName], this, eventData);

                delete callOnce[eventName];
            }

            if (IS_FUNCTION(callbacks[eventName])){
                FUNCTION_APPLY(callbacks[eventName], this, eventData);
            }

            return eventName;
        }
    };
};
