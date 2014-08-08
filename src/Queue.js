(function( $ ) {
	$.Queue = function( options ) {
		var	objectId   = null,
			intervalId = null,
			running    = false,
			callback   = function(){},
			onError    = function(){},
			timeToWait = 300,
			maxCount   = -1,
			queue      = [];

		if ( typeof options !== "object" || !options.id ) {
			throw( new Error( "Queue options Object is Null" ) );
		}

		objectId = options.id;

		if ( !isNaN( options.timeToWait ) && options.timeToWait > 0 ) {
			timeToWait = options.timeToWait;
		}

		if ( !isNaN( options.maxCount ) && options.maxCount > 0 ) {
			maxCount = options.maxCount;
		}

		if ( typeof options.callback === "function" ) {
			callback = options.callback;
		}

		if ( typeof options.onError === "function" ) {
			onError = options.onError;
		}

		return {
			add: function() {
				if ( maxCount > 0 && queue.length >= maxCount ) {
					onError( new Error( "Max count exceeded: " + queue.length ) );

					return false;
				}

				queue.push( arguments );
				return true;
			},

			start: function() {
				if ( !running ) {
					try {
						intervalId = setInterval( objectId + ".run()", timeToWait );
					} catch( e ) {
						onError( e );
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
						onError( e );
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
			},

			count: function() {
				return queue.length;
			},

			clear: function() {
				this.stop();
				queue = [];
			}
		};
	};
})( Pattern );
