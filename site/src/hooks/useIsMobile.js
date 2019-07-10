import { useState, useLayoutEffect } from 'react';

var useMediaQuery = query => {
    var [ matches, setMatches ] = useState( false );
    useLayoutEffect(() => {
        var mq = window.matchMedia( query );
        var onChange = () => setMatches( mq.matches );
        onChange();
        mq.addListener( onChange );
        return () => mq.removeListener( onChange );
    }, [] );
    return matches;
}

var useIsMobile = () => useMediaQuery( '( max-width: 768px )' );

export default useIsMobile;