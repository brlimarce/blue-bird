/**
 * -- Card Template
 * This serves as a template
 * for a card.
 */
import React from 'react';

export default function CardTemplate({ cardHeader, cardBody, cardFooter }) {
    return (
        <div className='card shadow-sm border-0 mb-3'>
            {/* Start of Card Header */}
            {
                cardHeader?
                <div className='card-header bg-white mt-1'>
                    {cardHeader}
                </div> : null
            }
            {/* End of Card Header */}

            {/* Start of Card Body */}
            <div className='card-body'>
                {cardBody}
            </div>
            {/* End of Card Body */}

            {/* Start of Card Footer */}
            {
                cardFooter?
                <div className='card-footer text-muted bg-white'>
                    {cardFooter}
                </div> : null
            }
            {/* End of Card Footer */}
        </div>
    );
}