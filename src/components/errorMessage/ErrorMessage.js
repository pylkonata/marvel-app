import img from './error.gif';

import './ErrorMessags.scss';

const ErrorMessage = () => {
  return (
    <img src={img} className='error' alt='error'/>    
  )
}
export default ErrorMessage;
