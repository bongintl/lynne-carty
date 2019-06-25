import useNow from './useNow';
import usePrev from './useNow';

export default function useDeltaTime ( running = true ) {
    var now = useNow( running );
    var then = usePrev( now );
    return now - then;
}