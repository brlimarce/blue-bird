/**
 * -- AuthForm
 * This contains the authentication
 * form of login and signup.
 */
import React from 'react';

export default function AuthForm({ header, description, inputFields, isLogin, onSubmitHandler }) {
    return (
        <div>
            {/* Start of Header */}
            <div className='d-flex flex-row auth-header'>
                <img src='logo192.png' alt='logo' />
                <h3 className='text-primary'>Blue Bird</h3>
            </div>
            {/* End of Header */}

            {/* Start of Title */}
            <div className='d-flex flex-column mt-5 auth-intro'>
                <span className='display-5 fw-normal text-dark'>{header}</span>
                <h6 className='text-secondary mt-3'>{description}</h6>
            </div>
            {/* End of Title */}

            {/* Start of Form */}
            <form className='d-flex flex-column mt-5'>
                {/* Start of Input Fields */}
                {inputFields}
                {/* End of Input Fields */}

                {/* Start of Buttons */}
                <div className='d-flex justify-content-between mt-4'>
                    <a href={ isLogin? '/signup' : '/login' } className='btn btn-outline-secondary col-6 me-2'>{ isLogin? 'Sign up' : 'Log in' }</a>
                    
                    <button 
                        className='btn btn-primary col-6' 
                        type='button'
                        onClick={onSubmitHandler}
                    >{ isLogin? 'Log in' : 'Sign up' }</button>
                </div>
                {/* End of Buttons */}
            </form>
            {/* End of Form */}
        </div>
    );
}