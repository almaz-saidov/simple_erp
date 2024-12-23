import React, { useState, useEffect } from 'react';

import Input from '../../components/Input';
import Checkbox from '../../components/CheckBox';
import { ReactComponent as LeftArrow } from '../../assets/left_arrow_icon.svg';
import { ReactComponent as AirIcon } from '../../assets/air_icon.svg';
import { SyncLoader } from 'react-spinners';
import TextField from '../../components/TextField';

import { postData, fetchReturnById, fetchReturnHistoryById, updateReturnById } from '../../api/Api';
import toast, { Toaster } from 'react-hot-toast';

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
    const [isNeedText, setIsNeedText] = useState(false);
    const [whoAdded, setWhoAdded] = useState('');

    const initTmpReturn = (returnObj) => {

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

    useEffect(() => {
        const fetchReturnData = async () => {
            setLoading(true);
            try {
                let tmpReturn = {}
                if (isHistory) {
                    tmpReturn = returnData.id !== undefined ? await fetchReturnHistoryById(returnData.id, isAir, setLoading) : {};
                } else {
                    tmpReturn = returnData.id !== undefined ? await fetchReturnById(returnData.id, isAir, setLoading) : {};
                }
                tmpReturn.id = returnData.id;

                initTmpReturn(tmpReturn);
            } catch (error) {
                console.error('Ошибка при загрузке данных возврата:', error);
                toast.error('Не удалось загрузить данные возврата.');
            } finally {
                setLoading(false);
            }
        };

        if (!isCreating) {
            fetchReturnData();
        } else {
            initTmpReturn(returnData);
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
            setIsNeedText(false);
            onClose();
        }
        //setIsNeedText(false);
    };

    const onSuccess = () => {
        setVin('');
        setAmount('');
        setSellDate('');
        setReturnDate('');
        setPrice('');
        setSeller('');
        setComment('');
        setStore('');
        loadReturns();

    }

    const isRequiredEmpty = () => {
        if (vin === '' ||
            amount === '' ||
            sellDate === '' ||
            returnDate === '' ||
            price === '' ||
            seller === '' ||
            comment === ''
        ) {
            return isAir ? store === '' : true;
        }
        return false;
    }

    const handleOnClick = () => {
        console.log("ISEMPTyFIRST", isRequiredEmpty());
        if (isRequiredEmpty()) {
            setIsNeedText(true);
            console.log("ISEMPTy", isNeedText);
            toast.error('Заполниет все обязательные поля');
           
        } else {
            setIsNeedText(false);
            let returnToSend = getReturn();
            returnToSend.id = returnData.id;
            console.log("PIZDAISEMPTy", isNeedText);
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
                        {/* <h1>{returnData.isAir ? "Возврат воздух" < i ></i> : "Возврат"}</h1> */}
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
                                    : < Input label="Номер запчасти" hint="A22222222" value={vin} parentText={vin} setParentText={setVin} isDynamic={true} maxlength={11} isNeedText={isNeedText} />
                                }
                                <Input label="Количество" hint="000" value={amount} type="number" parentText={amount} setParentText={setAmount} isDynamic={true} maxlength={10} isNeedText={isNeedText} />
                                <Input label="Дата продажи" hint="дд.мм.гггг" value={sellDate} type="date" parentText={sellDate} setParentText={setSellDate} isDynamic={true} maxlength={10} isNeedText={isNeedText} />
                                <Input label="Дата возврата" hint="дд.мм.гггг" value={returnDate} type="date" parentText={returnDate} setParentText={setReturnDate} isDynamic={true} maxlength={10} isNeedText={isNeedText} />
                                <Input label="Продавец" hint="Женя" value={seller} type="text" parentText={seller} setParentText={setSeller} isDynamic={true} maxlength={40} isNeedText={isNeedText} />
                                <Input label="Цена" hint="00 000.00 ₽" value={price} type="number" parentText={price} setParentText={setPrice} isDynamic={true} maxlength={15} isNeedText={isNeedText} />
                                {isAir ? <Input label="Магазин посредник" isLong={true} hint="Avto Parts" parentText={store} setParentText={setStore} value={store} type="text" isDynamic={true} maxlength={40} isNeedText={isNeedText} /> : <></>}
                                <Input label="Комментарий" isLong={true} hint="Коментарий" value={comment} parentText={comment} setParentText={setComment} type="text" isDynamic={true} maxlength={255} isNeedText={isNeedText} />
                                {isHistory ? <TextField textDescription="User" text={whoAdded} isLong={true} />
                                    : <></>}

                            </div>
                            < Checkbox label="Возврат завершён" onChange={setCompleted} checkedDefault={isHistory} />
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
            {/* <Toaster toastOptions={{
                duration: 1000,
                style: {
                    backgroundColor: '#131313',
                    color: '#DBDBDB',
                }
            }} /> */}
        </div >
    );
};

export default ReturnModal;