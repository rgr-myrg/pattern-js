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
