import '../styles/App.css';
import '../styles/Markets.css'

import { Fragment, useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { MarketContext } from './MarketContext';
import React, { useContext } from 'react';
import { fetchMarkets } from '../api/MarketsApi';
import { SyncLoader } from 'react-spinners';
import MarketItem from './MarketItem';



const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


function MarketSelector() {
    const [loading, setLoading] = useState(true);
    const [selected_market_id, setSelectedMarketId] = React.useState('');
    const [markets, setMarkets] = React.useState([]);
    const { value, setValue } = useContext(MarketContext);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchMarketsWrapper = async () => {
            try {
                fetchMarkets(setMarkets);
            } catch (error) {
                console.error("Ошибка при загрузке рынков:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMarketsWrapper();
        // setLoading(false);
        // setMarkets([
        //     { id: "123", name: "tatmak", address: "Kazan" },
        //     { id: "123", name: "tatmak", address: "Kazan" },
        //     { id: "123", name: "tatmak", address: "Kazan" },
        //     { id: "123", name: "tatmak", address: "Kazan" },
        //     { id: "123", name: "tatmak", address: "Kazan" },
        //     { id: "123", name: "tatmak", address: "Kazan" },
        //     { id: "123", name: "tatmak", address: "Kazan" },
        //     { id: "123", name: "tatmak", address: "Kazan" },
        //     { id: "123", name: "tatmak", address: "Kazan" },
        //     { id: "123", name: "tatmak", address: "Kazan" },
        //     { id: "123", name: "tatmak", address: "Kazan" },
        // ]);

    }, []);

    const onMarketClick = (market) => {
        setValue(market);
        navigate(`/markets/${market.id}`);
    }

    const onCreateMarketButtonClick = () => {
        navigate(`/markets/create`);
    }

    const displayMarketsList = () => {
        return markets.map((el) => (
            <MarketItem market={el} onClick={onMarketClick} />


        ));
    };


    return (
        <div className="MarketSelector">
            {loading ?
                <div className='LoaderWrapper'>
                    <SyncLoader color="#A7A7A7" />
                </div>
                : <>
                    <h1>Выберите магазин</h1>
                    <div className='MarketsList'>
                        <div className='MarketListScroll'>
                            {displayMarketsList()}
                        </div>
                    </div>
                    <footer>
                        <button className="CreateMarketButton" onClick={onCreateMarketButtonClick} >
                            <div className='CrossHorizontal' />
                            <div className='CrossVertical' />
                        </button >
                    </footer>

                </>
            }
        </div >
    );
}

export default MarketSelector;
