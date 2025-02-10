import CardHeader from "../../components/CardHeader";
import Input from '../../components/Input';
import { IssuanceButton } from '../../components/SubmitButton';
import toast from 'react-hot-toast';
import { useState, useContext } from 'react';
import '../../styles/Card.css';
import '../../styles/Cards/Issuance.css';
import { createSell } from '../../services/Api';
import { MarketContext } from '../../markets/MarketContext'


function Sells() {
    const [isNeedText, setIsNeedText] = useState(false);
    const [partNumber, setPartNumber] = useState('');
    const [count, setCount] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [seller, setSeller] = useState('');
    const { value, setValue } = useContext(MarketContext);


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

    const isBadSell = () => {
        return partNumber.length === 0 ||
            count.length === 0 ||
            date.length === 0 ||
            seller.length === 0 ||
            price.length === 0;
    }

    const resetSellInput = () => {
        setPartNumber('');
        setCount('');
        setDate('');
        setPrice('');
        setSeller('');
    }

    const createSellWithToast = () => {
        toast.promise(createSell(getSell(), value.id), {
            loading: 'Создание',
            success: () => {
                resetSellInput();
                return 'Выдача создана';
            },
            error: 'Что то пошло не так',
        });
    }

    // useEffect(() => {
    //     //console.log("IssuanceGot new Text");
    // }, [partNumber, count, date, price, seller]);

    const submitButtonClick = () => {
        if (isBadSell()) {
            setIsNeedText(true);
            notify();
        } else {
            setIsNeedText(false);
            createSellWithToast();
        }
    }

    return (
        <div className="Issuance">
            <CardHeader label="Выдача" marketName={value.name} />
            <div className="CardContent">
                <Input label="Номер запчасти" hint="А2222222222" parentText={partNumber} setParentText={setPartNumber} isDynamic={true} maxLength={20} isNeedText={isNeedText} />
                <Input label="Количество" hint="000" parentText={count} setParentText={setCount} type="number" isDynamic={true} maxLength={10} isNeedText={isNeedText} />
                <Input label="Дата выдачи" hint="hint" parentText={date} setParentText={setDate} type="date" isDynamic={true} maxLength={10} isNeedText={isNeedText} />
                <Input label="Цена" hint="00 000.00 ₽" parentText={price} setParentText={setPrice} type="number" isDynamic={true} maxLength={15} isNeedText={isNeedText} />
                <Input label="Продавец" hint="Женя" isLong={true} parentText={seller} setParentText={setSeller} type="text" isDynamic={true} maxLength={40} isNeedText={isNeedText} />
            </div>
            <IssuanceButton onClick={submitButtonClick} label="Оформить выдачу" />
        </div>

    );
}

export default Sells;
