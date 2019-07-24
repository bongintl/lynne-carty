import React, { useRef, useCallback } from 'react';
import { withRouter } from "react-router-dom";
import { srcset } from '../Image';
import Ring from '../Ring';
import { useData } from '../Data';
import { useVisited } from '../Visited';
import { useNode } from '../Simulation';
import { useDragNode } from './useDrag';
import useIsMobile from '~/hooks/useIsMobile';
import bem from '~/utils/bem';
import './Thumbnail.scss'

var thumbnailImageSize = ( srcs, r ) => {
    var { w, h } = srcs[ 0 ];
    var diagonal = Math.sqrt( w * w + h * h );
    var scale = ( r * 2 ) / diagonal * .9;
    return { width: w * scale, height: h * scale }
}

var Rings = ({ tags, radius }) => {
    var { colors } = useData();
    return tags.map( tag => (
        <Ring key={ tag } color={ colors[ tag ] } radius={ radius }/>
    ))
}

var Thumbnail = withRouter( ({ project, visible, history, setTitle }) => {

    var isMobile = useIsMobile();

    var ref = useRef();
    var visited = useVisited( project.url );
    
    var { r } = useNode( project.i );
    var { width, height } = thumbnailImageSize( project.thumbnail, r );

    var onClick = useCallback( () => history.push( project.url ), [ history, project ] );
    var {
        onMouseEnter: dragOnMouseEnter,
        onMouseLeave: dragOnMouseLeave,
        ...dragListeners
    } = useDragNode({
        ref,
        index: project.i,
        onClick,
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
        ...( isMobile ? { onClick } : dragListeners )
    }
    
    var imageProps = {
        srcSet: srcset( project.thumbnail ),
        sizes: width + 'px'
    }

    return (
        <a { ...containerProps }>
            { isMobile && <Rings tags={ project.tags } radius={ r }/> }
            <img { ...imageProps }/>
        </a>
    )
})


export default Thumbnail;