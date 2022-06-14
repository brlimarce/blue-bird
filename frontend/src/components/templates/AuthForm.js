/**
 * -- AuthForm.js
 * This is a base template to render the
 * login and signup forms.
 */
import React from 'react';
export default function AuthForm(props) {
    // Check if the form is for login or signup.
    const isLogin = props.id === 'login';
    return(
        <div className='col-4 mt-5'>
            {/* Start of Header */}
            <div className='d-flex flex-row auth-header'>
                <img src='logo192.png' alt='logo' />
                <h3 className='text-primary'>Blue Bird</h3>
            </div>
            {/* End of Header */}

            {/* Start of Title */}
            <div className='d-flex flex-column mt-5 auth-intro'>
                <span className='display-5 fw-normal text-dark'>{props.header}</span>
                <h6 className='text-secondary mt-3 fw-normal'>{props.description}</h6>
            </div>
            {/* End of Title */}

            {/* Start of Form */}
            <form id={props.id} className='d-flex flex-column mt-5'>
                {/* Start of Fields */}
                {props.fields}
                {/* End of Fields */}

                {/* Start of Buttons */}
                <div className='d-flex mt-4'>
                    <a href={ isLogin? '/sign-up' : '/log-in' } className='btn btn-outline-secondary col-6 me-3'>{ isLogin? 'Sign up' : 'Log in' }</a>
                    
                    <button 
                        className='btn btn-primary col-6' 
                        type='button'
                        onClick={props.submitHandler}
                    >{ isLogin? 'Log in' : 'Sign up' }</button>
                </div>
                {/* End of Buttons */}
            </form>
            {/* End of Form */}
        </div>
    );}