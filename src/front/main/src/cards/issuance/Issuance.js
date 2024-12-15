import CardHeader from "../../components/CardHeader";
import Input from '../../components/Input';
import IssuanceButton from '../../components/SubmitButton';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import '../../styles/Card.css';
import '../../styles/Cards/Issuance.css';
import { submitData, postData } from '../../api/Api'

function Issuance() {
    const [isNeedText, setIsNeedText] = useState(false);
    const [partNumber, setPartNumber] = useState('');
    const [count, setCount] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [seller, setSeller] = useState('');

    const getSell = () => {
        return {
            vin: partNumber,
            amount: parseInt(count),
            date: date,
            price: parseFloat(price),
            name: seller,
        }
    }

    const notify = () => toast.error('Заполниет все обязательные поля');

    useEffect(() => {
        //console.log("IssuanceGot new Text");
    }, [partNumber, count, date, price, seller]);

    const submitButtonClick = () => {
        if (partNumber.length === 0 || count.length === 0 || date.length === 0 || seller.length === 0) {
            setIsNeedText(true);
            notify();
        } else {
            setIsNeedText(false);
            toast.promise(postData(getSell(), "sales"), {
                loading: 'Создание',
                success: () => {
                    setPartNumber('');
                    setCount('');
                    setDate('');
                    setPrice('');
                    setSeller('');
                    return 'Выдача создана';
                },
                error: 'Что то пошло не так',
            });
        }
    }

    return (
        <div className="Issuance">
            <CardHeader label="Выдача" />
            <div className="CardContent">
                <Input label="Номер запчасти" hint="hint" isLong={false} parentText={partNumber} setParentText={setPartNumber} type="text" isDynamic={true} maxlength={20} isNeedText={isNeedText} />
                <Input label="Количество" hint="hint" isLong={false} parentText={count} setParentText={setCount} type="number" isDynamic={true} maxlength={10} isNeedText={isNeedText} />
                <Input label="Дата выдачи" hint="hint" isLong={false} parentText={date} setParentText={setDate} type="date" isDynamic={true} maxlength={10} isNeedText={isNeedText} />
                <Input label="Цена" hint="hint" isLong={false} parentText={price} setParentText={setPrice} type="number" isDynamic={true} maxlength={15} isNeedText={isNeedText} />
                <Input label="Продавец" hint="hint" isLong={true} parentText={seller} setParentText={setSeller} type="text" isDynamic={true} maxlength={40} isNeedText={isNeedText} />
            </div>
            <IssuanceButton onClick={submitButtonClick} label="Оформить выдачу" />
            <Toaster toastOptions={{
                duration: 1000,
                style: {
                    backgroundColor: '#131313',
                    color: '#DBDBDB',
                }
            }} />
        </div>

    );
}

export default Issuance;
