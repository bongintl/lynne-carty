var { useState, useEffect } = require( 'react' );

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