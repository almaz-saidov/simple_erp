import React from "react";
import CardHeader from "../../components/CardHeader";
import Input from '../../components/Input'
import Detail from "../../components/Detail/Detail";
import { SyncLoader } from 'react-spinners';
import { useEffect, useState, useContext } from 'react';
import { fetchDetailsNew, deleteDetailById } from "../../services/Api";
import { MarketContext } from '../../markets/MarketContext';
import SlidePanel from "../../components/slide_panel/SlidePanel";
import { DeleteButton } from '../../components/SubmitButton';
import toast from 'react-hot-toast';
import { TDetail } from '../../types/Detail';
import { searchDetailsCommon } from '../../services/DetailApi';
import { useNavigate } from 'react-router-dom';

// @ts-ignore
import styles from './CommonSearch.module.css';
// @ts-ignore
import '../../styles/Components.css';

interface MarketSelectorProps {
    backButtonOnCick: boolean;
    setBackButtonOnCick: any;
}

function CommonSearch({ backButtonOnCick, setBackButtonOnCick }: MarketSelectorProps) {
    const [detailNumber, setDetailNumber] = useState('');
    const [data, setData] = useState<TDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [detail, setDetail] = useState(null);
    const { value, setValue } = useContext(MarketContext);
    const [selectedItem, setSelectedItem] = useState<TDetail>();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const navigate = useNavigate();

    const handleItemClick = (item: any) => {
        setSelectedItem(item);
        // setIsPanelOpen(true);
        // console.log("O$KO")
        window.Telegram.WebApp.BackButton.show();
        navigate(`/common/detail/${item.vin}`, { state: item });
    };

    const closePanel = () => {
        setIsPanelOpen(false);
    };

    const loadDetails = () => {
        if (data.length == 0) {
            return (
                <div className="NumberDoesNotExist" >
                    <span>Ничего <br /> не найдено</span>
                </div>
            )
        }

        return (<div className={styles.DetailsWrapper}>
            {
                data.map((el, index) => (
                    <Detail detail={el} key={index} onClick={() => handleItemClick(el)} />
                ))
            }
            <div className='Space' />
        </div>
        )
    }

    const lookForDetails = async () => {
        setLoading(true);
        const details = await searchDetailsCommon(detailNumber);
        setData(details);
        setLoading(false);
    }

    useEffect(() => {
        if (localStorage.getItem('user_status') === 'seller') {
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
        }
    }, [])

    useEffect(() => {
        lookForDetails();
    }, [detailNumber]);


    const getDeleteFunc = (detailNumber: string) => {
        return async () => {
            try {
                setLoading(true);
                await deleteDetailById(detailNumber);
                lookForDetails();
                toast.success("Деталь удладена");
            } catch (e) {
                console.error('Ошибка в handleApiResponse:', e);
                toast.error('Что-то пошло не так');
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div className={styles.CommonSearch}>
            <div className={styles.Search}>
                <CardHeader label="Поиск" isMarketNameVisible={false} />
                <Input label=""
                    hint="Номер запчасти"
                    isDynamic={true}
                    isLong={false}
                    setParentText={setDetailNumber}
                    isSearch={true}
                    iconOnClick={lookForDetails}
                />
                {loading ?
                    <div className='LoaderWrapper'>
                        <SyncLoader color="#A7A7A7" />
                    </div>
                    :

                    < div className={styles.SearchContent}>
                        {loadDetails()}
                    </div>}
                {selectedItem &&
                    <SlidePanel
                        isOpen={isPanelOpen}
                        onClose={closePanel}
                        children={
                            <div>
                                <Detail detail={selectedItem} />
                                <DeleteButton onClick={getDeleteFunc(selectedItem.vin)} />
                            </div>
                        }
                    />}
            </div >

        </div>

    );
}

export default CommonSearch;