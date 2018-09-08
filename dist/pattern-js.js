/* pattern-js v1.2.0 - 8/9/2018 */
(function(){
window.Pattern = window.Pattern || {};

var declare = function(name) {
	this.name = name;

	this.class = function(module) {
		window.Pattern[this.name] = module;
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
			fn(obj[i]);
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

declare('EventSignal').class(
	function() {
	    var listeners = [],
			addListener = function(listener) {
				if (_isFunction(listener)) {
					listeners.push(listener);
				}
			};

	    return {
	        add: function(listeners) {
				if (_isArray(listeners)) {
	            	_forEach(listeners, function(listener) {
						addListener(listener);
					});
	            } else {
					addListener(listeners);
				}

	            return listeners;
	        },

	        remove: function(listener) {
	            listeners = _removeArrayItem(listeners, listener);

	            return listeners;
	        },

	        dispatch: function() {
				_forEach(listeners, (function(listener) {
					listener.apply(this, arguments);
				}).bind(this));
	        }
	    };
	}
);

declare('Notifier').class(function() {
    var receivers = [],
		addReceiver = function(receiver) {
            if (_isFunction(receiver.notify)) {
                receivers.push(receiver);
            }
        };

    return {
		add: function(receivers) {
			if (_isArray(receivers)) {
				_forEach(receivers, function(receiver) {
					addReceiver(receiver);
				});
			} else {
				addReceiver(receivers);
			}

			return receivers;
		},

        remove: function(receiver) {
            receivers = _removeArrayItem(receivers, receiver);

            return receivers;
        },

        notify: function(eventName, eventData) {
			_forEach(receivers, function(receiver) {
				receiver.notify(eventName, eventData);
			});

            return eventName;
        },

        notifyWith: function(obj) {
			_forIn(obj, (function(i) {
				this[i] = obj[i];
			}).bind(this));
            // if (_isObject(object)) {
            //     for (var i in object) {
            //         if (object.hasOwnProperty(i)) {
            //             this[i] = object[i];
            //         }
            //     }
            // }

            return this;
        }
    };
});

declare('Observable').class(function() {
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

            return observers;
        },

        addObservers: function(observerList) {
			_forEach(observerList, (function(observer) {
				this.addObserver(observer);
			}).bind(this));

            return this;
        },

        removeObserver: function(observer) {
            observers = _removeArrayItem(observers, observer);

            return observers;
        },

        notifyWith: function(obj) {
			_forIn(obj, (function(i) {
				this[i] = obj[i];
			}).bind(this));

            return this;
        },

        notifyObservers: function(eventName, eventData) {
			_forEach(observers, function(observer) {
				observer.onUpdate(eventName, eventData);
			});
        }
    };
});

declare('Observer').class(function(object) {
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

declare('Publisher').class(function() {
    var subscribers = [];

    return {
        registerSubscribers: function(subscriberList) {
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

        removeSubscriber: function(subscriber) {
            subscribers = _removeArrayItem(subscribers, subscriber);

            return subscribers;
        },

        notify: function(eventName, eventData) {
			_forEach(subscribers, function(subscriber) {
				if (_isFunction(subscriber[eventName])) {
                    _functionApply(subscriber[eventName], subscriber, eventData);
                }
			});

            return eventName;
        },

        getSubscribers: function() {
            return subscribers;
        }
    };
});

declare('Receiver').class(function() {
	var callbacks = callOnce = {};
	var addCallback = function(collection, eventName, eventCallback) {
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

})();