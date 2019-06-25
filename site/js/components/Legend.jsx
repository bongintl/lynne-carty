import React, { useState } from 'react';

var Legend = ({ tags, colors, filter, setFilter }) => {
    var [ selected, setSelected ] = useState( null );
    return (
        <ul className="legend">
            { tags.map( tag => (
                <li
                    key={ tag }
                    className={ ( filter === null || filter === tag ) ? 'selected' : undefined }
                    style={{ '--color': colors[ tag ] }}
                    onMouseEnter={ () => setFilter( tag ) }
                    onMouseLeave={ () => setFilter( selected ) }
                    onClick={ () => setSelected( selected === tag ? null : tag ) }
                >{ tag }</li>
            )) }
        </ul>
    )
}

export default Legend;