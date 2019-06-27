export default ( be, ms ) => [
    be,
    ...Object.keys( ms )
        .filter( m => ms[ m ] )
        .map( m => `${ be }--${ m }`)
].join(' ')