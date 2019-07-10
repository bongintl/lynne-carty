import { useState, useEffect } from 'react';

export default () => {
    var [ windowSize, setWindowSize ] = useState([ window.innerWidth, window.innerHeight ]);
    useEffect(() => {
        var onResize = () => {
            setWindowSize([ window.innerWidth, window.innerHeight ]);
        }
        window.addEventListener( 'resize', onResize );
        return () => window.removeEventListener( 'resize', onResize );
    }, [] )
    return windowSize;
}