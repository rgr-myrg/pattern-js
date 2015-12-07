/**
 * @file Simple FIFO Queue
 * @exports queue/Queue
 * @extends {Pattern}  
 */

$P.Queue = function( options ) {

	var	running   = FALSE,
		delegate  = NULL,
		onError   = EMPTY_FUNCTION,
		maxCount  = -1,
		queue     = [];

	if ( options === NULL || 
		!IS_OBJECT( options ) || 
		!IS_OBJECT( options.delegate ) || 
		!IS_FUNCTION( options.delegate.onQueueItem ) ) {

		return NULL;

	}

	delegate = options.delegate;

	if ( IS_FUNCTION( delegate.onQueueError ) ) {

		onError = delegate.onQueueError;

	}

	if ( IS_NUMBER( delegate.maxCount ) && delegate.maxCount > 0 ) {

		maxCount = delegate.maxCount;

	}

	return {
		/**
		* Method to add items to queue.	
		* @param {object[]} arguments - Array of arguments.
		* @returns {array} queue - Modified queue array.
		* @since 1.0
		*/
		add: function() {

			if ( maxCount > 0 && queue.length >= maxCount ) {

				onError( new Error( "maxCount exceeded: " + queue.length ) );

				return NULL;

			}

			queue.push( arguments );

			return queue;

		},

		/**
		 * Method to add items to beginning of the queue, to be processed first
		 * @param {object[]} arguments - Array of arguments.
		 * @returns {array} queue - Modified queue array.
		 * @throws Error if the max count exceeded.
		 * @since 1.1
		 */
		addPriority: function() {

			if ( maxCount > 0 && queue.length >= maxCount ) {

				onError( new Error( "maxCount exceeded: " + queue.length ) );

				return NULL;

			}

			queue.unshift( arguments );

			return queue;

		},


		/**
		* Method to start the queue.	
		* @returns {boolean} Whether queue is running or not.
		* @since 1.0
		*/
		start: function() {

			console.debug( LOGTAG() + "Queue.start running: " + running );

			if ( !running ) {

				running = TRUE;
				this.run();

			}

			return running;

		},

		/**
		* Method to run the queue.
		* @returns {array} queue - The queue array.	
		* @since 1.0
		*/
		run: function() {

			console.debug( LOGTAG() + "Queue.run queue.length: " + queue.length );

			while ( running ) {

				if ( queue.length > 0 ) {

					delegate.onQueueItem.apply( delegate, queue.shift() );

				} else {

					this.stop();

				}

			}

			return queue;

		},

		/**
		* Method to stop the queue.
		* @returns {boolean} running - Whether queue is running or not.
		* @since 1.0
		*/
		stop: function() {

			running = FALSE;

			return running;

		},

		/**
		* Method to check whether the queue is running.	
		* @returns {boolean} running - Whether queue is running or not.
		* @since 1.0
		*/
		isRunning: function() {

			return running;

		},

		/**
		* Method to get the length of the queue.	
		* @returns {number} queue.length - Length of the queue.
		* @since 1.0
		*/
		count: function() {

			return queue.length;

		},

		/**
		* Method to clear the queue.
		* @returns {array} queue - The queue array.	
		* @since 1.0
		*/
		clear: function() {

			this.stop();
			queue = [];

			return queue;

		}

	};
};
