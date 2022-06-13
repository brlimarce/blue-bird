/**
 * -- Login
 * This is an authentication form to
 * log in an existing user.
 */
import React, { Component } from 'react';
import { displayError, Toast } from '../components/templates/CustomToast';

import AuthForm from '../components/AuthForm';
import Cookies from 'universal-cookie';
import Field from '../components/Field';

export default class Login extends Component {
    constructor(props) {
        super(props);

        // Set up the state.
        this.state = {
            fieldIds: {
                email: 'email-address',
                pass: 'password'
            },

            invalidTag: 'is-invalid'
        };

        // Bind the `this` keyword.
        this.login = this.login.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    }

    // Provide input validation to a field.
    handleValidation(e) {
        // Set a flag for field validation.
        let isValid = true;

        // Check if the field isn't empty.
        const element = e.target;
        if (!Boolean(element.value) && !element.disabled)
            isValid = false;
        
        // Check if the email is in the right format.
        if (element.id === this.state.fieldIds.email) {
            const emailRegexp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegexp.test(element.value))
                isValid = false;
        }
        
        // Display an invalid state if the field is invalid.
        if (!isValid)
            element.classList.add(this.state.invalidTag);
        else
            element.classList.remove(this.state.invalidTag);
    }

    // Log in the user.
    login(e) {
        // Flag to validate the fields.
        let isValid = true;
        
        // Check for any invalid fields.
        Object.values(this.state.fieldIds).forEach((v) => {
            // Check if there are empty fields.
            const element = document.getElementById(v);
            if (!Boolean(element.value) && !element.disabled) {
                element.classList.add(this.state.invalidTag);
                isValid = false;
            }

            // Check if there are invalid fields.
            if (isValid && element.classList.contains(this.state.invalidTag))
                isValid = false;
        });

        // Return if the form is invalid.
        if (!isValid) {
            displayError('Some field/s is/are missing or invalid.');
            return;
        }

        // Prevent the webpage to reload.
        e.preventDefault();
        const credentials = {
            email: document.getElementById('email-address').value,
            password: document.getElementById('password').value
        };

        // Send a POST request.
        fetch(
            'http://localhost:3001/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            })
            .then((response) => response.json())
            .then((body) => {
                if (body.success) {
                    // Store the token as a cookie.
                    const cookies = new Cookies();
                    cookies.set(
                        'authToken',
                        body.token,
                        {
                            path: 'localhost:3001/',
                            maxAge: 60 * 60,
                            sameSite: 'lax'
                    });

                    // Store the user's data in local storage.
                    localStorage.setItem('firstName', body.firstName);
                    localStorage.setItem('lastName', body.lastName);
                    localStorage.setItem('email', body.email);
                    localStorage.setItem('friendCount', body.friendCount);

                    // Clear the input fields.
                    Object.values(this.state.fieldIds).forEach((v) => {
                        document.getElementById(v).value = null;
                    });

                    // Redirect to the feed.
                    window.location = '/';
                } else
                    displayError(body.message);
            });
    }

    render() {
        return(
            <div className='container-fluid login'>
                <div className='row'>
                    {/* Start of Margin */}
                    <div className='col-1'></div>
                    {/* End of Margin */}

                    {/* Start of Form */}
                    <div className='col-4'>
                        <AuthForm
                            header={'Log in.'}
                            description={'Welcome back! Are you ready to check out what\'s been on the trend lately?'}

                            inputFields={
                                <div>
                                    {/* Start of Email */}
                                    <Field
                                        inputId={'email-address'}
                                        inputType={'email'}
                                        inputLabel={'E-mail Address'}
                                        onValidateHandler={this.handleValidation}
                                    />
                                    {/* End of Email */}

                                    {/* Start of Password */}
                                    <Field
                                        inputId={'password'}
                                        inputType={'password'}
                                        inputLabel={'Password'}
                                        onValidateHandler={this.handleValidation}
                                    />
                                    {/* End of Password */}
                                </div>
                            }

                            isLogin
                            onSubmitHandler={this.login}
                        />
                    </div>
                    {/* End of Form */}

                    {/* Start of Toast */}
                    <div className='col-1'>
                        <Toast />
                    </div>
                    {/* End of Toast */}

                    {/* Start of Icon */}
                    <div 
                        className='col-6 auth-icon'
                        style={{
                            backgroundImage: 'url(assets/phone-1-blue.png)'
                        }}
                    ></div>
                    {/* End of Icon */}
                </div>
            </div>
        );
    }
}