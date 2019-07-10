import React, { useRef } from 'react'
import useSize from '../hooks/useSize'

var Ratio = ({ ratio, children, ...rest }) => (
    <div style={{ paddingBottom: ratio * 100 + '%' }} { ...rest }>{ children }</div>
)

var Image = ({
    srcs = [],
    ratio = srcs.length ? srcs[ 0 ].h / srcs[ 0 ].w : 1,
    fit = 'cover',
    ...rest
}) => {
    var ref = useRef();
    var size = useSize( ref );
    var sizes = size ? size[ 0 ] + 'px' : undefined;
    var srcset = size ? srcs.map( ({ url, w }) => `${ url } ${ w }w` ).join(', ') : undefined;
    if ( ratio === false ) {
        return <img ref={ ref } sizes={ sizes } srcSet={ srcset } { ...rest }/>
    } else {
        return (
            <Ratio ratio={ ratio } { ...rest }>
                <img ref={ ref } className={ fit } sizes={ sizes } srcSet={ srcset }/>
            </Ratio>
        )
    }
}

export default Image;