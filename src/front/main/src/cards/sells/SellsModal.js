import React, { use } from 'react';

import TextField from '../../components/TextField';
import Checkbox from '../../components/CheckBox';
import { useState, useEffect, useContext } from 'react';
import { ReactComponent as LeftArrow } from '../../assets/left_arrow_icon.svg';
import { ReactComponent as AirIcon } from '../../assets/air_icon.svg';
import { fetchPurchasesById, fetchSellById } from '../../services/Api'
import { SyncLoader } from 'react-spinners';
import { MarketContext } from '../../markets/MarketContext'
import Input from '../../components/Input';
import { IssuanceButton } from '../../components/SubmitButton';
import toast from 'react-hot-toast';
import { createPurchase } from '../../services/Api';

import '../../styles/Cards/Returns.css';
import './SellsModal.css'

const SellsModal = ({ isOpen, onClose, itemData, updateSell }) => {
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState({});
    const [isNeedText, setIsNeedText] = useState(false);
    const [count, setCount] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [seller, setSeller] = useState('');
    const [detailName, setDetailName] = useState('');
    const { value, setValue } = useContext(MarketContext);
    const [ethanol, setEthanol] = useState({});


    useEffect(() => {
        const fetchItemData = async () => {
            setLoading(true);
            try {
                const newItem = await fetchSellById(itemData.id, value.id);
                setEthanol(newItem);
                setItem(newItem);
                // setCount(newItem.count);
                // setDate(newItem.date);
                // setPrice(newItem.price);
                // setSellerName(newItem.name);
            } catch (error) {
                console.error('Ошибка при загрузке данных возврата:', error);
            } finally {
                setLoading(false);
            }
        };
        if (itemData.id !== undefined) {
            fetchItemData();
        }
    }, [itemData]);

    if (!isOpen) return null;


    const handleClose = (e) => {
        if (e.target.id === 'modal-overlay') {
            onClose();
        }
    };

    const getPurchase = () => {
        return {
            vin: itemData.detailNumber,
            amount: parseInt(item.count),
            date: item.date,
            price: parseFloat(item.price),
            detail_name: item.detailName,
        }
    }

    const isBadPurchase = () => {
        return item.count.length === 0 || item.date.length === 0 || item.name.length === 0 || item.price.length === 0;
    }

    const resetPurchaseInput = () => {
        setCount('');
        setDate('');
        setPrice('');
        setSeller('');
    }

    const addPurchaseWithToast = () => {
        toast.promise(createPurchase(getPurchase(), value.id), {
            loading: 'Создание',
            success: () => {
                resetPurchaseInput();
                return 'Выдача создана';
            },
            error: 'Что то пошло не так',
        });
    }

    const notify = () => toast.error('Заполниет все обязательные поля');

    // useEffect(() => {
    //     //console.log("IssuanceGot new Text");
    // }, [partNumber, count, date, price, seller]);

    const submitButtonClick = () => {
        if (isBadPurchase()) {
            setIsNeedText(true);
            notify();
        } else if (ethanol.price !== item.price || ethanol.date !== item.date || item.name !== ethanol.name || item.count !== ethanol.count) {
            setIsNeedText(false);
            updateSell(item, itemData.id, setLoading);
        } else {
            toast('Ничего не изменилось!', {
                icon: '🤔',
            });
        }
    }

    return (
        <div className="modal-overlay" id="modal-overlay" onClick={handleClose}>
            <div className="ModalContent">
                <div className='SellsModalMain'>
                    <header className='ModalHeader'>
                        <h1>Выдача</h1>
                        <button className="backButton" onClick={onClose}><LeftArrow /> Назад</button>
                    </header>
                    {loading ?
                        <div className='LoaderWrapper'>
                            <SyncLoader color="#A7A7A7" />
                        </div> :
                        <div className='HistoryModalItem'>
                            < Input
                                label="Номер запчасти"
                                hint={itemData.detailNumber}
                                isDynamic={true}
                                maxLength={11}
                                isNeedText={false}
                                disabled={true}
                            />
                            <Input label="Количество" hint="000" parentText={item.count} value={item.count} setParentText={(value) => { setItem({ ...item, count: value }) }} type="number" isDynamic={true} maxlength={10} isNeedText={isNeedText} />
                            <Input label="Дата поступления" parentText={item.date} value={item.date} setParentText={(value) => { setItem({ ...item, date: value }) }} type="date" isDynamic={true} maxlength={10} isNeedText={isNeedText} />
                            <Input label="Цена" hint="00 000.00 ₽" parentText={item.price} value={item.price} setParentText={(value) => { setItem({ ...item, price: value }) }} type="number" isDynamic={true} maxlength={15} isNeedText={isNeedText} />
                            <Input label="Продавец" hint="Женя" isLong={true} parentText={item.name} value={item.name} setParentText={(value) => { setItem({ ...item, name: value }) }} type="text" isDynamic={true} maxlength={40} isNeedText={isNeedText} />
                            < Input
                                label="User"
                                hint={item.whoAdded}
                                isDynamic={true}
                                maxLength={11}
                                isNeedText={false}
                                disabled={true}
                                isLong={true}
                            />
                        </div>
                    }

                </div>
                <IssuanceButton
                    onClick={submitButtonClick}
                    label="Сохранить поступление"
                    disabled={loading}
                    needConfirmation={true} />
            </div>

        </div >
    );
};

export default SellsModal;