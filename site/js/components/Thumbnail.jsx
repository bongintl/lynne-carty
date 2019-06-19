import React from 'react';
import { Link } from "react-router-dom";

var Thumbnail = ({ project, position: { x, y } }) => (
    <Link to={ project.url }>
        <img
            className="thumbnail"
            src={ project.thumbnail }
            style={ {
                transform: `
                    translate(-50%, -50%)
                    translate( ${ x }px, ${ y }px )
                `
            } }
        />
    </Link>
)

export default Thumbnail;