Pattern.EventSignal = function() {
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
