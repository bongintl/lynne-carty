import React from 'react';
import HomeMobile from './HomeMobile';
import HomeDesktop from './HomeDesktop';
import useIsMobile from '../../hooks/useIsMobile';

var Home = () => useIsMobile() ? <HomeMobile/> : <HomeDesktop/>;

export default Home;