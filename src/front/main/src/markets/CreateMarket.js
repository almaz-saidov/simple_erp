import CardHeader from "../components/CardHeader";
import Input from '../components/Input';
import IssuanceButton from '../components/SubmitButton';
import toast from 'react-hot-toast';
import { React, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPurchase } from '../api/Api'
import { createMarket } from '../api/MarketsApi'

import '../styles/Card.css';
import '../styles/Cards/Issuance.css';
import '../styles/Markets.css'

function CreateMarket() {
    const [isNeedText, setIsNeedText] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();


    const getMarket = () => {
        return {
            name: name,
            address: address,

        }
    }

    const isBadPurchase = () => {
        return name.length === 0 || address.length === 0;
    }

    const resetPurchaseInput = () => {
        setName('');
        setAddress('');
    }

    const addPurchaseWithToast = () => {
        toast.promise(createMarket(getMarket()), {
            loading: 'Создание',
            success: () => {
                resetPurchaseInput();
                navigate(`/markets`);
                return 'Выдача создана';
            },
            error: 'Что то пошло не так',
        });
    }

    const notify = () => toast.error('Заполниет все обязательные поля');

    const submitButtonClick = () => {
        if (isBadPurchase()) {
            setIsNeedText(true);
            notify();
        } else {
            setIsNeedText(false);
            addPurchaseWithToast();
        }
    }

    return (
        <div className="CreateMarket">
            <CardHeader label="Создать Магазин" />
            <div className="CreateMarketContent">
                <Input label="Название" hint="MG PARTS" parentText={name} setParentText={setName} type="number" isDynamic={true} maxlength={15} isNeedText={isNeedText} />
                <Input label="Адресс магазина" hint="Москва, Нижняя Красносельская ул., 35, стр. 59, 6 этаж" isLong={true} parentText={address} setParentText={setAddress} type="text" isDynamic={true} maxlength={40} isNeedText={isNeedText} />
            </div>
            <IssuanceButton onClick={submitButtonClick} label="Создать магазин" />
        </div >

    );
}

export default CreateMarket;
