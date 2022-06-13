/**
 * -- Custom Toasts
 * This contains personalized messages
 * in toasts.
 */

import { toast, ToastContainer } from 'react-toastify';

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

export { displayError, displaySuccess, Toast, TIME_CLOSE };