import React, { useEffect } from "react";
import { FC, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import TextField from '../../components/TextField';
import CardHeader from '../../components/CardHeader';
import right_arrow from '../../assets/right_arrow_icon.svg';
import { ReactSVG } from "react-svg";
import { TMarket } from "../../types/Market";
import { SyncLoader } from 'react-spinners';
import { searchDetailInMarkets } from '../../services/DetailApi';
import { TDetail } from "../../types/Detail";
import Market from "../../markets/Market";
import toast from "react-hot-toast";

// @ts-ignore
import styles from './CommonDetail.module.css';
// @ts-ignore
import detail_info_styles from './MarketDetailInfo.module.css';


function CommonDetail() {
    const location = useLocation();
    const detail = location.state;
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { vin } = useParams();
    const [inMarkets, setInMarkets] = useState<TDetail[]>();
    const handleItemClick = (item: any) => {
        // setSelectedItem(item);
        // setIsPanelOpen(true);
        console.log("O$KO")
        navigate(`/common/detail/${item.vin}`);
    };

    // useEffect(() => {
    //     searchDetailInMarkets(detail.vin)
    //         .then((res) => {
    //             setInMarkets(res);
    //             setLoading(false);
    //             console.log('NOOoops');
    //         })
    //         .catch((err) => {
    //             console.log('Ooops', err);
    //             setLoading(false);
    //         })
    // }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Убедитесь, что загрузка включена перед началом
                const res = await searchDetailInMarkets(detail.vin);
                setInMarkets(res);
                console.log('Найденные детали:', res);
            } catch (err) {
                console.log('Ooops', err);
                toast.error('Не удалось найти детали');
            } finally {
                setLoading(false); // Обязательно выключите загрузку в любом случае
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.common_search__CommonDetail}>
            <div className={styles.common_search__CommonDetailContent}>
                <div className={styles.common_search__header}>
                    <CardHeader label="Поиск" isMarketNameVisible={true} marketName={detail.vin} />

                </div>
                {loading ?
                    <div className={styles.LoaderWrapper}>
                        <SyncLoader color="#A7A7A7" />
                    </div>
                    : !inMarkets || inMarkets.length === 0 ?
                        <div className={styles.NumberDoesNotExist} >
                            <p>Ничего не найдено </p>
                        </div>
                        :
                        <div className={styles.DetailMarketsContainer}>
                            {inMarkets && inMarkets.map((el) => {
                                console.log(el);
                                return el ? <MarketDetailInfo detail={el} key={el.market} /> : null;
                            })}
                        </div>

                }
            </div >

        </div >

    );
}

interface MarketDetailInfoProps {
    detail: TDetail;
}

function MarketDetailInfo({ detail }: MarketDetailInfoProps) {
    return (
        <div className={detail_info_styles.MarketItem}>
            <div className={detail_info_styles.MarketItemContent}>
                <div className={detail_info_styles.NameCutter}>
                    <TextField text={detail.market} isPrimary={true} />
                </div>
                {detail.amount && (
                    <div className={detail_info_styles.MarketAddress}>
                        <span className={detail_info_styles.HelperText}>Количество:</span>
                        <span className={detail_info_styles.PrimaryText}>{detail.amount}</span>
                    </div>
                )}
                {detail.amount && (
                    <div className={detail_info_styles.MarketAddress}>
                        <span className={detail_info_styles.HelperText}>Цена:</span>
                        <span className={detail_info_styles.PrimaryText}>{detail.price}</span>
                    </div>
                )}

            </div>
            {/* <ReactSVG src={right_arrow} /> */}
        </div>
    );
}


export default CommonDetail;


