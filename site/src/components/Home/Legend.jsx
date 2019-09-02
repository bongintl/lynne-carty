import React, { useState } from 'react';
import bem from '~/utils/bem';
import './Legend.scss';

var isTouch = 'ontouchstart' in window;

var Legend = ({ tags, colors, filter, setFilter }) => {
    var [ selected, setSelected ] = useState( null );
    return (
        <ul className="legend">
            { tags.map( tag => (
                <li
                    className={ bem( "legend__item", { selected: filter === null || filter === tag } ) }
                    key={ tag }
                    style={{ '--color': colors[ tag ] }}
                    onMouseEnter={ isTouch ? undefined : () => setFilter( tag ) }
                    onMouseLeave={ isTouch ? undefined : () => setFilter( selected ) }
                    onClick={ isTouch
                        ? () => setFilter( filter === tag ? null : tag )
                        : () => setSelected( selected === tag ? null : tag )
                    }
                >
                    { tag }
                    { tag === selected && ' ×' }
                </li>
            )) }
        </ul>
    )
}

export default Legend;