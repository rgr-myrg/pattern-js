/* pattern-js v1.1.0 Tue Dec 08 2015 13:05:22 GMT-0500 (EST) */(function(w){w.Pattern=w.Pattern||{};})(window);(function($P){var TRUE = true,

FALSE = false,

NULL = null,

EMPTY_FUNCTION = function(){},

IS_FUNCTION = function( fn ) {

	return typeof fn === "function";

},

IS_OBJECT = function( obj ) {

	return typeof obj === "object";

},

IS_NUMBER = function( num ) {

	return typeof num === "number";

},

LOGTAG = function() {

	return "[Pattern Js] " + ( new Date() ).toLocaleTimeString() + " ";

},

EXEC_INIT_METHOD = function( object ) {

	if ( IS_FUNCTION( object.init ) ) {

		object.init();

	}

},

GET_OBJECT_IF_DEFINED = function( object ) {

	return IS_OBJECT( object ) ? object : {};

},

FUNCTION_APPLY = function( func, parent, args ) {

	(function() {

		func.apply( parent, arguments );

	})( args );

},

REMOVE_ARRAY_ITEM = function( array, item ) {

	for ( var x = 0, size = array.length; x < size; x++ ) {

		if ( array[ x ] === item ) {

			array.splice( x, 1 );

			if ( IS_FUNCTION( item.onRemove ) ) {

				item.onRemove();

			}

			break;

		}

	}

	return array;

};

$P.EventSignal = function() {

	var listeners = [];

	return {

		addListener: function( listener ) {

			if ( IS_FUNCTION( listener ) ) {

				listeners.push( listener );

			}

			return listeners;

		},

		removeListener: function( listener ) {

			listeners = REMOVE_ARRAY_ITEM( listeners, listener );

			return listeners;

		},

		dispatch: function() {

			var	temp = [],

				size = listeners.length;

			for ( var x = 0; x < size; x++ ) {

				var listener = listeners[ x ];

				if ( IS_FUNCTION( listener ) ) {

					listener.apply( this, arguments );

				} else {

					temp.push( x );

				}

			}

		}

	};

};

$P.Notifier = function( object ) {

	var receivers = [],

	notifier = GET_OBJECT_IF_DEFINED( object );

	notifier.addReceiver = function( receiver ) {

		if ( IS_FUNCTION( receiver.notify ) ) {

			receivers.push( receiver );

		}

		return receivers;

	};

	notifier.removeReceiver = function( receiver ) {

		receivers = REMOVE_ARRAY_ITEM( receivers, receiver );

		return receivers;

	};

	notifier.notify = function( eventName, eventData ) {

		for ( var x = 0, size = receivers.length; x < size; x++ ) {

			receivers[ x ].notify( eventName, eventData );

		}

		return eventName;

	};

	EXEC_INIT_METHOD( notifier );

	return notifier;

};

$P.Receiver = function( object ) {

	var callbacks = {},

	callOnce = {},

	addCallback = function( collection, eventName, eventCallback ) {

		if ( !collection[ eventName ] && IS_FUNCTION( eventCallback ) ) {

			collection[ eventName ] = eventCallback;

		}

		return collection;

	},

	receiver = GET_OBJECT_IF_DEFINED( object );

	receiver.on = function( eventName, eventCallback ) {

		callbacks = addCallback( callbacks, eventName, eventCallback );

		return callbacks;

	};

	receiver.once = function( eventName, eventCallback ) {

		callOnce = addCallback( callOnce, eventName, eventCallback );

		return callOnce;

	};

	receiver.notify = function( eventName, eventData ) {

		if ( IS_FUNCTION( callOnce[ eventName ] ) ) {

			FUNCTION_APPLY( callOnce[ eventName ], receiver, eventData );

			delete callOnce[ eventName ];

		}

		if ( IS_FUNCTION( callbacks[ eventName ] ) ) {

			FUNCTION_APPLY( callbacks[ eventName ], receiver, eventData );

		}

		return eventName;

	};

	EXEC_INIT_METHOD( receiver );

	return receiver;

};

$P.Observable = function( object ) {

	var observers = [],

	observable = GET_OBJECT_IF_DEFINED( object );

	observable.addObserver = function( observer ) {

		if ( !IS_OBJECT( observer ) || !IS_FUNCTION( observer.onUpdate ) ) {

			return observer;

		}

		observer._observable = observable;

		observers.push( observer );

		if ( IS_FUNCTION( observer.onRegister ) ) {

			observer.onRegister();

		}

		return observers;

	};

	observable.removeObserver = function( observer ) {

		observers = REMOVE_ARRAY_ITEM( observers, observer );

		return observers;

	};

	observable.notifyObservers = function( eventName, eventData ) {

		for ( var x = 0, size = observers.length; x < size; x++ ) {

			observers[ x ].onUpdate( eventName, eventData );

		}

	};

	EXEC_INIT_METHOD( observable );

	return observable;

};

/**
 * @file Classic Observer Pattern
 * @exports observer/Observer
 * @extends {Pattern}  
 */

$P.Observer = function( object ) {

	var observer = GET_OBJECT_IF_DEFINED( object );

	/**
	* Method triggered by Observable.notify	
	* @param {object[]} arguments - Array of arguments.
	* @returns {object} notification - First object in arguments array.
	* @since 1.0
	*/

	observer.onUpdate = function( eventName, eventData ) {

		//var notification = arguments[ 0 ];

		if ( IS_FUNCTION( observer[ eventName ] ) ) {

			FUNCTION_APPLY( observer[ eventName ], observer, eventData );

		}

		return eventName;

	};

	EXEC_INIT_METHOD( observer );

	return observer;

};

$P.Publisher = function( object ) {

	var subscribers = [],

	publisher = GET_OBJECT_IF_DEFINED( object );

	publisher.registerSubscriber = function( subscriber ) {

		if ( IS_OBJECT( subscriber ) ) {

			subscribers.push( subscriber );

		}

		return subscribers;

	};

	publisher.removeSubscriber = function( subscriber ) {

		subscribers = REMOVE_ARRAY_ITEM( subscribers, subscriber );

		return subscribers;

	};

	publisher.notify = function( eventName, eventData ) {

		for ( var x = 0, size = subscribers.length; x < size; x++ ) {

			var subscriber = subscribers[ x ];

			if ( IS_FUNCTION( subscriber[ eventName ] ) ) {

				FUNCTION_APPLY( subscriber[ eventName ], subscriber, eventData );

			}

		}

		return eventName;

	};
 
 	EXEC_INIT_METHOD( publisher );

	return publisher;

};
$P.version='1.1.0';})(Pattern);