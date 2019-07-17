import React, { useState, useCallback } from 'react';
import { Link } from "react-router-dom";
import { useData } from '../Data';
import Project from '../Project';
import HomeButton from './HomeButton';
import { useSpring, animated } from 'react-spring';
import range from 'lodash/range';
import { clamp } from '~/utils/math';
import useSwipe from './useSwipe';
import useWindowSize from '~/hooks/useWindowSize';
import './Projects.scss';

var Projects = ({ match, history }) => {
    // var onSwipeEnd = useCallback()
    var { projects } = useData();
    var targetIdx = projects.findIndex( p => p.url === match.url ) || 0;
    var windowSize = useWindowSize();
    var onSwipeEnd = useCallback( distance => {
        var idx = distance < 0 ? targetIdx + 1 : targetIdx - 1 //Math.round( targetIdx - distance / windowSize[ 0 ] )
        var project = projects[ clamp( idx, 0, projects.length - 1 ) ]
        history.push( project.url );
    }, [ history, projects, windowSize, targetIdx ])
    var [ dragDistance, events ] = useSwipe( onSwipeEnd );
    var target = targetIdx - dragDistance / windowSize[ 0 ];
    // console.log( dragDistance / windowSize[ 0 ] );
    var [ curr, setCurr ] = useState( target );
    var spring = useSpring({ target, onRest: ({ target }) => setCurr( target ) })
    var fromIdx = Math.max( Math.floor( Math.min( curr, target ) ) - 1, 0 );
    var toIdx = Math.min( Math.ceil( Math.max( curr, target ) ) + 1, projects.length - 1 );
    return (
        <div className="projects" { ...events }>
            <div className="projects__header">
                <HomeButton/>
            </div>
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