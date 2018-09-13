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
