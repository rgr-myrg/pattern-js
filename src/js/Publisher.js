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
