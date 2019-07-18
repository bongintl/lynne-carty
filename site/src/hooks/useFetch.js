var { useState, useEffect } = require( 'react' );

var base = document.querySelector('base').href;

export default url => {
    var [ data, setData ] = useState( null );
    useEffect(() => {
        var cancelled = false;
        fetch( url )
            .then( r => r.json() )
            .then( d => {
                if ( !cancelled ) setData( d )
            });
        return () => cancelled = true;
    }, [ url ] );
    return data;
}