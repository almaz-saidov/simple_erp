import { useState, useRef, useEffect } from 'react';
import { ReactComponent as SearchIcon } from '../assets/search_icon.svg';
import CoolDatePicker from './CoolDatePicker'
import '../styles/Components.css';
import dayjs from 'dayjs';


function Input(props) {
    const { label, hint, value, isLong, parentText, setParentText, isDynamic, type, isSearch, maxlength, isNeedText, iconOnClick, onfocus } = props;
    const [text, setText] = useState(value || '');
    const inputRef = useRef(null);

    const handleChange = (event) => {
        const newText = event.target.value;
        setText(newText);
        if (isDynamic) {
            setParentText && setParentText(newText);
        }
    };
    const handleFocus = () => {
        onfocus(true);
        setTimeout(() => {

            if (inputRef.current) {

                inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

            }

        }, 10); // Подберите время ожидания для вашей ситуации

    };



    const handleDatePickerChange = (newTextDayjs) => {
        setParentText(newTextDayjs.format('YYYY-MM-DD'));
    }
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
            <div className={isNeedText ? "NeedText" : "NotNeedText"}>
                <div className='SearchInput'>
                    {type == 'date' ?
                        <CoolDatePicker
                            onChangeFunc={handleDatePickerChange}
                            value={parentText}
                        />
                        : <input
                            ref={inputRef}
                            type={type}
                            placeholder={hint}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            onBlur={() => { onfocus(false) }}
                            value={text}
                            maxLength={maxlength ? maxlength : 255}
                            required
                        />}

                    {isSearch ? (
                        <SearchIcon className='InputSearchIcon' onClick={handleIconClick} />
                    ) : <></>}
                </div>
            </div>

        </div >
    );
}

export default Input;
