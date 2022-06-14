/**
 * -- Login.js
 * This serves as the page for
 * the login form.
 */
import React from 'react';
import * as toast from '../scripts/Toast';
import Cookies from 'universal-cookie';

import AuthForm from '../components/templates/AuthForm';
import Field from '../components/Field';

class Login extends React.Component {
    constructor(props) {
        // Set up the state.
        super(props);
        this.state = {
            ids: {
                email: 'email',
                password: 'password'
            },

            flags: {
                email: undefined,
                password: undefined
            },

            errors: {
                email: undefined,
                password: 'Password is required'
            },

            undefined: 'undefined'
        }

        // Bind the `this` keyword.
        this.onChangeTextField = this.onChangeTextField.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }

    // Handle the validation of the fields.
    onChangeTextField(e) {
        // Check if the field has input.
        const field = e.target;
        switch(field.id) {
            case this.state.ids.email:
                // Check if the field has a value.
                let isEmailValid = true;
                if (!field.value) {
                    isEmailValid = false;
                    this.setState({
                        errors: {
                            email: (field.value)? this.state.errors.email : 'Email is required.'
                        }});
                }
                
                // Check if the email follows the format.
                if (isEmailValid) {
                    // Check if the email follows its format.
                    const regexp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
                    if (!regexp.test(field.value)) {
                        isEmailValid = false;
                        this.setState({
                            errors: {
                                email: (field.value)? this.state.errors.email : 'The email is not following the correct format.'
                            }});
                    }
                }

                // Set the flag.
                this.setState({
                    flags: {
                        email: isEmailValid,
                        password: this.state.flags.password
                    }}); 
                break;
            case this.state.ids.password:
                // Check if the field has a value.
                this.setState({
                    flags: {
                        email: this.state.flags.email,
                        password: (field.value)? true : false
                    }});
                break;
            default:
                console.log();
        }
    }

    // Submit the signup form.
    onSubmitForm(e) {
        // Store a flag for the form's validity.
        let isValid = true;

        // Check for a field's validity.
        if (typeof this.state.flags.email === this.state.undefined || !this.state.flags.email)
            isValid = false;
        if (typeof this.state.flags.password === this.state.undefined || !this.state.flags.password)
            isValid = false;
        
        // Submit the form if it is valid.
        if (isValid) {
            // Prevent the webpage from reloading.
            e.preventDefault();

            // Transform inputs into lowercase or capitalized.
            const email = document.getElementById(this.state.ids.email).value.toLowerCase();

            // Create the user object.
            const credentials = {
                email: email,
                password: document.getElementById(this.state.ids.password).value
            };

           // Send a POST request.
            fetch(
                'http://localhost:3001/log-in',
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
                        Object.values(this.state.ids).forEach((v) => {
                            document.getElementById(v).value = null;
                        });
                        
                        // Redirect to the feed.
                        window.location = '/feed';
                    } else
                        toast.displayError(body.message);
                });
        } else
            toast.displayError('One of your field/s is/are invalid. Try again!');
    }

    render() {
        return(
            <div className='container-fluid login'>
                <div className='row'>
                    {/* Divider */}
                    <div className='col'></div>

                    {/* Start of Login Form */}
                    <AuthForm
                        id='login'
                        header={'Log in.'}
                        description={'Hey there! Are you ready to check out what\'s been on the trend lately?'}
                        submitHandler={this.onSubmitForm}

                        fields={
                            <div>
                                {/* Start of Email */}
                                <Field
                                    name={this.state.ids.email}
                                    type={'email'}
                                    label={'E-mail Address'}

                                    invalid={this.state.flags.email}
                                    errorMessage={this.state.errors.email}
                                    changeHandler={this.onChangeTextField}
                                />
                                {/* End of Email */}

                                {/* Start of Password */}
                                <Field
                                    name={this.state.ids.password}
                                    type={'password'}
                                    label={'Password'}
                                    
                                    invalid={this.state.flags.password}
                                    errorMessage={this.state.errors.password}
                                    changeHandler={this.onChangeTextField}
                                />
                                {/* End of Password */}
                            </div>
                        }
                    />
                    {/* End of Login Form */}

                    {/* Start of Toast */}
                    <div className='col'>
                        <toast.Toast />
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
        );}
}

export default Login;