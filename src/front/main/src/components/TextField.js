import '../styles/Components.css'
import { useState } from 'react';

function TextField(props) {
    const { textDescription, text, isLong, isPrimary } = props;

    return (
        <div className={isLong ? "LongTextField" : "TextField"}>
            <span className='TextDescription'>{textDescription}</span>
            <p className={isPrimary ? 'TextFieldPrimary' : 'Text'}
            >{text}</p>
        </div>
    );
}

export default TextField;
