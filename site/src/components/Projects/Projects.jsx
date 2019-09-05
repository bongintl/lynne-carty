import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useData } from '../Data';
import Project from '../Project';
import { useSpring, animated } from 'react-spring';
import range from 'lodash/range';
import { clamp } from '~/utils/math';
import ProjectsHeader from './ProjectsHeader';
import useIsMobile from '~/hooks/useIsMobile';
import './Projects.scss';

var Projects = ({ match }) => {
    var { projects } = useData();
    var isMobile = useIsMobile();
    var target = projects.findIndex( p => p.url === match.params.page ) || 0;
    var [ curr, setCurr ] = useState( target );
    var spring = useSpring({ target, onRest: ({ target }) => setCurr( target ) })
    var fromIdx = Math.max( Math.min( curr, target ) - 1, 0 );
    var toIdx = Math.min( Math.max( curr, target ) + 1, projects.length - 1 );
    return (
        <div className="projects">
            { !isMobile && <ProjectsHeader project={ projects[ target ] }/> }
            <div className="projects__body">
                { range( fromIdx, toIdx + 1 ).map( i => {
                    var project = projects[ i ];
                    var transform = spring.target.interpolate( target => (
                        `translateX( calc( ${ ( i - target ) } * var( --project-offset ) ) )`
                    ))
                    var contentOffset = spring.target.interpolate( target => {
                        return clamp( target - i, -1, 1);
                    })
                    return (
                        <animated.div
                            className="projects__project"
                            style={{ transform, '--project-content-offset': contentOffset }}
                            key={ project.url }
                        >
                            <Project
                                title={ project.title }
                                offset={ i - target }
                                url={ project.url }
                            />
                            { i !== target && (
                                <Link
                                    className="projects__link"
                                    to={ project.url }
                                />
                            ) }
                        </animated.div>
                    )
                }) }
            </div>
        </div>
    )
}

export default Projects;