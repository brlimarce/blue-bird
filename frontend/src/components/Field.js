/**
 * -- Field
 * This contains the component for
 * the input field.
 */
import React from 'react';
export default function Field(props) {
    // Create classes for dual and error fields.
    const containerClass = 'form-floating mb-4' + (props.dual? ' col-6 me-3' : '');
    const controlClass = 'form-control' + (typeof props.invalid !== 'undefined' && !props.invalid? ' is-invalid' : '');
    return(
        <div className={containerClass}>
            {/* Start of Input Field */}
            <input
                type={props.type}
                className={controlClass}
                id={props.name}
                placeholder={props.label}

                disabled={props.disabled}
                autoComplete='off'

                onChange={props.changeHandler}
                onBlur={props.changeHandler}
            />
            
            {/* {
                !props.invalid?
                <div className='invalid-feedback'>
                    {props.errorMessage}
                </div> : undefined
            } */}
            {/* End of Input Field */}
            
            {/* Start of Label */}
            <label 
                id={props.name + '-label'}
                htmlFor={props.name}
            >{props.label}</label>
            {/* End of Label */}
        </div>
    );}