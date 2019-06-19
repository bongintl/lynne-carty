import React, { createContext, useRef, useState, useLayoutEffect } from 'react'

export var GLContext = createContext();

var GL = ({ size, children, ...rest }) => {
    var ref = useRef();
    var [ gl, setGL ] = useState( null );
    useLayoutEffect( () => {
        setGL( ref.current.getContext( 'webgl' ) );
    }, [ ref.current ] );
    useLayoutEffect( () => {
        if ( !gl ) return;
        gl.viewport( 0, 0, size[ 0 ], size[ 1 ] );
    }, [ ref.current, size ] );
    return (
        <GLContext.Provider value={ gl }t>
            <canvas ref={ ref } width={ size[ 0 ] } height={ size[ 1 ] } { ...rest }/>
            { gl && children }
        </GLContext.Provider>
    )
}

export default GL;