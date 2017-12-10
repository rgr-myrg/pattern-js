describe( "Pattern.Receiver", function() {

	var receiver = Pattern.Receiver();

	it( "Receiver should be a Constructor Function", function() {

		expect( typeof Pattern.Observer ).toBe( typeof function(){} );

	});

	it( "Receiver should create an Object", function() {

		expect( typeof receiver ).toBe( typeof {} );

	});

	it( "Receiver.on should be a Function", function() {

		expect( typeof receiver.on ).toBe( typeof function(){} );

	});

	it( "Receiver.on should return an Object", function() {

		var callbacks = receiver.on( "testMethod", function(){} );

		expect( typeof callbacks ).toBe( typeof {} );

	});

	it( "Receiver.once should be a Function", function() {

		expect( typeof receiver.once ).toBe( typeof function(){} );

	});

	it( "Receiver.on should return an Object", function() {

		var callbacks = receiver.once( "testMethod", function(){} );

		expect( typeof callbacks ).toBe( typeof {} );

	});

	it( "Receiver.notify should be a Function", function() {

		expect( typeof receiver.notify ).toBe( typeof function(){} );

	});

	it( "Receiver.notify should execute a callback Function", function() {

		var result;
	
		receiver.on( "sendMessage", function( msg ){ result = msg; } );
	
		receiver.notify( "sendMessage", "a message" );

		expect( result ).toEqual( "a message" );

	});

});
