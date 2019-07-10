import React, { useMemo } from 'react';

var Ring = ({ color }) => {
    var offset = useMemo( () => {
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        return `translate( ${ x * 5 }%, ${ y * 5 }% )`
    }, [] );
    return (
        <div className="ring" style={{ borderColor: color, transform: offset }}/>
    )
}

export default Ring;