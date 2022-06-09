/**
 * -- CustomToast
 * This contains personalized messages
 * in toasts.
 */

import { toast, ToastContainer } from 'react-toastify';

// -- Constants
const POSITION = toast.POSITION.TOP_CENTER;
const FOCUS = false;

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
            autoClose={2000}
            closeButton={false}
            theme='dark'
            draggable
        />
    );
}

export { displayError, displaySuccess, Toast };