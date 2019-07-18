import useWindowSize from './useWindowSize';

var useIsMobile = () => useWindowSize()[ 0 ] < 768;

export default useIsMobile;