describe( "Pattern.Publisher", function() {

	var publisher = new Pattern.Publisher({

	}),
	subscriber = (function() {

		var eventData = {};

		return {

			onEventComplete: function( data ) {

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

	it( "Publisher should be a Constructor Function", function() {

		expect( typeof Pattern.Publisher ).toBe( typeof function(){} );

	});

	it( "Publisher.registerSubscriber should be a Function", function() {

		expect( typeof publisher.registerSubscriber ).toBe( typeof function(){} );

	});

	it( "Publisher.registerSubscriber should add a Subscriber", function() {

		var subscribers = publisher.registerSubscriber( subscriber );

		expect( subscribers.length ).toBe( 1 );

	});

	it( "Publisher.removeSubscriber should be a Function", function() {

		expect( typeof publisher.removeSubscriber ).toBe( typeof function(){} );

	});

	it( "Publisher.removeSubscriber should delete a Subscriber", function() {

		var subscribers = publisher.removeSubscriber( subscriber );

		expect( subscribers.length ).toBe( 0 );

	});

	it( "Publisher.notify should be a Function", function() {

		expect( typeof publisher.notify ).toBe( typeof function(){} );

	});

	it( "Observable.notify should propagate event data execute the subscriber's listener Function", function() {

		spyOn( subscriber, "onEventComplete" ).and.callThrough();

		publisher.registerSubscriber( subscriber );
		publisher.notify( "onEventComplete", eventData );

		expect( subscriber.onEventComplete ).toHaveBeenCalledWith( eventData );
		expect( typeof subscriber.getEventData() ).toBe( typeof {} );
		expect( subscriber.getEventData().aKey ).toEqual( eventData.aKey );

	});

});
