describe( "Pattern.Observer", function() {

	var observer = new Pattern.Observer(

		(function() {

			var eventData = {};

			return {

				onEventComplete: function( data ) {

					eventData = data;

				},

				getEventData: function() {

					return eventData;

				}

			};

		})()

	),
	notification = {

		eventName: "onEventComplete",
		eventData: {
			aKey: "aValue"
		}

	};

	it( "Observer should be a Constructor Function", function() {

		expect( typeof Pattern.Observer ).toBe( typeof function(){} );

	});

	it( "Observer should create an Object", function() {

		expect( typeof observer ).toBe( typeof {} );

	});

	it( "Observer.onUpdate should be a Function", function() {

		expect( typeof observer.onUpdate ).toBe( typeof function(){} );

	});

	it( "Observer.onUpdate should propagate event data execute the listener Function", function() {

		spyOn( observer, "onEventComplete" ).and.callThrough();

		observer.onUpdate( notification.eventName, notification.eventData );

		expect( observer.onEventComplete ).toHaveBeenCalledWith( notification.eventData );
		expect( typeof observer.getEventData() ).toBe( typeof {} );
		expect( observer.getEventData().aKey ).toEqual( notification.eventData.aKey );

	});

});
