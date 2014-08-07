/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */

(function( $ ){
	$.Observer = function( $Object ){
		var $Observer = function( $Object ){
			return {
				update: function() {
					var packet = arguments[ 0 ];

					if (typeof this[ packet.name ] === "function" ) {
						try{
							this[ packet.name ]( packet.data );
						}catch(e){
						}
					}
				}
			};
		};

		return $.ObjectFactory({
			_extends_ : $Observer,
			_public_  : $Object
		});
	};
})( DevShop );
