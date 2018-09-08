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
