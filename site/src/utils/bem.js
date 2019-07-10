export default ( be, ...ms ) => [
    be,
    ...ms.reduce( ( classes, modifier ) => {
        if ( Array.isArray( modifier ) ) {
            classes.push( ...modifier.filter( Boolean ) )
        } else if ( typeof modifier === 'object') {
            classes.push( ...Object.keys( modifier ).filter( m => modifier[ m ] ) );
        } else {
            classes.push( modifier );
        }
        return classes;
    }, [] ).map( m => `${ be }--${ m }`)
].join(' ')