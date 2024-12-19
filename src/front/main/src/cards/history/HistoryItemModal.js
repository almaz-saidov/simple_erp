import React, { use } from 'react';

import TextField from '../../components/TextField';
import Checkbox from '../../components/CheckBox';
import { useState, useEffect } from 'react';
import { ReactComponent as LeftArrow } from '../../assets/left_arrow_icon.svg';
import { ReactComponent as AirIcon } from '../../assets/air_icon.svg';
import { fetchPurchaseById, fetchSellById } from '../../api/Api'
import { SyncLoader } from 'react-spinners';

import '../../styles/Cards/Returns.css';

const HistoryItemModal = ({ isOpen, isSell, onClose, itemData }) => {
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState({});
    useEffect(() => {
        const fetchItemData = async () => {
            setLoading(true);
            try {
                const newItem = isSell ? await fetchSellById(itemData.id, setLoading) : await fetchPurchaseById(itemData.id, setLoading);
                setItem(newItem);
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

    return (
        <div className="modal-overlay" id="modal-overlay" onClick={handleClose}>
            <div className="ModalContent">
                <div className='ModalMain'>
                    <header className='ModalHeader'>
                        {isSell
                            ? <h1>Выдача</h1>
                            : <h1>Поступление</h1>
                        }
                        <button className="backButton" onClick={onClose}><LeftArrow /> Назад</button>
                    </header>
                    {loading ?
                        <div className='LoaderWrapper'>
                            <SyncLoader color="#A7A7A7" />
                        </div> :
                        <div className='HistoryModalItem'>
                            <TextField textDescription="Номер запчасти" text={item.detailNumber} />
                            <TextField textDescription="Количество" text={item.count} />
                            {isSell ? <TextField textDescription="Дата продажи" text={item.date} />
                                : <TextField textDescription="Дата возврата" text={item.date} />
                            }
                            <TextField textDescription="Цена" text={item.price} />
                            {isSell ? <TextField textDescription="Продавец" text={item.name} isLong={true} />
                                : <TextField textDescription="Название детали" text={item.detailName} isLong={true} />
                            }
                            <TextField textDescription="USER ID" text="USER ID" isLong={true} />
                        </div>
                    }
                </div>

            </div>

        </div >
    );
};

export default HistoryItemModal;