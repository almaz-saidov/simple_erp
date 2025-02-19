import CardHeader from "../../components/CardHeader";
import React, { useEffect, useState, useContext } from 'react';
import Input from '../../components/Input';
import HistoryNavButton from "./HistoryNavButton";
import { fetchReturns, fetchPurchases, fetchSells, updateSell, updatePurchase } from "../../services/Api";
import Return from '../returns/Return';
import { SyncLoader } from 'react-spinners';
import ReturnModal from '../returns/ReturnModal';
import HistoryItemModal from "./HistoryItemModal";
import HistoryItem from "./HistoryItem";
import toast from 'react-hot-toast';
import { createReturn, updateReturnHistoryById } from '../../services/Api';
import { isFirstEarlier } from "../../common/common"
import { MarketContext } from '../../markets/MarketContext'
import PurchaseModal from "../purchases/PurchaseModal";
import SellsModal from "../sells/SellsModal";
import { editSell } from "../../services/SalesApi";
import { editPurchase } from "../../services/PurchaseApi";

import '../../styles/Card.css';
import '../../styles/Cards/History.css';
import '../../styles/Components.css';

function History() {
    const [historyType, setHistoryType] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sells, setSells] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [returns, setReturns] = useState([]);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [modalReturnData, setReturnModalData] = useState({});
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [modalSellData, setSellModalData] = useState({});
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [modalPurchaseData, setPurchaseModalData] = useState({});
    const [vin, setVin] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isAir, setIsAir] = useState(false);
    const { value, setValue } = useContext(MarketContext);

    const toggleReturnModal = () => setIsReturnModalOpen(!isReturnModalOpen);
    const toggleSellModal = () => setIsSellModalOpen(!isSellModalOpen);
    const togglePurchaseModal = () => setIsPurchaseModalOpen(!isPurchaseModalOpen);

    const getCurrentType = () => historyType;
    const getFilter = () => {
        return {
            vin: vin,
            date_from: startDate,
            date_before: endDate,
        }
    }
    const handleApiResponse = async (editedReturn, isNew, isAir, type) => {
        const successMessage = isNew ? 'Возврат создан' : 'Возврат изменён';
        try {
            if (isNew) {
                await createReturn(editedReturn, isAir, value.id);
            } else {

                await updateReturnHistoryById(editedReturn, isAir, value.id);
            }

            // Успешное завершение
            if (isReturnModalOpen) {
                toggleReturnModal();
            }
            loadData();
            toast.success(successMessage);
        } catch (e) {
            // Обработка ошибок
            console.error('Ошибка в handleApiResponse:', e);
            toast.error('Что-то пошло не так');
        }
    };

    const handleUpdateSell = async (sell, sell_id, setLoading) => {
        const successMessage = 'Выдача обновлена';
        try {
            setLoading(true);
            console.log(sell);
            await editSell(sell, sell_id, value.id);
            if (isReturnModalOpen) {
                togglePurchaseModal();
            }
            loadData();
            toast.success('А когда не изменяли!');
            setLoading(false);
        } catch (e) {
            // Обработка ошибок
            console.error('Ошибка в handleApiResponse:', e);
            toast.error('Дал дал ушёл');
            setLoading(false);
        }
    };

    const handleUpdatePurchase = async (purchase, purchase_id) => {
        const successMessage = 'Поступление обновлено';
        try {
            setLoading(true);
            await editPurchase(purchase, purchase_id, value.id);
            if (isReturnModalOpen) {
                toggleSellModal();
            }
            loadData();
            toast.success(successMessage);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            // Обработка ошибок
            console.error('Ошибка в handleApiResponse:', e);
            toast.error('Что-то пошло не так');
        }
    };




    const loadData = async () => {
        setLoading(true); // Начинаем загрузку
        try {
            switch (historyType) {
                case 0:
                    // Выдача
                    await fetchSells(getFilter(), setSells, value.id);
                    break;
                case 1:
                    // Поступления
                    await fetchPurchases(getFilter(), setPurchases, value.id);
                    break;
                case 2:
                    // Возвраты
                    await fetchReturns(getFilter(), setReturns, value.id);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
            // Обработка ошибок (можно добавить состояние ошибки)
        } finally {
            setLoading(false); // Завершение загрузки
        }
    };

    useEffect(() => {

        loadData();
    }, [historyType, vin]);

    useEffect(() => {

        if (startDate.length !== 0 && endDate.length !== 0) {
            if (isFirstEarlier(endDate, startDate)) {
                toast.error('Конечная дата не может быть раньше стартовой даты');
                setEndDate(startDate);
            }
        }

    }, [startDate, endDate]);

    const makeContent = () => {
        switch (historyType) {
            case 0:
                return (
                    <div className="HistoryItemsWrapper">
                        {
                            sells.length == 0 ?
                                (
                                    <div className="NumberDoesNotExist">
                                        <span>Ничего  <br /> не найдено</span>
                                    </div>
                                ) :
                                sells.map((el, index) => (
                                    <HistoryItem
                                        key={index}
                                        item={el}
                                        isSell={true}
                                        onClick={() => {
                                            setSellModalData(el);
                                            toggleSellModal();
                                        }}
                                    />
                                ))}
                        <div className='Space' />
                    </div>
                );
            case 1:
                return (
                    <div className="HistoryItemsWrapper">
                        {purchases.length == 0 ?
                            (
                                <div className="NumberDoesNotExist">
                                    <span>Ничего  <br /> не найдено</span>
                                </div>
                            ) : purchases.map((el, index) => (
                                <HistoryItem
                                    key={index}
                                    item={el}
                                    isSell={false} // Измените на false, если это не продажи
                                    onClick={() => {
                                        setPurchaseModalData(el);
                                        togglePurchaseModal();
                                    }}
                                />
                            ))}
                        <div className='Space' />
                    </div>
                );
            case 2:
                return (
                    <div className="HistoryItemsWrapper">
                        {returns.length == 0 ?
                            (
                                <div className="NumberDoesNotExist">
                                    <span>Ничего  <br /> не найдено</span>
                                </div>
                            ) : returns.map((el, index) => (
                                <Return
                                    key={index}
                                    returnData={el}
                                    onClick={() => {
                                        setIsAir(el.isAir);
                                        setReturnModalData(el);
                                        toggleReturnModal();
                                    }}
                                />
                            ))}
                        <div className='Space' />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="History">
            <CardHeader label="История" marketName={value.name} />
            <div className="HistoryDateWrapper">
                <div className="DateInputWrapper">
                    <label htmlFor="date_from" className="form-label">С</label>
                    <Input id="date_from" isDynamic={true} parentText={startDate} setParentText={setStartDate} label="" hint="дд.мм.гггг" type="date" />
                </div>
                <div className="DateInputWrapper">
                    <label htmlFor="date_to" className="form-label">До</label>
                    <Input id="date_to" isDynamic={true} parentText={endDate} setParentText={setEndDate} label="" hint="дд.мм.гггг" type="date" />
                </div>
            </div>
            <div className="HistoryVinInput">
                <Input hint="Номер запчасти" type="text" isSearch={true} isDynamic={true} setParentText={setVin} iconOnClick={loadData} />
            </div>
            <div className="HistoryNav">
                <HistoryNavButton label="Выдача" type={0} getCurrentType={getCurrentType} setHistoryType={setHistoryType} />
                <HistoryNavButton label="Поступления" type={1} getCurrentType={getCurrentType} setHistoryType={setHistoryType} />
                <HistoryNavButton label="Возвраты" type={2} getCurrentType={getCurrentType} setHistoryType={setHistoryType} />
            </div>
            {loading ?
                <div className='LoaderWrapper'>
                    <SyncLoader color="#A7A7A7" />
                </div> :
                <div className="HistoryContent">
                    {makeContent()}
                </div>
            }
            <ReturnModal
                isOpen={isReturnModalOpen}
                onClose={toggleReturnModal}
                returnData={modalReturnData}
                isHistory={true}
                isCreating={false}
                isAir={isAir}
                loadReturns={loadData}
                handleApiResponse={handleApiResponse}
            />
            <SellsModal
                isOpen={isSellModalOpen}
                onClose={toggleSellModal}
                itemData={modalSellData}
                updateSell={handleUpdateSell}
            />
            <PurchaseModal
                isOpen={isPurchaseModalOpen}
                onClose={togglePurchaseModal}
                itemData={modalPurchaseData}
                updatePurchase={handleUpdatePurchase}
            />
        </div>
    );
}

export default History;
