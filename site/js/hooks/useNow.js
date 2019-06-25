var { useEffect, useState } = require('react');

export default function useNow ( running = true ) {
    var [ now, setNow ] = useState( Date.now() );
    useEffect( () => {
        if ( !running ) return;
        var frame = requestAnimationFrame( () => setNow( Date.now() ) );
        return () => cancelAnimationFrame( frame );
    }, [ now, running ] )
    return now;
}