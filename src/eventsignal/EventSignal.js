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

			var	size = listeners.length;

			for ( var x = 0; x < size; x++ ) {

				if ( listeners[ x ] === listener ) {

					listeners[ x ] = null;

				}

			}

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

			size = temp.length;

			for ( x = 0; x < size; x++ ) {

				listeners.splice( x, 1 );

			}

		}

	};

};
