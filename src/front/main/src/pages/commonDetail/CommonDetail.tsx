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
// @ts-ignore
import styles from './CommonDetail.module.css';




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

    useEffect(() => {
        searchDetailInMarkets(detail.vin)
            .then((res) => {
                setInMarkets(res);
                setLoading(false);
            })
            .catch((err) => {
                console.log('Ooops');
                setLoading(false);
            })
    }, [])



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
                        <div className={styles.detailMarketsContainer}>
                            {inMarkets && inMarkets.map((el) => {
                                return <MarketDetailInfo detail={el} key={el.market} />;
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
        <div className={styles.MarketItem}>
            <div className={styles.MarketItemContent}>
                <div className={styles.NameCutter}>
                    <TextField text={detail.market} />
                </div>
                {detail.amount && (
                    <div className={styles.MarketAdress}>
                        <span className={styles.HelperText}>Количество</span>
                        <span className={styles.PrimaryText}>{detail.amount}</span>
                        <span className={styles.HelperText}>Цена</span>
                        <span className={styles.PrimaryText}>{detail.price}</span>
                    </div>
                )}

            </div>
            <ReactSVG src={right_arrow} />
        </div>
    );
}


export default CommonDetail;


