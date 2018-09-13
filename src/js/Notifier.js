
declare('Notifier').as(function() {
    var receivers = [];

    return {
        addReceiver: function(receiver) {
            if (_isFunction(receiver.notify)) {
                receivers.push(receiver);
            }
        },

        add: function(receivers) {
            if (_isArray(receivers)) {
                _forEach(receivers, this.addReceiver.bind(this));
            } else {
                this.addReceiver(receivers);
            }

            return this;
        },

        remove: function(receiver) {
            receivers = _removeArrayItem(receivers, receiver);

            return this;
        },

        notifyWith: function(obj) {
            _forIn(obj, (function(i) {
                this[i] = obj[i];
            }).bind(this));

            return this;
        },

        notify: function(eventName, eventData) {
            _forEach(receivers, (function(receiver) {
                receiver.notify(eventName, eventData);
            }).bind(this));
        }
    };
});
