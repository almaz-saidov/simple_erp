import React from "react";
import CardHeader from "../../components/CardHeader";
import Input from '../../components/Input'
import Detail from "../../components/Detail/Detail";
import { SyncLoader } from 'react-spinners'
import { useEffect, useState, useContext } from 'react';
import { fetchDetailsNew, deleteDetailById } from "../../services/Api";
import { MarketContext } from '../../markets/MarketContext';
import SlidePanel from "../../components/slide_panel/SlidePanel";
import { DeleteButton } from '../../components/SubmitButton';
import toast from 'react-hot-toast';
import { TDetail } from '../../types/Detail';
import { searchDetails } from '../../services/DetailApi';

// @ts-ignore
import styles from './Search.module.css';
// @ts-ignore
import '../../styles/Components.css';

function Search() {
    const [detailNumber, setDetailNumber] = useState('');
    const [data, setData] = useState<TDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [detail, setDetail] = useState(null);
    const { value, setValue } = useContext(MarketContext);
    const [selectedItem, setSelectedItem] = useState<TDetail>();
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const handleItemClick = (item: any) => {
        setSelectedItem(item);
        setIsPanelOpen(true);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
    };

    const loadDetails = () => {
        if (data.length == 0) {
            return (
                <div className={styles.NumberDoesNotExist} >
                    < span > Ничего < br /> не найдено</span >
                </div >
            )
        }

        return (<div className={styles.DetailsWrapper}>
            {
                data.map((el, index) => (
                    <Detail detail={el} key={index} onClick={() => handleItemClick(el)} displayPrice={true} />
                ))
            }
            <div className='Space' />
        </div>
        )
    }

    const lookForDetails = async () => {
        setLoading(true);
        try {
            const details = await searchDetails(detailNumber, value.id);
            setData(details);
        } catch (e) {
            console.log(e);
            toast.error('Не удалось найти детали.');
        }

        setLoading(false);
    }

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
        <div className={styles.Search}>
            <CardHeader label="Поиск" marketName={value.name} />
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


    );
}

export default Search;