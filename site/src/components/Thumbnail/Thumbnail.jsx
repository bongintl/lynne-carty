import React, { useRef, useCallback } from 'react';
import { withRouter } from "react-router-dom";
import { srcset } from '../Image';
import Ring from '../Ring';
import { useData } from '../Data';
import { useVisited } from '../Visited';
import { useDragNode } from './useDrag';
import { useNode } from '../Simulation';
import useIsMobile from '~/hooks/useIsMobile';
import bem from '~/utils/bem';

var thumbnailImageSize = ( srcs, r ) => {
    var { w, h } = srcs[ 0 ];
    var diagonal = Math.sqrt( w * w + h * h );
    var scale = ( r * 2 ) / diagonal * .9;
    return { width: w * scale, height: h * scale }
}

var Rings = ({ tags }) => {
    var { colors } = useData();
    return tags.map( tag => (
        <Ring key={ tag } color={ colors[ tag ] }/>
    ))
}

var Thumbnail = withRouter( ({ project, visible, history, setTitle }) => {

    var ref = useRef();
    var visited = useVisited( project.url );

    var { r } = useNode( project.i );
    var { width, height } = thumbnailImageSize( project.thumbnail, r );

    var {
        onMouseEnter: dragOnMouseEnter,
        onMouseLeave: dragOnMouseLeave,
        ...listeners
    } = useDragNode({
        ref,
        index: project.i,
        onClick: useCallback( () => history.push( project.url ), [ history, project ] ),
        onUpdate: useCallback( node => {
            ref.current.style.transform = `
                ${ visible ? '' : 'scale( 0, 0 )' }
                translate( ${ node.x - width / 2 }px, ${ node.y - height / 2 }px )
            `;
        }, [ ref, width, height, visible ] )
    })

    var onMouseEnter = useCallback( e => {
        dragOnMouseEnter( e );
        setTitle( project.title )
    }, [ dragOnMouseEnter, setTitle, project ] )

    var onMouseLeave = useCallback( e => {
        dragOnMouseLeave( e );
        setTitle( null )
    }, [ dragOnMouseLeave, setTitle ] )

    var containerProps = {
        className: bem( 'thumbnail', { visible, visited } ),
        ref,
        style: { width: width + 'px', height: height + 'px' },
        onMouseEnter,
        onMouseLeave,
        ...listeners
    }
    
    var imageProps = {
        srcSet: srcset( project.thumbnail ),
        sizes: width * 2 + 'px'
    }

    return (
        <a { ...containerProps }>
            { useIsMobile() && <Rings tags={ project.tags }/> }
            <img { ...imageProps }/>
        </a>
    )
})

export default Thumbnail;