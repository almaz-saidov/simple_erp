import { useState, useEffect } from 'react';
import { ReactComponent as SearchIcon } from '../assets/search_icon.svg';
import CoolDatePicker from './CoolDatePicker'
import '../styles/Components.css';
import dayjs from 'dayjs';


function Input(props) {
    const {
        label,
        hint,
        value,
        isLong,
        parentText,
        setParentText,
        isDynamic,
        type,
        isSearch,
        maxLength,
        isNeedText,
        iconOnClick,
        disabled,
    } = props;

    Input.defaultProps = {
        label: "",
        hint: "hint",
        value: "",
        isLong: false,
        parentText: undefined,
        setParentText: undefined,
        isDynamic: false,
        type: "text",
        isSearch: false,
        maxLength: 100,
        isNeedText: false,
        disabled: false,
        // iconOnClick: undefined,

    }


    const [text, setText] = useState(value || '');

    const handleChange = (event) => {
        const newText = event.target.value;
        setText(newText);
        if (isDynamic) {
            setParentText && setParentText(newText);
        }
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
        <div className={isLong ? "LongInputWrapper" : "InputWrapper"} style={{ opacity: disabled ? 0.5 : 1 }} >
            <label>{label}</label>
            <div className={isNeedText ? "NeedText" : "NotNeedText"}>
                <div className='SearchInput'>
                    {type == 'date' ?
                        <CoolDatePicker
                            onChangeFunc={handleDatePickerChange}
                            value={parentText}
                        />
                        : <input
                            type={type}
                            placeholder={hint}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            value={text}
                            maxLength={maxLength ? maxLength : 255}
                            disabled={disabled}
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
