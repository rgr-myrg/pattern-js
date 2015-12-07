describe( "Pattern.EventSignal", function() {

	var signal = new Pattern.EventSignal(),

	receiver = (function() {

		var eventData = {};

		return {

			onSignalComplete: function( data ) {

				eventData = data;

			},

			getEventData: function() {

				return eventData;

			}

		};

	})(),

	eventData = {

		aKey: "aValue"

	};

	it( "EventSignal should be a Constructor Function", function() {

		expect( typeof Pattern.EventSignal ).toBe( typeof function(){} );

	});

	it( "EventSignal should create an Object", function() {

		expect( typeof signal ).toBe( typeof {} );

	});

	it( "EventSignal.addListener should add a listener Function", function() {

		var listeners = signal.addListener( receiver.onSignalComplete );

		expect( listeners.length ).toEqual( 1 );
		expect( listeners[ 0 ] ).toEqual( receiver.onSignalComplete );

	});

	it( "EventSignal.dispatch should propagate event data execute the listener Function", function() {

		spyOn( receiver, "onSignalComplete" ).and.callThrough();

		signal.addListener( receiver.onSignalComplete );
		signal.dispatch( eventData );

		expect( receiver.onSignalComplete ).toHaveBeenCalledWith( eventData );
		expect( typeof receiver.getEventData() ).toBe( typeof {} );
		expect( receiver.getEventData().aKey ).toEqual( eventData.aKey );

	});

	it( "EventSignal.removeListener should remove a listener Function", function() {

		var testSignal = new Pattern.EventSignal();
		var testListener = function() {};

		testSignal.addListener( testListener );

		var listeners = testSignal.removeListener( testListener );

		expect( listeners.length ).toEqual( 1 );
		expect( listeners[ 0 ] ).toEqual( null );

	});

});
