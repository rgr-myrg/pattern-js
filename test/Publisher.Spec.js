describe( "Pattern.Publisher", function() {

//	var publisher = new Pattern.Publisher({
//
//	}),
	var subscriber = (function() {

		var eventData = {};

		return {

			onEventComplete: function( data ) {

				eventData = data;

			},

			getEventData: function() {

				return eventData;

			}

		};

	})();

	var eventData = {

		aKey: "aValue"

	};

    var publisher = Pattern.Publisher()
        .registerSubscribers([subscriber])
        .notifyWith({
            onEventComplete: function() {
                this.notify("onEventComplete", eventData);
            }
        });
	it( "Publisher should be a Constructor Function", function() {

		expect( typeof Pattern.Publisher ).toBe( typeof function(){} );

	});

	it( "Publisher.registerSubscribers should be a Function", function() {

		expect( typeof publisher.registerSubscribers ).toBe( typeof function(){} );

	});

	it( "Publisher.registerSubscribers should add Subscribers", function() {

        publisher.registerSubscribers( [subscriber] );
		var subscribers = publisher.getSubscribers();

        // Plus one subscriber since created
		expect( subscribers.length ).toBe( 2 );

	});

	it( "Publisher.removeSubscriber should be a Function", function() {

		expect( typeof publisher.removeSubscriber ).toBe( typeof function(){} );

	});

	it( "Publisher.removeSubscriber should delete a Subscriber", function() {

		var subscribers = publisher.removeSubscriber( subscriber );

        // One less subscriber since created
		expect( subscribers.length ).toBe( 1 );

	});

	it( "Publisher.notify should be a Function", function() {

		expect( typeof publisher.notify ).toBe( typeof function(){} );

	});

	it( "Observable.notify should propagate event data execute the subscriber's listener Function", function() {

		spyOn( subscriber, "onEventComplete" ).and.callThrough();

		publisher.registerSubscribers( [subscriber] );
		publisher.notify( "onEventComplete", eventData );

		expect( subscriber.onEventComplete ).toHaveBeenCalledWith( eventData );
		expect( typeof subscriber.getEventData() ).toBe( typeof {} );
		expect( subscriber.getEventData().aKey ).toEqual( eventData.aKey );

	});

});
