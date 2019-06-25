import React from 'react';

var Nav = ({ setMode }) => (
    <nav>
        <a onClick={ () => setMode( 'tags' ) }>🖼</a>
        <a onClick={ () => setMode( 'time' ) }>🗓</a>
        <a onClick={ () => setMode( 'color' ) }>🌈</a>
    </nav>
)

export default Nav;