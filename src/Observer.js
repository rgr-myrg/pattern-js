(function( $ ){
	$.Observer = function( $Object ){
		var $Observer = function( $Object ){
			return {
				update: function() {
					var packet = arguments[ 0 ];

					if (typeof this[ packet.eventName ] === "function" ) {
						try{
							this[ packet.eventName ]( packet.eventData );
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
})( Pattern );
