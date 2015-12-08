describe( "Pattern.Observable", function() {

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

	},
	observable = new Pattern.Observable({

		aMethod: function() {}

	});

	it( "Observable should be a Constructor Function", function() {

		expect( typeof Pattern.Observable ).toBe( typeof function(){} );

	});

	it( "Observable should create an Object", function() {

		expect( typeof observable ).toBe( typeof {} );

	});

	it( "Observable should not overwrite Object instance Functions", function() {

		expect( typeof observable.aMethod ).toBe( typeof function(){} );

	});

	it( "Observable.addObserver should be a Function", function() {

		expect( typeof observable.addObserver ).toBe( typeof function(){} );

	});

	it( "Observable.addObserver should add the Observer", function() {

		var observers = observable.addObserver( observer );

		expect( typeof observers ).toBe( typeof [] );
		expect( observers.length ).toEqual( 1 );
		expect( observers[ 0 ] ).toEqual( observer );

	});

	it( "Observable.removeObserver should be a Function", function() {

		expect( typeof observable.removeObserver ).toBe( typeof function(){} );

	});

	it( "Observable.removeObserver should remove the Observer", function() {

		var observers = observable.removeObserver( observer );

		expect( typeof observers ).toBe( typeof [] );
		expect( observers.length ).toEqual( 0 );

	});

	it( "Observable.notifyObservers should be a Function", function() {

		expect( typeof observable.notifyObservers ).toBe( typeof function(){} );

	});

	it( "Observable.notifyObservers should propagate event data execute the observer's listener Function", function() {

		spyOn( observer, "onEventComplete" ).and.callThrough();

		observable.addObserver( observer );
		observable.notifyObservers( notification.eventName, notification.eventData );

		expect( observer.onEventComplete ).toHaveBeenCalledWith( notification.eventData );
		expect( typeof observer.getEventData() ).toBe( typeof {} );
		expect( observer.getEventData().aKey ).toEqual( notification.eventData.aKey );

	});

});
