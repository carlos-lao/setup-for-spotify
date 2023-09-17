import { useState, useEffect } from 'react'
import { TRANSITION_STATUS, TRANSITION_STYLE, TRANSITION_DURATION } from '../util';

const FadingDiv = ({ show, persist = false, className, children, onClick, style }) => {
  const [status, setStatus] = useState(
    show ? TRANSITION_STATUS.ENTERED : 
    (persist ? TRANSITION_STATUS.UNMOUNTED_PERSIST : TRANSITION_STATUS.UNMOUNTED)
  );
  
  useEffect(() => {    
    if (show && status !== TRANSITION_STATUS.ENTERED) {
      setStatus(TRANSITION_STATUS.ENTERING);
    } else if (!show && status !== TRANSITION_STATUS.UNMOUNTED && status !== TRANSITION_STATUS.UNMOUNTED_PERSIST) {
      setStatus(TRANSITION_STATUS.EXITING);
    }
  }, [show])
  
  useEffect(() => {
    if (status === TRANSITION_STATUS.ENTERING) {
      setTimeout(() => {
        setStatus(TRANSITION_STATUS.ENTERED);
      }, TRANSITION_DURATION/2);
    } else if (status === TRANSITION_STATUS.EXITING) {
      setTimeout(() => {
        setStatus(TRANSITION_STATUS.EXITED);
      }, TRANSITION_DURATION/2);
    } else if (status === TRANSITION_STATUS.EXITED) {
      setStatus(persist ? TRANSITION_STATUS.UNMOUNTED_PERSIST : TRANSITION_STATUS.UNMOUNTED);
    }
  }, [status])
  
  return (
    <div 
      className={className}
      onClick={onClick}
      style={{
        transition: `opacity ${TRANSITION_DURATION/2}ms ease-in-out`,
        ...TRANSITION_STYLE[status],
        ...style
      }}
    >
      {children}
    </div>
  )
}

export default FadingDiv