import '../styles/Components.css'
import { useState } from 'react';

function TextField(props) {
    const { textDescription, text, isLong } = props;

    return (
        <div className={isLong ? "LongTextField" : "TextField"}>
            <span className='TextDescription'>{textDescription}</span>
            <span className='Text' 
            >{text}</span>
        </div>
    );
}

export default TextField;
