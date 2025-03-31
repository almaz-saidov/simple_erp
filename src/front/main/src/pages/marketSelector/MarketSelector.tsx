import { createTheme } from '@mui/material/styles'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'
import { ReactSVG } from "react-svg"
import search_icon from '../../assets/search_icon.svg'
import { MarketContext } from '../../markets/MarketContext'
import MarketItem from '../../markets/MarketItem'
import { fetchMarkets } from '../../services/MarketsApi'
import { TMarket } from '../../types/Market'

// @ts-ignore
import styles from './MarketSelector.module.css'


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
        navigate(`/markets/${market.id}`);
    }

    const onCommonSearchClick = () => { 
        navigate(`/common/search`);
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
