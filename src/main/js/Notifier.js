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
