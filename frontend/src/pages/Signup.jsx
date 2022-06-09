/**
 * -- Signup
 * This is an authentication form to
 * register an existing user.
 */
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

import AuthForm from '../components/AuthForm';
import Field from '../components/Field';

import { displayError, displaySuccess, Toast } from '../components/CustomToast';
import 'react-toastify/dist/ReactToastify.css';

export default class Signup extends Component {
    constructor(props) {
        super(props);

        // Set up the state.
        this.state = {
            fieldIds: {
                firstName: 'first-name',
                lastName: 'last-name',
                email: 'email-address',
                pass: 'password',
                confirmPass: 'confirm-password'
            },

            invalidTag: 'is-invalid'
        };

        // Bind the `this` keyword.
        this.signup = this.signup.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.onLoadHandler = this.onLoadHandler.bind(this);
    }

    // Handle any default setup for loading.
    onLoadHandler() {
        // Disable the field for `confirm password`.
        document.getElementById(this.state.fieldIds.confirmPass).disabled = true;
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
        
        // Check if the password is valid.
        if (element.id === this.state.fieldIds.pass) {
            const passRegexp = /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/;
            if (element.value.length < 8 || !passRegexp.test(element.value))
                isValid = false;
            
            // Enable the field of `compare password` if password is valid.
            const confirmPassField = document.getElementById(this.state.fieldIds.confirmPass);
            if (isValid)
                confirmPassField.disabled = false;
            
            // If password is empty, reset the confirm password field.
            if (!Boolean(element.value)) {
                confirmPassField.value = null;
                confirmPassField.disabled = true;
                confirmPassField.classList.remove(this.invalidTag);
            }
        }

        // Check if the password matches.
        if (element.id === this.state.fieldIds.confirmPass && !element.id.disabled) {
            if (element.value !== document.getElementById(this.state.fieldIds.pass).value)
                isValid = false;
        }
        
        // Display an invalid state if the field is invalid.
        if (!isValid)
            element.classList.add(this.state.invalidTag);
        else
            element.classList.remove(this.state.invalidTag);
    }

    // Register the user.
    signup(e) {
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
            displayError('Some field/s is/are invalid.');
            return;
        }
        
        // Prevent the webpage from reloading.
        e.preventDefault();
        const user = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email-address').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirm-password').value
        };

        // Send a POST request.
        fetch(
            'http://localhost:3001/signup',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then((response) => response.json())
            .then((body) => {
                if (body.success) {
                    // Clear the input fields.
                    Object.values(this.state.fieldIds).forEach((v) => {
                        document.getElementById(v).value = null;
                    });

                    // Display a success prompt.
                    displaySuccess(body.message)
                    
                    // Redirect to the login page.
                    setTimeout(() => {
                        return (<Navigate to='/login' />);
                    }, 2000);
                } else
                    displayError(body.message);
            });
    }

    render() {
        return(
            <div 
                className='container-fluid signup'
                onLoad={this.onLoadHandler}
            >
                <div className='row'>
                    {/* Start of Icon */}
                    <div 
                        className='col-6 auth-icon'
                        style={{
                            backgroundImage: 'url(assets/socmed-1-blue.png)'
                        }}
                    ></div>
                    {/* End of Icon */}

                    {/* Start of Margin */}
                    <div className='col-1'></div>
                    {/* End of Margin */}

                    {/* Start of Form */}
                    <div className='col-4'>
                        <AuthForm 
                            header={'Sign up.'}
                            description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}

                            inputFields={
                                <div>
                                    {/* Start of Name */}
                                    <div className='d-flex flex-row justify-content-between col-12'>
                                        <Field
                                            inputId={'first-name'}
                                            inputType={'text'}
                                            inputLabel={'First Name'}
                                            onValidateHandler={this.handleValidation}
                                            isDual
                                        />

                                        <Field
                                            inputId={'last-name'}
                                            inputType={'text'}
                                            inputLabel={'Last Name'}
                                            onValidateHandler={this.handleValidation}
                                            isDual
                                        />
                                    </div>
                                    {/* End of Name */}

                                    {/* Start of Email */}
                                    <Field
                                        inputId={'email-address'}
                                        inputType={'email'}
                                        inputLabel={'E-mail Address'}
                                        onValidateHandler={this.handleValidation}
                                    />
                                    {/* End of Email */}

                                    {/* Start of Password */}
                                    <div className='d-flex flex-row justify-content-between col-12'>
                                        <Field
                                            inputId={'password'}
                                            inputType={'password'}
                                            inputLabel={'Password'}
                                            onValidateHandler={this.handleValidation}
                                            isDual
                                        />

                                        <Field
                                            inputId={'confirm-password'}
                                            inputType={'password'}
                                            inputLabel={'Confirm Password'}
                                            onValidateHandler={this.handleValidation}
                                            isDual
                                        />
                                    </div>
                                    {/* End of Password */}
                                </div>
                            }

                            isLogin={false}
                            onSubmitHandler={this.signup}
                        />
                    </div>
                    {/* End of Form */}

                    {/* Start of Toast */}
                    <div className='col-1'>
                        <Toast />
                    </div>
                    {/* End of Toast */}
                </div>
            </div>
        );
    }
}