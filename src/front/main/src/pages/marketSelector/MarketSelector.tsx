import React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { MarketContext } from '../../markets/MarketContext';
import { useContext } from 'react';
import { fetchMarkets } from '../../services/MarketsApi';
import { SyncLoader } from 'react-spinners';
import MarketItem from '../../markets/MarketItem';
import { TMarket } from '../../types/Market';
import { ReactSVG } from "react-svg";
import search_icon from '../../assets/search_icon.svg';

// @ts-ignore
import styles from './MarketSelector.module.css';


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});



interface MarketSelectorProps {
    backButtonOnCick: boolean;
    setBackButtonOnCick: any;
}

function MarketSelector({ backButtonOnCick, setBackButtonOnCick }: MarketSelectorProps) {
    const [loading, setLoading] = useState(true);
    const [selected_market_id, setSelectedMarketId] = useState('');
    const [markets, setMarkets] = useState<TMarket[]>([]);
    const { value, setValue } = useContext(MarketContext);
    const [userStatus, setUserStatus] = useState<string>();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMarketsWrapper = async () => {
            try {
                const res = await fetchMarkets();
                setMarkets(res);
            } catch (error) {
                console.error("Ошибка при загрузке рынков:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMarketsWrapper().then((server_markets) => {
        }).catch((e) => {
            console.log('debug__ fetch markets err', e);
        })

        const goBack = () => {
            try {
                navigate(-1);
            } catch (e) {
                console.log('debug__', e);
            }
        };
        window.Telegram.WebApp.BackButton.hide();
        if (!backButtonOnCick) {
            setBackButtonOnCick(true);
            window.Telegram.WebApp.BackButton.onClick(goBack);
        }
    }, []);

    useEffect(() => {
        const user_status = localStorage.getItem('user_status');
        if (user_status)
            setUserStatus(user_status)
        if (markets.length > 0) {
            if (user_status !== "admin") {
                markets[0] && navigate(`/markets/${markets[0].id}`);
            }
        }
    }, [markets])

    const onMarketClick = (market: TMarket) => {
        setValue(market);
        window.Telegram.WebApp.BackButton.show();
        navigate(`/markets/${market.id}`);
    }

    const onCommonSearchClick = () => {
        window.Telegram.WebApp.BackButton.show();
        // window.Telegram.WebApp.BackButton.show();
        // window.Telegram.WebApp.BackButton.onClick(() => { navigate("/markets") })
        navigate(`/common/search`);
    }

    const onCreateMarketButtonClick = () => {
        window.Telegram.WebApp.BackButton.show();
        // window.Telegram.WebApp.BackButton.show();
        // window.Telegram.WebApp.BackButton.onClick(() => { navigate("/markets") })
        navigate(`/markets/create`);
    }

    const displayMarketsList = () => {
        return markets.map((el) => (
            <MarketItem market={el} onClick={onMarketClick} />
        ));
    };


    return (
        <div className={styles.MarketSelectorWrapper}>
            <div className={styles.MarketSelector}>
                {loading ?
                    <div className={styles.LoaderWrapper}>
                        <SyncLoader color="#A7A7A7" />
                    </div>
                    : <>
                        <h1>Выберите магазин</h1>
                        <div className={styles.MarketsList}>
                            <div className={styles.MarketListScroll}>
                                {displayMarketsList()}
                            </div>
                        </div>
                        {userStatus && userStatus === 'admin' &&
                            <footer>
                                <button className={styles.CommonSearchButton} onClick={onCommonSearchClick} >
                                    <ReactSVG src={search_icon} />
                                </button >
                                <button className={styles.CreateMarketButton} onClick={onCreateMarketButtonClick} >
                                    <div className={styles.CrossHorizontal} />
                                    <div className={styles.CrossVertical} />
                                </button >
                            </footer>}

                    </>
                }
            </div >
        </div>
    );
}

export default MarketSelector;
