import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useData } from '../Data';
import Project from '../Project';
import HomeButton from './HomeButton';
import { useSpring, animated } from 'react-spring';
import range from 'lodash/range';

var Projects = ({ match }) => {
    var { projects } = useData();
    var target = projects.findIndex( p => p.url === match.url ) || 0;
    var [ curr, setCurr ] = useState( target );
    var spring = useSpring({ target, onRest: ({ target }) => setCurr( target ) })
    var fromIdx = Math.max( Math.min( curr, target ) - 1, 0 );
    var toIdx = Math.min( Math.max( curr, target ) + 1, projects.length - 1 );
    return (
        <div className="projects">
            <div className="projects__header">
                <HomeButton/>
            </div>
            <div className="projects__body">
                { range( fromIdx, toIdx + 1 ).map( i => {
                    var project = projects[ i ];
                    var transform = spring.target.interpolate( target => (
                        `translateX( calc( ${ ( i - target ) } * var( --project-offset ) ) )`
                    ))
                    return (
                        <animated.div
                            className="projects__project"
                            style={{ transform }}
                            key={ project.url }
                        >
                            <Project
                                title={ project.title }
                                isCurrent={ i === target }
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