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