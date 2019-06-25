import React from 'react';
import { Link } from "react-router-dom";

var Thumbnail = ({ project, x, y, r }) => (
    <Link to={ project.url }>
        <img
            className="thumbnail"
            src={ project.thumbnail }
            style={ {
                width: r * .7 * 2 + 'px',
                height: r * .7 * 2 + 'px',
                transform: `
                    translate(-50%, -50%)
                    translate( ${ x }px, ${ y }px )
                `
            } }
        />
    </Link>
)

export default Thumbnail;