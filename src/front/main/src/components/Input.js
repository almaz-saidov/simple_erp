import { useState, useEffect } from 'react';
import { ReactComponent as SearchIcon } from '../assets/search_icon.svg';
import '../styles/Components.css';

function Input(props) {
    const { label, hint, value, isLong, parentText, setParentText, isDynamic, type, isSearch, maxlength, isNeedText, iconOnClick } = props;
    const [text, setText] = useState(value || '');

    const handleChange = (event) => {
        const newText = event.target.value;
        setText(newText);
        if (isDynamic) {
            setParentText && setParentText(newText);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // 1 
            handleSearch();
        }
    };

    const handleSearch = () => {
        setParentText && setParentText(text);
    };

    const handleIconClick = () => {
        handleSearch();
        iconOnClick();
    };

    useEffect(() => {
        setText(value); // Обновляйте текст при изменении value
    }, [value]);

    useEffect(() => {
        parentText == "" && setText("");
    }, [parentText])

    return (
        <div className={isLong ? "LongInputWrapper" : "InputWrapper"}>
            <label>{label}</label>
            <div className={isNeedText ? "NeedText" : ""}>
                <div className='SearchInput'>
                    <input
                        type={type}
                        placeholder={hint}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        value={text}
                        maxLength={maxlength ? maxlength : 255}
                        required
                    />
                    {isSearch ? (
                        <SearchIcon className='InputSearchIcon' onClick={handleIconClick} />
                    ) : <></>}
                </div>
            </div>

        </div >
    );
}

export default Input;
