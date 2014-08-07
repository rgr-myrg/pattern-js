/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */

(function( $ ) {
	$.Publisher = function() {
		var events = {};

		return {
			registerEvents: function( eventList ) {
				if( typeof eventList === "object" ) {
					events = eventList;
				}
			},

			registerSubscriber: function( subscriber ) {
				if ( typeof subscriber.onRegister === "function" ) {
					var listeners = subscriber.onRegister();

					for( var i in listeners ) {
						if( listeners.hasOwnProperty( i ) && 
							typeof listeners[ i ] === "function" &&
								typeof events[ i ] === "object" &&
									typeof events[ i ].addListener === "function" ) {

							events[ i ].addListener( listeners[ i ] );
						}
					}

					subscriber.onRegister = function(){};
				}
			},

			notify: function( event, data ) {
				if ( typeof event.dispatch === "function" ) {
					event.dispatch( data );
				}
			}
		};
	};
})( DevShop );
