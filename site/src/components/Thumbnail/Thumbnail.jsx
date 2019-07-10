import React, { useRef, useCallback } from 'react';
import { withRouter } from "react-router-dom";
import Image from '../Image';
import Ring from '../Ring';
import { useData } from '../Data';
import { useVisited } from '../Visited';
import { useDragNode } from './useDrag';
import useIsMobile from '~/hooks/useIsMobile';
import bem from '~/utils/bem';

var ThumbnailImage = ({ srcs }) => {
    var { w, h } = srcs[ 0 ];
    var diagonal = Math.sqrt( w * w + h * h );
    var scale = 100 / diagonal * .9;
    return (
        <Image
            srcs={ srcs }
            ratio={ false }
            style={{
                width: w * scale + '%',
                height: h * scale + '%'
            }}
        />
    )
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
    var props = useDragNode({
        ref,
        index: project.i,
        onClick: useCallback( () => history.push( project.url ), [ history, project ] ),
        onMouseEnter: useCallback( () => setTitle( project.title ), [ project ] ),
        onMouseLeave: useCallback( () => setTitle( null ), [] )
    })
    return (
        <a
            className={ bem( 'thumbnail', { visible, visited } ) }
            ref={ ref }
            { ...props }
        >
            { useIsMobile() && <Rings tags={ project.tags }/> }
            <ThumbnailImage srcs={ project.thumbnail }/>
        </a>
    )
})

export default Thumbnail;