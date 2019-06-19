var { useState, useEffect } = require( 'react' );

export default url => {
    var [ data, setData ] = useState( null );
    useEffect(() => {
        fetch( url ).then( r => r.json() ).then( setData );
    }, [ url ] );
    return data;
}