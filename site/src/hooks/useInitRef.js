import { useRef } from 'react';

export default init => {
    var ref = useRef( null );
    if ( ref.current === null ) ref.current = init();
    return ref.current;
}