
import { useEffect, useState } from 'react';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';

function CoolDatePicker() {
    const [date, setDate] = useState('');


    const newTheme = (theme) => createTheme({
        ...theme,
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        color: '#f8bbd0',
                        borderRadius: '5px',
                        borderWidth: '1px',
                        borderColor: '#e91e63',
                        border: '1px solid',
                        backgroundColor: '#880e4f',
                    }
                }
            }
        }
    })

    return (
        <div className="MGDatePicker">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={newTheme}>
                    <DatePicker label="Basic date picker" defaultValue={dayjs('2022-04-17')} />
                </ThemeProvider>
            </LocalizationProvider>
        </div>

    );
}

export default CoolDatePicker;
