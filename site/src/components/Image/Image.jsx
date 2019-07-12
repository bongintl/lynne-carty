import React, { useRef } from 'react'
import useSize from '~/hooks/useSize'

export var srcset = srcs => srcs.map( ({ url, w }) => `${ url } ${ w }w` ).join(', ')

var Ratio = ({ ratio, children, ...rest }) => (
    <div style={{ paddingBottom: ratio * 100 + '%' }} { ...rest }>{ children }</div>
)

var Image = ({
    srcs = [],
    ratio = srcs.length ? srcs[ 0 ].h / srcs[ 0 ].w : 1,
    ...rest
}) => {
    var ref = useRef();
    var size = useSize( ref );
    var sizes = size ? size[ 0 ] + 'px' : undefined;
    var srcSet = size ? srcset( srcs ) : undefined;
    if ( ratio === false ) {
        return <img ref={ ref } sizes={ sizes } srcSet={ srcSet } { ...rest }/>
    } else {
        return (
            <Ratio ratio={ ratio } { ...rest }>
                <img className="fill" ref={ ref } sizes={ sizes } srcSet={ srcSet }/>
            </Ratio>
        )
    }
}

export default Image;