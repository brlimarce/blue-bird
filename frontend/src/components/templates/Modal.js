/**
 * -- Modal.js
 * This serves as the base for
 * all modals.
 */
import React from 'react';
export default function Modal(props) {
    return (
        <div className='modal' tabindex='-1' id={props.modalId}>
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    {/* Start of Header */}
                    <div className='modal-header'>
                        <h5 className={
                            props.titleColor === 'danger'?
                            'modal-title fw-semibold text-danger' :
                            'modal-title fw-semibold text-primary'
                        }>
                            {props.title}
                        </h5>

                        <button 
                            type='button' 
                            className='btn-close' 
                            data-bs-dismiss='modal' 
                            aria-label='Close'
                        ></button>
                    </div>
                    {/* End of Header */}

                    {/* Start of Body */}
                    <div className='modal-body'>
                        {props.body}
                    </div>
                    {/* End of Body */}

                    {/* Start of Footer */}
                    {
                        props.btnLabel?
                        <div className='modal-footer'>
                            <button 
                                type='button' 
                                className='btn btn-secondary' 
                                data-bs-dismiss='modal'
                            >Close</button>

                            <button 
                                type='button' 
                                className={
                                    props.titleColor === 'danger'?
                                    'btn btn-danger' :
                                    'btn btn-primary' 
                                }
                                onClick={props.clickHandler}
                            >{props.btnLabel}</button>
                        </div> : undefined
                    }
                    {/* End of Footer */}
                </div>
            </div>
        </div>
    );}