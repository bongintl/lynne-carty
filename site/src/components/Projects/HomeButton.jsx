import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import VennShader from '../Venn';
import Ring from '../Ring';
import useWindowSize from '~/hooks/useWindowSize';
import useIsMobile from '~/hooks/useIsMobile';
import useSize from '~/hooks/useSize';
import { useData } from '../Data';

var DesktopHomeButton = () => {
    var ref = useRef();
    var size = useSize( ref );
    var windowSize = useWindowSize();
    var scale = size === null ? null : size[ 1 ] / windowSize[ 1 ];
    return (
        <div ref={ ref } className="home-button">
            { scale && <VennShader scale={ scale }/> }
        </div>
    )
}

var MobileHomeButton = () => {
    var { colors } = useData();
    return (
        <div className="home-button">
            { Object.values( colors ).map( ( color, i ) => (
                <Ring key={ i } color={color}/>
            )) }
        </div>
    )
}


var HomeButton = () => (
    <Link to="/">{ useIsMobile() ? <MobileHomeButton/> : <DesktopHomeButton/> }</Link>
)

export default HomeButton;