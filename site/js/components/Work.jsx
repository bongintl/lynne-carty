import React, { useState, useContext } from 'react';
import { Link } from "react-router-dom";
import DataContext from './DataContext';
import Project from './Project';
import { useSpring, animated } from 'react-spring';
import range from 'lodash/range';

var Work = ({ match }) => {
    var { projects } = useContext( DataContext );
    var target = projects.findIndex( p => p.url === match.url );
    var [ curr, setCurr ] = useState( target );
    var spring = useSpring({ target, onRest: ({ target }) => setCurr( target ) })
    var fromIdx = Math.max( Math.min( curr, target ) - 1, 0 );
    var toIdx = Math.min( Math.max( curr, target ) + 1, projects.length - 1 );
    return (
        <div className="work">
            { range( fromIdx, toIdx + 1 ).map( i => {
                var url = projects[ i ].url;
                var transform = spring.target.interpolate( target => (
                    `translateX( calc( ${ ( i - target ) } * var( --project-offset ) ) )`
                ))
                return (
                    <animated.div
                        className="work__project"
                        style={{ transform }}
                        key={ url }
                    >
                        <Project url={ url }/>
                        { i !== target && <Link className="work__link" to={ url }/> }
                    </animated.div>
                )
            }) }
            { target > 0 && (
                <Link to={ projects[ target - 1 ].url } className="work__button work__button--prev">Prev</Link>
            ) }
            <Link to="/" className="work__button work__button--exit">Exit</Link>
            { target < projects.length - 1 && (
                <Link to={ projects[ target + 1 ].url } className="work__button work__button--next">Next</Link>
            ) }
        </div>
    )
}

export default Work;