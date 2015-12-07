describe( "Pattern.Queue", function() {

	var	MAX_COUNT = 11,
		queue, 
		mockDelegate,
		item, 
		error;

	beforeEach(function() {

		mockDelegate = (function(){

			var queueItem = null;

			return {

				maxCount: MAX_COUNT,

				onQueueItem: function( item ) {
					queueItem = item;
				},

				onQueueError: function( e ) {	
					error = e;
				},

				getItem: function() {
					return queueItem;
				},

				init: function() {
					queue = Pattern.Queue( { delegate: this } );

					queue.add( { aDataPoint: "aValue" } );

					if ( queue.count() > 0 ) {
						queue.start();
					}
				}

			};

		})();

		spyOn( mockDelegate, "onQueueItem" ).and.callThrough();

		mockDelegate.init();

		item = mockDelegate.getItem();

	});

	it( "should be a function", function() {

		expect( typeof Pattern.Queue ).toBe( typeof function(){} );

	});

	it( "should return a queue object when instantiated with a proper delegate", function() {

		expect( typeof queue ).toBe( typeof {} );

	});

	it( "should call a delegate's onQueueItem method when queue is started", function() {

		expect( mockDelegate.onQueueItem ).toHaveBeenCalled();

	});

	it( "should return an object when a delegate's onQueueItem was called", function() {

		expect( typeof item ).toBe( typeof {} );

	});

	it( "should return the queue count", function() {

		var queueSize = 10;

		//Add items to the queue
		for ( var x = 0; x < queueSize; x++ ) {

			queue.add( { aDataPoint: "aValue"} );

		}

		expect( queue.count() ).toEqual( queueSize );

	});

	it( "should clear the queue", function() {

		queue.clear();

		expect( queue.count() ).toEqual( 0 );

	});

	it( "should return null when a proper delegate was not provided", function() {

		var queue = Pattern.Queue();
		expect( queue ).toEqual( null );

	});

	it( "should return an error when max count was exceeded", function() {

		//Add items to the queue at least one more than MAX_COUNT
		for ( var x = 0; x < MAX_COUNT + 1; x++ ) {

			queue.add( { aDataPoint: "aValue"} );

		}

		expect( typeof error.message ).toBe( typeof "string" );

	});

	it( "should return the queue count (priority)", function() {

		var queueSize = 10;

		//Add items to the queue
		for ( var x = 0; x < queueSize; x++ ) {

			queue.addPriority( { aDataPoint: "aPriorityValue"} );

		}

		expect( queue.count() ).toEqual( queueSize );

	});

	it( "priority item should be added to the beginning of the queue", function() {

		queue.clear();

		queue.add( { aDataPoint: "aValue"} );
		queue.addPriority( { aDataPoint: "aPriorityValue"} );

		queue.start();

		item = mockDelegate.getItem();

		expect( item.aDataPoint ).toEqual( "aValue" );

	});


});
