/**
 * -- Signup.js
 * This serves as the page for
 * the signup form.
 */
import React from 'react';
import * as toast from '../scripts/Toast';
import { capitalizeName } from '../scripts/Helper';

import AuthForm from '../components/templates/AuthForm';
import Field from '../components/Field';

class Signup extends React.Component {
    constructor(props) {
        // Set up the state.
        super(props);
        this.state = {
            ids: {
                firstName: 'first-name',
                lastName: 'last-name',
                email: 'email',
                password: 'password',
                confirmPassword: 'confirm-password'
            },
            
            fnameFlag: undefined,
            lnameFlag: undefined,
            emailFlag: undefined,
            passFlags: {
                password: undefined,
                confirmPassword: undefined
            },

            errors: {
                firstName: 'First name is required.',
                lastName: 'Last name is required.',
                email: undefined,
                password: 'The password is invalid.',
                confirmPassword: 'The passwords do not match.'
            },

            undefined: 'undefined',
            invalidTag: 'is-invalid'
        }

        // Bind the `this` keyword.
        this.validatePassword = this.validatePassword.bind(this);
        this.validateConfirmPassword = this.validateConfirmPassword.bind(this);

        this.onChangeTextField = this.onChangeTextField.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }

    // Handle the validation of non-password fields.
    onChangeTextField(e) {
        // Check if the field has input.
        const field = e.target;
        switch(field.id) {
            case this.state.ids.firstName:
                // Check if the field has a value.
                this.setState({ fnameFlag: (field.value)? true : false });
                break;
            case this.state.ids.lastName:
                // Check if the field has a value.
                this.setState({ lnameFlag: (field.value)? true : false });
                break;
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
                    emailFlag: isEmailValid
                }); break;
            default:
                console.log();
        }
    }

    // Check for the password's validation.
    validatePassword(e) {
        const confirmPassword = document.getElementById(this.state.ids.confirmPassword);
        const password = e.target.value;

        // Enable `confirm password` if value is not empty.
        if (password) {
            confirmPassword.disabled = false;
        } else {
            // Reset the other field.
            confirmPassword.disabled = true;
            confirmPassword.value = null;

            // Reset the flags.
            this.setState({
                passFlags: {
                    password: undefined,
                    confirmPassword: undefined
                }});
            return;
        }

        // Check if the password is valid.
        const regexp = /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/;
        if (password.length < 8 || !regexp.test(password))
            // Set up the state.
            this.setState({
                passFlags: {
                    password: false,
                    confirmPassword: this.state.passFlags.confirmPassword
                }});
        else {
            // Set the state.
            this.setState({
                passFlags: {
                    password: true,
                    confirmPassword: !confirmPassword.value? undefined : e.target.value === confirmPassword.value
                }});
        }
    }

    // Check if both passwords match.
    validateConfirmPassword(e) {
        // Check if password is valid and the field has input.
        if (this.state.passFlags.password && e.target.value) {
            // Check if the passwords match.
            const password = document.getElementById(this.state.ids.password);
            if (password.value === e.target.value)
                this.setState({
                    passFlags: {
                        password: this.state.passFlags.password,
                        confirmPassword: true
                    }});
            else
                this.setState({
                    passFlags: {
                        password: this.state.passFlags.password,
                        confirmPassword: false
                    }
                });
        }
    }

    // Submit the signup form.
    onSubmitForm(e) {
        // Store a flag for the form's validity.
        let isValid = true;

        // Check for a field's validity.
        const flags = [this.state.fnameFlag, this.state.lnameFlag, this.state.emailFlag, this.state.passFlags.password, this.state.passFlags.confirmPassword];
        for (let i = 0; i < flags.length; i++) {
            if (typeof flags[i] === this.state.undefined || !flags[i]) {
                isValid = false;
                break;
            }
        }

        // Submit the form if it is valid.
        if (isValid) {
            // Prevent the webpage from reloading.
            e.preventDefault();

            // Transform inputs into lowercase or capitalized.
            const email = document.getElementById(this.state.ids.email).value.toLowerCase();
            const fname = capitalizeName(document.getElementById(this.state.ids.firstName).value);
            const lname = capitalizeName(document.getElementById(this.state.ids.lastName).value);

            // Create the user object.
            const user = {
                firstName: fname,
                lastName: lname,
                email: email,
                password: document.getElementById(this.state.ids.password).value,
                confirmPassword: document.getElementById(this.state.ids.confirmPassword).value
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
                        Object.values(this.state.ids).forEach((v) => {
                            document.getElementById(v).value = null;
                        });
    
                        // Display a success prompt.
                        toast.displaySuccess('Welcome, ' + user.firstName + ' ' + user.lastName + '! ❤️');
                        
                        // Redirect to the login page.
                        setTimeout(() => {
                            window.location = '/login';
                        }, toast.getTime());
                    } else
                        toast.displayError('There\'s an error in signing up. Try again!');
                });
        } else
            toast.displayError('One of your field/s is/are invalid. Try again!');
    }

    render() {
        return(
            <div className='container-fluid login'>
                <div className='row'>
                    {/* Start of Icon */}
                    <div 
                        className='col-6 auth-icon'
                        style={{
                            backgroundImage: 'url(assets/socmed-1-blue.png)'
                        }}
                    ></div>
                    {/* End of Icon */}

                    {/* Divider */}
                    <div className='col'></div>

                    {/* Start of Signup Form */}
                    <AuthForm
                        id='signup'
                        header={'Sign up.'}
                        description={'Be a fellow bird by joining the community! Receive the latest news and trends all over the globe.'}
                        submitHandler={this.onSubmitForm}

                        fields={
                            <div>
                                {/* Start of Name */}
                                <div className='d-flex flex-row justify-content-between col-12'>
                                    <Field
                                        name={this.state.ids.firstName}
                                        type={'text'}
                                        label={'First Name'}
                                        invalid={this.state.fnameFlag}
                                        
                                        dual
                                        errorMessage={this.state.errors.firstName}
                                        changeHandler={this.onChangeTextField}
                                    />

                                    <Field
                                        name={this.state.ids.lastName}
                                        type={'text'}
                                        label={'Last Name'}
                                        invalid={this.state.lnameFlag}
                                        
                                        dual
                                        errorMessage={this.state.errors.lastName}
                                        changeHandler={this.onChangeTextField}
                                    />
                                </div>
                                {/* End of Name */}

                                {/* Start of Email */}
                                <Field
                                    name={this.state.ids.email}
                                    type={'email'}
                                    label={'E-mail Address'}
                                    invalid={this.state.emailFlag}
                                    
                                    errorMessage={this.state.errors.email}
                                    changeHandler={this.onChangeTextField}
                                />
                                {/* End of Email */}

                                {/* Start of Password */}
                                <div className='d-flex flex-row justify-content-between col-12'>
                                    <Field
                                        name={this.state.ids.password}
                                        type={'password'}
                                        label={'Password'}
                                        
                                        dual
                                        invalid={this.state.passFlags.password}

                                        errorMessage={this.state.errors.password}
                                        changeHandler={this.validatePassword}
                                    />

                                    <Field
                                        name={this.state.ids.confirmPassword}
                                        type={'password'}
                                        label={'Confirm Password'}
                                        
                                        dual
                                        disabled

                                        invalid={this.state.passFlags.confirmPassword}
                                        errorMessage={this.state.errors.confirmPassword}

                                        changeHandler={this.validateConfirmPassword}
                                    />
                                </div>
                                {/* End of Password */}
                            </div>
                        }
                    />
                    {/* End of Signup Form */}

                    {/* Start of Toast */}
                    <div className='col'>
                        <toast.Toast />
                    </div>
                    {/* End of Toast */}
                </div>
            </div>
        );}
}

export default Signup;