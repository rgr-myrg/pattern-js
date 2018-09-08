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
