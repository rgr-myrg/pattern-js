Pattern.EventSignal = function() {
    var listeners = [];

    return {
        addListener: function(listener) {
            if (typeof listener === "function") {
                listeners.push(listener);
            }
            return listeners;
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
