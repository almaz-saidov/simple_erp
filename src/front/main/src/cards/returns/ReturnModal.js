import React, { useState, useEffect, useContext } from 'react';

import Input from '../../components/Input';
import Checkbox from '../../components/CheckBox';
import { ReactComponent as LeftArrow } from '../../assets/left_arrow_icon.svg';
import { ReactComponent as AirIcon } from '../../assets/air_icon.svg';
import { SyncLoader } from 'react-spinners';
import TextField from '../../components/TextField';

import { fetchReturnById, fetchReturnHistoryById } from '../../api/Api';
import toast from 'react-hot-toast';
import { isFirstEarlier } from '../../common/common';
import { MarketContext } from '../../markets/MarketContext'


import '../../styles/Cards/Returns.css';
import '../../styles/LoaderWrapper.css'

const ReturnModal = ({ isOpen, onClose, returnData, isCreating, isAir, isHistory, loadReturns, handleApiResponse }) => {
    const [isCompleted, setCompleted] = useState(isHistory);
    const [loading, setLoading] = useState(false);
    const [vin, setVin] = useState('');
    const [amount, setAmount] = useState('');
    const [sellDate, setSellDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [price, setPrice] = useState('');
    const [seller, setSeller] = useState('');
    const [comment, setComment] = useState('');
    const [store, setStore] = useState('');
    const [isBadInput, setIsBadInput] = useState(false);
    const [whoAdded, setWhoAdded] = useState('');
    const { value, setValue } = useContext(MarketContext);


    const setDisplayedReturn = (returnObj) => {

        setVin(returnObj.detailNumber || '');
        setAmount(returnObj.count || '');
        setSellDate(returnObj.sellDate || '');
        setReturnDate(returnObj.date || '');
        setPrice(returnObj.price || '');
        setSeller(returnObj.seller || '');
        setComment(returnObj.comment || '');
        setStore(returnObj.store || '');
        setWhoAdded(returnObj.whoAdded || '');

    }

    const fetchReturn = async () => {
        setLoading(true);
        try {
            let tmpReturn = {}

            if (isHistory) {
                tmpReturn = returnData.id !== undefined ? await fetchReturnHistoryById(returnData.id, isAir, value.id) : {};
            } else {
                tmpReturn = returnData.id !== undefined ? await fetchReturnById(returnData.id, isAir, value.id) : {};
            }

            tmpReturn.id = returnData.id;

            setDisplayedReturn(tmpReturn);
        } catch (error) {
            console.error('Ошибка при загрузке данных возврата:', error);
            toast.error('Не удалось загрузить данные возврата.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isCreating) {
            fetchReturn();
        } else {
            setDisplayedReturn(returnData);
        }
    }, [returnData])


    if (!isOpen || returnData === null) return null;


    const getReturn = () => {
        return {
            vin: vin,
            amount: parseInt(amount),
            sell_date: sellDate,
            return_date: returnDate,
            to_seller: seller,
            another_shop: store,
            price: parseInt(price),
            comment: comment,
            is_compleat: isCompleted || false,
        }

    }

    const handleClose = (e) => {
        if (e.target.id === 'modal-overlay') {
            setCompleted(false);
            setIsBadInput(false);
            onClose();
        }
        //setIsBadInput(false);
    };

    const isFilledReturn = () => {
        if (vin === '' ||
            amount === '' ||
            sellDate === '' ||
            returnDate === '' ||
            price === '' ||
            seller === '' ||
            comment === ''
            || (isAir == true && store === "")
        ) {
            return false;
        }
        return true;
    }

    const checkWithToastIsBadReturn = () => {
        let status = true;
        if (!isFilledReturn()) {
            toast.error('Заполниет все обязательные поля');
            status = false;
        }
        if (isFirstEarlier(returnDate, sellDate)) {
            toast.error('Конечная дата не может быть раньше стартовой даты');
            status = false;
        }
        return status;
    }

    const handleOnClick = () => {
        if (!checkWithToastIsBadReturn()) {
            setIsBadInput(true);
            //toast.error('Заполниет все обязательные поля');

        } else {
            setIsBadInput(false);
            let returnToSend = getReturn();
            returnToSend.id = returnData.id;
            handleApiResponse(returnToSend, isCreating, isAir);

        }
    }

    const getSubmitButtonText = () => {
        if (isHistory) {
            return isCompleted ? "Сохранить изменения" : "Сделать незавершённым"
        }
        if (isCreating && !isCompleted) {
            return "Создать " + (isAir ? "возврат-воздух" : "возврат");
        }
        return isCompleted
            ? "Завершить " + (isAir ? "возврат-воздух" : "возврат")
            : "Сохранить изменения "

    }

    return (
        <div className="modal-overlay" id="modal-overlay" onClick={handleClose}>
            <div className="ModalContent">
                <div className='ModalMain'>
                    <header className='ModalHeader'>
                        {isAir
                            ? <h1>Возврат воздух<AirIcon className="AirIcon" /></h1>
                            : <h1>Возврат</h1>}
                        <button className="backButton" onClick={() => { handleClose({ target: { id: 'modal-overlay' } }) }}><LeftArrow /> Назад</button>
                    </header>
                    {loading ?
                        <div className='LoaderWrapper'>
                            <SyncLoader color="#A7A7A7" />
                        </div> :
                        <>
                            <div className='EditReturn'>
                                {isHistory ?
                                    <TextField textDescription="Номер запчасти" text={vin} />
                                    : < Input
                                        label="Номер запчасти"
                                        hint="A22222222"
                                        value={vin}
                                        parentText={vin}
                                        setParentText={setVin}
                                        isDynamic={true}
                                        maxLength={11}
                                        isNeedText={isBadInput}
                                    />
                                }
                                <Input
                                    label="Количество"
                                    hint="000"
                                    value={amount}
                                    type="number"
                                    parentText={amount}
                                    setParentText={setAmount}
                                    isDynamic={true}
                                    maxLength={10}
                                    isNeedText={isBadInput}
                                />
                                <Input
                                    label="Дата продажи"
                                    hint="дд.мм.гггг"
                                    value={sellDate}
                                    type="date"
                                    parentText={sellDate}
                                    setParentText={setSellDate}
                                    isDynamic={true}
                                    maxLength={10}
                                    isNeedText={isBadInput}
                                />
                                <Input
                                    label="Дата возврата"
                                    hint="дд.мм.гггг"
                                    value={returnDate}
                                    type="date"
                                    parentText={returnDate}
                                    setParentText={setReturnDate}
                                    isDynamic={true}
                                    maxLength={10}
                                    isNeedText={isBadInput}
                                />
                                <Input
                                    label="Продавец"
                                    hint="Женя"
                                    value={seller}
                                    type="text"
                                    parentText={seller}
                                    setParentText={setSeller}
                                    isDynamic={true}
                                    maxLength={40}
                                    isNeedText={isBadInput}
                                />
                                <Input
                                    label="Цена"
                                    hint="00 000.00 ₽"
                                    value={price}
                                    type="number"
                                    parentText={price}
                                    setParentText={setPrice}
                                    isDynamic={true}
                                    maxLength={15}
                                    isNeedText={isBadInput} />
                                {isAir ?
                                    <Input
                                        label="Магазин посредник"
                                        isLong={true}
                                        hint="Avto Parts"
                                        parentText={store}
                                        setParentText={setStore}
                                        value={store}
                                        type="text"
                                        isDynamic={true}
                                        maxLength={40}
                                        isNeedText={isBadInput}
                                    />
                                    : <></>}
                                <Input
                                    label="Комментарий"
                                    isLong={true}
                                    hint="Коментарий"
                                    value={comment}
                                    parentText={comment}
                                    setParentText={setComment}
                                    type="text"
                                    isDynamic={true}
                                    maxLength={255}
                                    isNeedText={isBadInput}
                                />
                                {isHistory ?
                                    <TextField
                                        textDescription="User"
                                        text={whoAdded}
                                        isLong={true} />
                                    : <></>}

                            </div>
                            < Checkbox
                                label="Возврат завершён"
                                onChange={setCompleted}
                                checkedDefault={isHistory}
                            />
                        </>
                    }
                </div>
                {loading ?
                    <></>
                    : <button className='SubmitButton' onClick={handleOnClick}>
                        {getSubmitButtonText()}
                    </button>
                }
            </div>

        </div >
    );
};

export default ReturnModal;