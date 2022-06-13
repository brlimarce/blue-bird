/**
 * -- Field
 * This serves as a component for
 * the authentication field.
 */
import React from 'react';

export default function Field({ inputId, inputType, inputLabel, isDual, onValidateHandler }) {
    return (
        <div className={isDual? 'form-floating mb-4 col-6 me-2' : 'form-floating mb-4'}>
            <input
                type={inputType}
                className={'form-control'}
                id={inputId} 
                placeholder={inputLabel}
                autoComplete='off'
                onChange={onValidateHandler}
                onBlur={onValidateHandler}
            />
            <label id={inputId + '-label'} for={inputId}>{inputLabel}</label>
        </div>
    );
}