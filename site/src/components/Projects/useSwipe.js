import { useState, useRef, useCallback } from 'react';

var normalizeEvent = e => e.touches ? e.touches[ 0 ] : e;

var useSwipe = onEnd => {
    var startPosition = useRef( null );
    var [ distance, setDistance ] = useState( 0 );
    var onTouchStart = useCallback( e => {
        var { clientX } = normalizeEvent( e );
        startPosition.current = clientX;
    }, [ startPosition ] );
    var onTouchMove = useCallback( e => {
        var { clientX } = normalizeEvent( e );
        setDistance( clientX - startPosition.current );
    }, [ setDistance, startPosition ] );
    var onTouchEnd = useCallback(() => {
        onEnd( distance );
        setDistance( 0 );
    }, [ distance, setDistance, onEnd ] );
    var events = { onTouchStart, onTouchMove, onTouchEnd };
    return [ distance, events ];
}

export default useSwipe;