$P.Observable = function( object ) {

	var observers = [],

	observable = GET_OBJECT_IF_DEFINED( object );

	observable.addObserver = function( observer ) {

		if ( !IS_OBJECT( observer ) || !IS_FUNCTION( observer.onUpdate ) ) {

			return observer;

		}

		observer._observable = observable;

		observers.push( observer );

		if ( IS_FUNCTION( observer.onRegister ) ) {

			observer.onRegister();

		}

		return observers;

	};

	observable.removeObserver = function( observer ) {

		for ( var x = 0, size = observers.length; x < size; x++ ) {

			if ( observers[ x ] === observer ) {

				observers.splice( x, 1 );

				if ( IS_FUNCTION( observer.onRemove ) ) {

					observer.onRemove();

				}

				break;

			}

		}

		return observers;

	};

	observable.notifyObservers = function() {

		for ( var x = 0, size = observers.length; x < size; x++ ) {

			var observer = observers[ x ];

			observer.onUpdate.apply( observer, arguments );

		}

	};

	EXEC_INIT_METHOD( observable );

	return observable;

};
