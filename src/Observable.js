/**
 * Copyright (c) 2011-2014 DevShop http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */

(function( $ ){
	$.Observable = function( $Object ) {
		var $Observable = function() {
			var observers = [];

			return {
				addObserver: function( $Observer ) {
					if( (typeof $Observer === "function" || typeof $Observer === "object" ) && 
							typeof $Observer.update === "function" ){

						observers.push( $Observer );

						if ( typeof $Observer.onRegister === "function" ) {
							try {
								$Observer.onRegister();
							} catch( e ) {
							}
						}
					}
				},

				notifyObservers: function() {
					var size = observers.length;

					for( var x = 0; x < size; x++ ) {
						var $Observer = observers[x];
						$Observer.update.apply( $Observer, arguments );
					}
				}
			};
		};

		return $.ObjectFactory({
				_extends_ : $Observable,
				_public_  : $Object
		});
	};
})( DevShop );
