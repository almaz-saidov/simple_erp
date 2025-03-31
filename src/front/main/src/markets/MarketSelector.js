import '../styles/App.css'
import '../styles/Markets.css'

import { createTheme } from '@mui/material/styles'
import React, { ReactSvg, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'
import { fetchMarkets } from '../services/MarketsApi'
import { MarketContext } from './MarketContext'
import MarketItem from './MarketItem'



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
                await fetchMarkets(setMarkets);
            } catch (error) {
                console.error("Ошибка при загрузке рынков:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMarketsWrapper().then((server_markets) => { }).catch(() => {

        })


    }, []);

    useEffect(() => {

        if (markets.length > 0) {
            const user_status = localStorage.getItem('user_status');

            if (user_status)
                if (user_status !== "StatusObject.admin") {
                    // markets[0] && navigate(`/markets/${markets[0].id}`);
                } else {
                }
        }
    }, [markets])

    const onMarketClick = (market) => {
        setValue(market);
        navigate(`/markets/${market.id}`);
    }

    const onCreateMarketButtonClick = () => {
        navigate(`/markets/create`);
    }

    const onCommonSearchButtonClick = () => {
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
                        <button className="CommonSearchButton" onClick={onCreateMarketButtonClick} >
                            <ReactSvg />
                        </button >
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
