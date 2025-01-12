import '../styles/App.css';
import '../styles/Markets.css'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Fragment, useEffect, useState } from 'react';
import Nav from '../components/Nav';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SubmitButton from '../components/SubmitButton';
import { useNavigate } from 'react-router-dom';
import { MarketContext } from './MarketContext';
import React, { useContext } from 'react';



const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


function MarketSelector() {
    const [selected_market_id, setSelectedMarketId] = React.useState('');
    const [markets, setMarkets] = React.useState([]);
    const { value, setValue } = useContext(MarketContext);

    useEffect(() => {
        setMarkets([
            { id: 1, name: 'Татмак' },
            { id: 2, name: 'Рыболовный' },
            { id: 3, name: 'Добрая столовая' },
            { id: 4, name: 'Пятёрочка' },
        ]);
    }, []);


    const displayMarketsList = () => {
        return markets.map((el) => (
            <MenuItem key={el.id} value={el.id}>
                {el.name}
            </MenuItem>
        ));
    };


    const handleChange = (event) => {
        const selectedId = event.target.value;
        const selectedMarket = markets.find(market => market.id === selectedId);

        if (selectedMarket) {
            setSelectedMarketId(selectedId);
            console.log("selectedMarket", selectedMarket);
            setValue(selectedMarket);
        } else {
            console.error('Market not found');
        }
    };

    const navigate = useNavigate();

    function onClickHandler() {
        if (selected_market_id)
            navigate(`/markets/${selected_market_id}`);
    }

    return (
        <div className="MarketSelector">
            <h1>Выберите магазин</h1>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />

                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label" ></InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selected_market_id}
                            // label="Age"
                            onChange={handleChange}
                            sx={{
                                color: 'white',
                                backgroundColor: '#2B2B2B'
                            }}

                        >
                            {displayMarketsList()}
                        </Select>
                    </FormControl>
                </Box>
            </ThemeProvider>

            <SubmitButton
                label="продолжить"
                onClick={onClickHandler}
            />

        </div >
    );
}

export default MarketSelector;
