import React from 'react';

var Thumbnail = ({ project, position: { x, y } }) => (
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
)

export default Thumbnail;