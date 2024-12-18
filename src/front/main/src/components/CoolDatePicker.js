import { useEffect, useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';


import '../styles/Components.css'

function CoolDatePicker(props) {
    const { onChangeFunc, value } = props;
    const [date, setDate] = useState(dayjs('дд/мм/гггг')); // Установите начальное значение как dayjs объект

    // Создайте базовую тему
    const baseTheme = createTheme();

    const newTheme = (theme) => createTheme({
        ...theme,
        components: {
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        width: "100%",
                        height: "50px",
                        color: 'var(--color-primary-text)',
                    },
                    '&.Mui-focused': {
                        borderColor: 'var(--color-base-border)',
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        width: "100%",
                        height: "50px",
                        color: "var(--color-base-border)",
                        borderRadius: '5px',
                        border: '5x solid',
                        backgroundColor: "var(--color-input-background)",
                        borderColor: 'var(--color-base-border)',
                        '&.Mui-focused': {
                            borderColor: 'var(--color-primary-text)',
                        },
                        '& label.Mui-focused': {
                            color: '#A0AAB4',
                        },

                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'var(--color-base-border)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'var(--color-primary-text)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--color-primary-text)',
                            },
                        },
                    },
                },
            },
        },
    });

    const changeHandler = (newValue) => {
        setDate(newValue);
        onChangeFunc
            && onChangeFunc();
    }


    return (
        <div className="MGDatePicker">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={newTheme(baseTheme)}>
                    <MobileDatePicker
                        onChange={changeHandler} // Устанавливайте состояние
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="дд/мм/гггг"
                                fullWidth
                            />
                        )}
                        value={value.isValid() ? value : undefined}
                    />
                </ThemeProvider>
            </LocalizationProvider>
        </div>
    );
}

export default CoolDatePicker;
