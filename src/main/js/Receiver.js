declare('Receiver').class(function() {
	// var callbacks = callOnce = {};
	// var addCallback = function(collection, eventName, eventCallback) {
	// 	if (!collection[eventName] && _isFunction(eventCallback)) {
	// 		collection[eventName] = eventCallback.bind(this);
	// 	}
    //
	// 	return collection;
	// };

    var callbacks = callOnce = {};
    this.addCallback = function(collection, eventName, eventCallback) {
        if (!collection[eventName] && _isFunction(eventCallback)) {
            collection[eventName] = eventCallback.bind(this);
        }

        return collection;
    };
    this.on = function(eventName, eventCallback) {
        callbacks = this.addCallback(callbacks, eventName, eventCallback);

        return this;
    };
    this.once = function(eventName, eventCallback) {
        callOnce = this.addCallback(callOnce, eventName, eventCallback);

        return this;
    };

    this.notify = function(eventName, eventData) {
        if (_isFunction(callOnce[eventName])) {
            _functionApply(callOnce[eventName], this, eventData);

            delete callOnce[eventName];
        }

        if (_isFunction(callbacks[eventName])){
            _functionApply(callbacks[eventName], this, eventData);
        }

        return eventName;
    };
    return this;
    // return {
    //     on: function(eventName, eventCallback) {
    //         callbacks = addCallback(callbacks, eventName, eventCallback);
    //
    //         return this;
    //     },
    //
    //     once: function(eventName, eventCallback) {
    //         callOnce = addCallback(callOnce, eventName, eventCallback);
    //
    //         return this;
    //     },
    //
    //     notify: function(eventName, eventData) {
    //         if (_isFunction(callOnce[eventName])) {
    //             _functionApply(callOnce[eventName], this, eventData);
    //
    //             delete callOnce[eventName];
    //         }
    //
    //         if (_isFunction(callbacks[eventName])){
    //             _functionApply(callbacks[eventName], this, eventData);
    //         }
    //
    //         return eventName;
    //     }
    // };
};
