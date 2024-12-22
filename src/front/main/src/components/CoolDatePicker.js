import { useEffect, useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

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
                        paddingRight: '0px',
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        width: "100%",
                        minWidth: "100px",
                        height: "50px",
                        color: "var(--color-base-border)",
                        borderRadius: '5px',
                        backgroundColor: "var(--color-input-background)",
                        paddingRight: '0px',
                        // Убираем отступы
                        margin: 0, // Убираем отступы у корня текстового поля
                        '&.Mui-focused': {
                            borderColor: 'var(--color-primary-text)',
                        },
                        '& label.Mui-focused': {
                            color: '#A0AAB4',
                        },

                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: 'none', // Убираем границу
                            },
                            '&:hover fieldset': {
                                borderColor: 'transparent', // Убираем границу при наведении
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'transparent', // Убираем границу в фокусе
                            },
                            // Убираем внутренние отступы
                            padding: '0', // Убираем внутренние отступы
                        },
                    },
                },
            },
        },
    });


    const changeHandler = (newValue) => {
        setDate(newValue);
        onChangeFunc
            && onChangeFunc(newValue);
    }


    return (
        <div className="MGDatePicker">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
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
                        value={value ? dayjs(value) : null}
                        fullWidth
                    />
                </ThemeProvider>
            </LocalizationProvider>
        </div>
    );
}

export default CoolDatePicker;
