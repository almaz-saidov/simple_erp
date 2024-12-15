import React, { useState } from 'react';

import "../styles/Components.css"

const Checkbox = (props) => {
    const { label,checkedDefault, onChange } = props;
    const [isChecked, setIsChecked] = useState(checkedDefault);
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        onChange(!isChecked);
    };

    return (
        <div className='Checkbox'>
            <label>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                {" " + label}
            </label>
        </div>
    );
};

export default Checkbox;
