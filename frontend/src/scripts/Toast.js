/**
 * -- Toast.js
 * This contains a configuration for
 * setting up a toast.
 */
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// -- Constants
const POSITION = toast.POSITION.TOP_CENTER;
const FOCUS = false;
const TIME_CLOSE = 1000;

// -- Prompts
const displayError = (message) => {
    toast.error(message, {
        position: POSITION,
        pauseOnFocusLoss: FOCUS,
        icon: '❌',
    });
}

const displaySuccess = (message) => {
    toast.success(message, {
        position: POSITION,
        pauseOnFocusLoss: FOCUS,
        icon: '✔️'
    });
}

// Get the time constant.
const getTime = () => {
    return TIME_CLOSE;
}

// Configure the toast.
const Toast = () => {
    return(
        <ToastContainer
            autoClose={TIME_CLOSE}
            closeButton={false}
            theme='dark'
            draggable
        />
    );
}

export { 
    displayError, 
    displaySuccess,
    getTime, 
    Toast
};