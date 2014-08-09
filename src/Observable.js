(function( $ ) {
	$.Observable = function( $Object ) {
		var $Observable = function() {
			var observers = [];

			return {
				addObserver: function( observer ) {
					if ( (typeof observer === "function" || typeof observer === "object") && 
							typeof observer.update === "function" ){

						observer._observable_ = this;
						observers.push( observer );

						if ( typeof observer.onRegister === "function" ) {
							try {
								observer.onRegister();
							} catch( e ) {
							}
						}
					}
				},

				notifyObservers: function() {
					var size = observers.length;

					for ( var x = 0; x < size; x++ ) {
						var observer = observers[ x ];
						observer.update.apply( observer, arguments );
					}
				},

				removeObserver: function( observer ) {
					for ( var x = 0, size = observers.length; x < size; x++ ) {
						if ( observers[ x ] === observer ) {
							observers.splice( x, 1 );
							break;
						}
					}
				}
			};
		};

		return $.ObjectFactory({
				_extends_ : $Observable,
				_public_  : $Object
		});
	};
})( Pattern );
