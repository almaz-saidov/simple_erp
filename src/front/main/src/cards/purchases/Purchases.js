import CardHeader from "../../components/CardHeader";
import Input from '../../components/Input';
import { IssuanceButton } from '../../components/SubmitButton';
import toast from 'react-hot-toast';
import { useState, useContext } from 'react';
import '../../styles/Card.css';
import '../../styles/Cards/Issuance.css';
import { createPurchase } from '../../services/Api'
import { MarketContext } from '../../markets/MarketContext'


function Purchases() {
    const [isNeedText, setIsNeedText] = useState(false);
    const [partNumber, setPartNumber] = useState('');
    const [count, setCount] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [seller, setSeller] = useState('');
    const { value, setValue } = useContext(MarketContext);


    const getPurchase = () => {
        return {
            vin: partNumber,
            amount: parseInt(count),
            date: date,
            price: parseFloat(price),
            detail_name: seller,
        }
    }

    const isBadPurchase = () => {
        return partNumber.length === 0 || count.length === 0 || date.length === 0 || seller.length === 0 || price.length === 0;
    }

    const resetPurchaseInput = () => {
        setPartNumber('');
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
                return 'Поступление создано';
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
        } else {
            setIsNeedText(false);
            addPurchaseWithToast();
        }
    }

    return (
        <div className="Issuance">
            <CardHeader label="Поступление" marketName={value.name} />
            <div className="CardContent">
                <Input label="Номер запчасти" hint="А2222222222" parentText={partNumber} setParentText={setPartNumber} isDynamic={true} maxlength={20} isNeedText={isNeedText} />
                <Input label="Количество" hint="000" parentText={count} setParentText={setCount} type="number" isDynamic={true} maxlength={10} isNeedText={isNeedText} />
                <Input label="Дата поступления" parentText={date} setParentText={setDate} type="date" isDynamic={true} maxlength={10} isNeedText={isNeedText} />
                <Input label="Цена" hint="00 000.00 ₽" parentText={price} setParentText={setPrice} type="number" isDynamic={true} maxlength={15} isNeedText={isNeedText} />
                <Input label="Название запчасти" hint="Рычаг" isLong={true} parentText={seller} setParentText={setSeller} type="text" isDynamic={true} maxlength={40} isNeedText={isNeedText} />
            </div>
            <IssuanceButton onClick={submitButtonClick} label="Оформить поступление" />
        </div >

    );
}

export default Purchases;
