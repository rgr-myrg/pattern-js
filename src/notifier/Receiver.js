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

		if ( callOnce[ eventName ] ) {

			FUNCTION_APPLY( callOnce[ eventName ], receiver, eventData );

			delete callOnce[ eventName ];

		}

		if ( callbacks[ eventName ] ) {

			FUNCTION_APPLY( callbacks[ eventName ], receiver, eventData );

		}

	};

	EXEC_INIT_METHOD( receiver );

	return receiver;

};

// var r = $P.Receiver();
// r.on( "method", function() {} );
