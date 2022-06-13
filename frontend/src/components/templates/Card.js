/**
 * -- Card.js
 * This serves as the base template
 * for data in the app.
 */
import React from 'react';
export default function Card(props) {
    return (
        <div className='card shadow-sm border-0 mb-3'>
            {/* Start of Card Header */}
            {
                props.header?
                <div className='card-header bg-white mt-1'>
                    {props.header}
                </div> : null
            }
            {/* End of Card Header */}

            {/* Start of Card Body */}
            <div className='card-body'>
                {props.body}
            </div>
            {/* End of Card Body */}

            {/* Start of Card Footer */}
            {
                props.footer?
                <div className='card-footer text-muted bg-white'>
                    {props.footer}
                </div> : null
            }
            {/* End of Card Footer */}
        </div>
    );}