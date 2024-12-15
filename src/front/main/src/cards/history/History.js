import CardHeader from "../../components/CardHeader";
import React, { useEffect, useState } from 'react';
import Input from '../../components/Input';
import HistoryNavButton from "./HistoryNavButton";
import { fetchReturns, fetchReturnsReal, fetchPurchaseReal, fetchPurchase, fetchSellsReal, fetchSells } from "../../api/Api";
import Return from '../returns/Return';
import { SyncLoader } from 'react-spinners';
import ReturnModal from '../returns/ReturnModal';
import HistoryItemModal from "./HistoryItemModal";
import HistoryItem from "./HistoryItem";

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
    const loadData = async () => {
        setLoading(true); // Начинаем загрузку
        try {
            switch (historyType) {
                case 0:
                    // Выдача
                    await fetchSellsReal(getFilter(), setSells, setLoading);
                    break;
                case 1:
                    // Поступления
                    await fetchPurchaseReal(getFilter(), setPurchases, setLoading);
                    break;
                case 2:
                    // Возвраты
                    await fetchReturnsReal(getFilter(), setReturns, setLoading);
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
            <CardHeader label="История" />
            <div className="HistoryDateWrapper">
                <div className="DateInputWrapper">
                    <label htmlFor="date_from" className="form-label">С</label>
                    <Input id="date_from" isDynamic={true} parentText={startDate} setParentText={setStartDate} label="" hint="дд.мм.гггг" type="date" />
                </div>
                <div className="DateInputWrapper">
                    <label htmlFor="date_to" className="form-label">До</label>
                    <Input id="date_to" label="" isDynamic={true} parentText={endDate} setParentText={setEndDate} hint="дд.мм.гггг" type="date" />
                </div>
            </div>
            <Input hint="Номер детали" type="text" isSearch={true} isDynamic={true} setParentText={setVin} iconOnClick={loadData} />
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
            />
            <HistoryItemModal
                isOpen={isSellModalOpen}
                onClose={toggleSellModal}
                itemData={modalSellData}
                isSell={true}
            />
            <HistoryItemModal
                isOpen={isPurchaseModalOpen}
                onClose={togglePurchaseModal}
                itemData={modalPurchaseData}
                isSell={false}
            />
        </div>
    );
}

export default History;
