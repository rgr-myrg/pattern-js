Pattern.Observable = function(object) {
	var observers = [];
	var observable = GET_OBJECT_IF_DEFINED(object);

	observable.addObserver = function(observer) {
		if (!IS_OBJECT(observer) || !IS_FUNCTION(observer.onUpdate)) {
			return observer;
		}

		observer._observable = observable;

		observers.push( observer );

		if (IS_FUNCTION(observer.onRegister)) {
			observer.onRegister();
		}

		return observers;
	};

	observable.removeObserver = function(observer) {
		observers = REMOVE_ARRAY_ITEM(observers, observer);

		return observers;
	};

	observable.notifyObservers = function(eventName, eventData) {
		for (var x = 0, size = observers.length; x < size; x++) {
			observers[x].onUpdate(eventName, eventData);
		}

	};

	EXEC_INIT_METHOD(observable);

	return observable;
};
