describe( "Pattern.Notifier", function() {

	var notifier = Pattern.Notifier();

	it( "Notifier should be a Constructor Function", function() {

		expect( typeof Pattern.Observer ).toBe( typeof function(){} );

	});

	it( "Notifier should create an Object", function() {

		expect( typeof notifier ).toBe( typeof {} );

	});

	it( "Notifier.addReceiver should be a Function", function() {

		expect( typeof notifier.addReceiver ).toBe( typeof function(){} );

	});

	it( "Notifier.addReceiver should add a receiver and return an Array of receivers", function() {

		var receivers = notifier.addReceiver( Pattern.Receiver() );
		expect( receivers.length ).toEqual( 1 );

	});

	it( "Notifier.removeReceiver should be a Function", function() {

		expect( typeof notifier.removeReceiver ).toBe( typeof function(){} );

	});

	it( "Notifier.removeReceiver should remove a receiver and return an Array of receivers", function() {

		var receiver = Pattern.Receiver({}),

		receivers = notifier.addReceiver( receiver ),

		size = receivers.length,

		array = notifier.removeReceiver( receiver );

		expect( array.length ).toEqual( size - 1);

	});

	it( "Notifier.notify should send event and data and notify the receiver's callback Function", function() {

		var result, receiver = Pattern.Receiver();

		receiver.on( "sendMessage", function( msg ) { result = msg; } );

		notifier.addReceiver( receiver );

		notifier.notify( "sendMessage", "a test message" );

		expect( result ).toEqual( "a test message" );

	});

});
