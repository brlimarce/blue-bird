/**
 * -- Modal
 * This serves as the base template
 * for the modal.
 */
import React from 'react';

export default function Modal({ title, titleColor, body, btnLabel, onClickHandler, modalId }) {
    return (
        <div className='modal' tabindex='-1' id={modalId}>
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    {/* Start of Header */}
                    <div className='modal-header'>
                        <h5 className={
                            titleColor === 'danger'?
                            'modal-title fw-semibold text-danger' :
                            'modal-title fw-semibold text-primary'
                        }>
                            {title}
                        </h5>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    {/* End of Header */}

                    {/* Start of Body */}
                    <div className='modal-body'>
                        {body}
                    </div>
                    {/* End of Body */}

                    {/* Start of Footer */}
                    <div className='modal-footer'>
                        <button 
                            type='button' 
                            className='btn btn-secondary' 
                            data-bs-dismiss='modal'
                        >Close</button>

                        <button 
                            type='button' 
                            className={
                                titleColor === 'danger'?
                                'btn btn-danger' :
                                'btn btn-primary' 
                            }
                            onClick={onClickHandler}
                        >{btnLabel}</button>
                    </div>
                    {/* End of Footer */}
                </div>
            </div>
        </div>
    );
}
