/* pattern-js v1.1.1 Sun Dec 10 2017 16:01:35 GMT-0500 (EST) */
(function(w) {w.Pattern = w.Pattern || {};})(window);
(function(p) {p.version = '1.1.1';})(Pattern);

(function(Pattern) {Pattern.EventSignal = function() {
    var listeners = [];

    return {
        addListener: function(listener) {
            if (IS_FUNCTION(listener)) {
                listeners.push(listener);
            }

            return listeners;
        },

        addListeners: function(listenerList) {
            for (var x = 0, size = listenerList.length; x < size; x++) {
                this.addListener(listenerList[x]);
            }

            return this;
        },

        removeListener: function(listener) {
            listeners = REMOVE_ARRAY_ITEM(listeners, listener);

            return listeners;
        },

        dispatch: function() {
            var	size = listeners.length;

            for (var x = 0; x < size; x++) {
                var listener = listeners[x];
                listener.apply(this, arguments);
            }
        }
    };
};

Pattern.Notifier = function() {
    var receivers = [];
 
    return {
        addReceiver: function(receiver) {
            if (IS_FUNCTION(receiver.notify)) {
                receivers.push(receiver);
            }

            return receivers;
        },

        addReceivers: function(receiverList) {
            for (var x = 0, size = receiverList.length; x < size; x++) {
                this.addReceiver(receiverList[x]);
            }

            return this;
        },

        removeReceiver: function(receiver) {
            receivers = REMOVE_ARRAY_ITEM(receivers, receiver);

            return receivers;
        },

        notify: function(eventName, eventData) {
            for (var x = 0, size = receivers.length; x < size; x++) {
                receivers[x].notify(eventName, eventData);
            }

            return eventName;
        },

        notifyWith: function(object) {
            if (IS_OBJECT(object)) {
                for (var i in object) {
                    if (object.hasOwnProperty(i)) {
                        this[i] = object[i];
                    }
                }
            }

            return this;
        }
    };
};

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

/**
 * @file Classic Observer Pattern
 * @exports observer/Observer
 * @extends {Pattern}  
 */

Pattern.Observer = function(object) {
	var observer = GET_OBJECT_IF_DEFINED(object);

	/**
	* Method triggered by Observable.notify	
	* @param {object[]} arguments - Array of arguments.
	* @returns {object} notification - First object in arguments array.
	* @since 1.0
	*/

	observer.onUpdate = function(eventName, eventData) {
		if (IS_FUNCTION(observer[eventName])) {
			FUNCTION_APPLY(observer[eventName], observer, eventData);
		}

		return eventName;

	};

	EXEC_INIT_METHOD(observer);

	return observer;
};

Pattern.Publisher = function() {
    var subscribers = [];
    this.registerSubscribers = function(subscriberList) {
        for (var x = 0, size = subscriberList.length; x < size; x++) {
            if (IS_OBJECT(subscriberList[x])) {
                subscribers.push(subscriberList[x]);
            }
        }

        return this;
	};

    this.notifyWith = function(object) {
        if (IS_OBJECT(object)) {
            for (var i in object) {
                if (object.hasOwnProperty(i)) {
                    this[i] = object[i];
                }
            }
        }

        return this;
    };

    this.removeSubscriber = function(subscriber) {
		subscribers = REMOVE_ARRAY_ITEM(subscribers, subscriber);

		return subscribers;
	};

	this.notify = function(eventName, eventData) {
		for (var x = 0, size = subscribers.length; x < size; x++) {
			var subscriber = subscribers[x];

			if (IS_FUNCTION(subscriber[eventName])) {
				FUNCTION_APPLY(subscriber[eventName], subscriber, eventData);
			}
		}

		return eventName;
	};

    this.getSubscribers = function() {
        return subscribers;
    };

    return this;
};
Pattern.Queue = function(options) {
		var	objectId   = null,
			intervalId = null,
			running    = false,
			callback   = function(){},
			onError    = function(){},
			timeToWait = 300,
			maxCount   = -1,
			queue      = [];

		if (!IS_OBJECT(options) || !options.id ) {
			throw( new Error( "Queue options Object is Null" ) );
		}

		objectId = options.id;

		if (!isNaN(options.timeToWait) && options.timeToWait > 0) {
			timeToWait = options.timeToWait;
		}

		if (!isNaN(options.maxCount) && options.maxCount > 0) {
			maxCount = options.maxCount;
		}

		if (IS_FUNCTION(options.callback)) {
			callback = options.callback;
		}

		if (IS_FUNCTION(options.onError)) {
			onError = options.onError;
		}

		return {
			add: function() {
				if (maxCount > 0 && queue.length >= maxCount) {
					onError(new Error( "Max count exceeded: " + queue.length ));

					return false;
				}

				queue.push(arguments);
				return true;
			},

			start: function() {
				if (!running) {
					try {
						intervalId = setInterval(objectId + ".run()", timeToWait);
					} catch(e) {
						onError(e);
					}
				}
			},

			run: function() {
				if (queue.length > 0) {
					running = true;

					try {
						callback.apply(this, queue.shift());
					} catch(e) {
						this.stop();
						onError(e);
					}
				} else {
					this.stop();
				}
			},

			stop: function() {
				running = false;
				clearInterval(intervalId);
			},

			isRunning : function() {
				return running;
			},

			count: function() {
				return queue.length;
			},

			clear: function() {
				this.stop();
				queue = [];
			}
		};
	};

//Pattern.Receiver = function(object) {
//	var callbacks = {};
//	var callOnce = {};
//
//    var addCallback = function(collection, eventName, eventCallback) {
//		if (!collection[eventName] && IS_FUNCTION(eventCallback)) {
//			collection[eventName] = eventCallback;
//		}
//
//		return collection;
//
//	};
//
//	var receiver = GET_OBJECT_IF_DEFINED(object);
//
//	receiver.on = function(eventName, eventCallback) {
//		callbacks = addCallback(callbacks, eventName, eventCallback);
//
//		return callbacks;
//	};
//
//	receiver.once = function(eventName, eventCallback) {
//		callOnce = addCallback(callOnce, eventName, eventCallback);
//		return callOnce;
//
//	};
//
//	receiver.notify = function(eventName, eventData) {
//
//		if (IS_FUNCTION(callOnce[eventName])) {
//			FUNCTION_APPLY(callOnce[eventName], receiver, eventData);
//
//			delete callOnce[ eventName ];
//		}
//
//		if (IS_FUNCTION(callbacks[eventName])){
//			FUNCTION_APPLY(callbacks[eventName], receiver, eventData);
//		}
//
//		return eventName;
//	};
//
//	EXEC_INIT_METHOD(receiver);
//
//	return receiver;
//};

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

var IS_FUNCTION = function(fn) {
	return typeof fn === "function";
};

var IS_OBJECT = function(obj) {
	return typeof obj === "object";
};

var GET_OBJECT_IF_DEFINED = function(obj) {
	return IS_OBJECT(obj) ? obj : {};
};

var EXEC_INIT_METHOD = function(obj) {
	if (IS_FUNCTION(obj.init)) {
		obj.init();
	}
};

var FUNCTION_APPLY = function(func, parent, args) {
	(function() {
		func.apply(parent, arguments);
	})(args);
};

var REMOVE_ARRAY_ITEM = function(array, item) {
	for (var x = 0, size = array.length; x < size; x++) {
		if (array[ x ] === item) {
			array.splice(x, 1);

			if (IS_FUNCTION(item.onRemove)) {
				item.onRemove();
			}

			break;
		}
	}

	return array;
};
})(Pattern);