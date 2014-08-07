/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */

(function( $ ) {
	$.Queue = function( options ) {
		var	objectId   = null,
			intervalId = null,
			running    = false,
			callback   = function(){},
			timeToWait = 300,
			queue      = [];

		if ( typeof options !== "object" || !options.id ) {
			throw( "Queue options Object is Null" );
		}

		objectId = options.id;

		if ( !isNaN( options.timeToWait ) ) {
			timeToWait = options.timeToWait;
		}

		if ( typeof options.callback === "function" ) {
			callback = options.callback;
		}

		return {
			add: function() {
				queue.push( arguments );
			},

			start: function() {
				if ( !running ) {
					try {
						intervalId = setInterval( objectId + ".run()", timeToWait );
					} catch( e ) {
					}
				}
			},

			run: function() {
				if ( queue.length > 0 ) {
					running = true;

					try {
						callback.apply( this, queue.shift() );
					} catch( e ) {
						this.stop();
					}
				} else {
					this.stop();
				}
			},

			stop: function() {
				running = false;
				clearInterval( intervalId );
			},

			isRunning : function() {
				return running;
			}
		};
	};
})( DevShop );
