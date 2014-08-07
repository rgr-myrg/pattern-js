/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */

(function( $ ) {
	$.EventSignal = function( $Object ) {
		var listeners = [];

		return {
			addListener: function( listener ) {
				if ( typeof listener === "function" ) {
					listeners.push( listener );
				}
			},

			removeListener: function( listener ) {
				var	size = listeners.length;

				for ( var x = 0; x < size; x++ ) {
					if( listeners[ x ] === listener ) {
						listeners[ x ] = null;
					}
				}
			},

			dispatch: function() {
				var	temp = [],
					size = listeners.length;

				for ( var x = 0; x < size; x++ ) {
					var listener = listeners[ x ];

					if ( typeof listener === "function" ) {
						listener.apply( this, arguments );
					} else {
						temp.push( x );
					}
				}

				size = temp.length;

				for( x = 0; x < size; x++ ) {
					listeners.splice( x, 1 );
				}
			}
		};
	};
})( DevShop );
