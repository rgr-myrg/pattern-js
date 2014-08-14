(function( $P ){
	$P.Observer = function( $Object ) {
		var $Observer = function( $Object ) {
			return {
				update: function() {
					var packet = arguments[ 0 ];

					if ( typeof this[ packet.eventName ] === "function" ) {
						try {
							this[ packet.eventName ]( packet.eventData );
						} catch( e ) {
						}
					}
				}
			};
		};

		return $P.ObjectFactory({
			_extends_: $Observer,
			_constructor_: $Object
		});
	};
})( Pattern );
