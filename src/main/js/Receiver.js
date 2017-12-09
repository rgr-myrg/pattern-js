Pattern.Receiver = function(object) {
	var callbacks = {};
	var callOnce = {};

    var addCallback = function(collection, eventName, eventCallback) {
		if (!collection[eventName] && IS_FUNCTION(eventCallback)) {
			collection[eventName] = eventCallback;
		}

		return collection;

	};

	var receiver = GET_OBJECT_IF_DEFINED(object);

	receiver.on = function(eventName, eventCallback) {
		callbacks = addCallback(callbacks, eventName, eventCallback);

		return callbacks;
	};

	receiver.once = function(eventName, eventCallback) {
		callOnce = addCallback(callOnce, eventName, eventCallback);
		return callOnce;

	};

	receiver.notify = function(eventName, eventData) {

		if (IS_FUNCTION(callOnce[eventName])) {
			FUNCTION_APPLY(callOnce[eventName], receiver, eventData);

			delete callOnce[ eventName ];
		}

		if (IS_FUNCTION(callbacks[eventName])){
			FUNCTION_APPLY(callbacks[eventName], receiver, eventData);
		}

		return eventName;
	};

	EXEC_INIT_METHOD(receiver);

	return receiver;
};
