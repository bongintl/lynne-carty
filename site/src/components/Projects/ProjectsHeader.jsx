import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useSize from '~/hooks/useSize';
import useWindowSize from '~/hooks/useWindowSize';
import VennShader from '../Venn';
import { useNodeUpdate } from '../Simulation';

var ProjectsTitle = ({ scale, project }) => {
    var ref = useRef();
    var onUpdate = useCallback(
        node => {
            var x = node.x * scale;
            var y = node.y * scale;
            ref.current.style.transform = `translate(${ x }px, ${ y }px)`;
        },
        [ ref ]
    )
    useNodeUpdate( project.i, onUpdate );
    return (
        <div className="projects__title" ref={ ref }>
            { project.title }
        </div>
    )
}

var ProjectsHeader = ({ project }) => {
    var ref = useRef();
    var size = useSize( ref );
    var windowSize = useWindowSize();
    var scale = size === null ? null : size[ 1 ] / windowSize[ 1 ];
    return (
        <Link to="/">
            <div ref={ ref } className="projects__header">
                { scale && (
                    <>
                        <VennShader scale={ scale } transparent/>
                        <ProjectsTitle scale={ scale } project={ project }/>
                    </>
                )}
            </div>
        </Link>
    )
}

export default ProjectsHeader