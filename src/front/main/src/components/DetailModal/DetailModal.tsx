import React, { FC, use } from 'react';

import TextField from '../../components/TextField';
import Checkbox from '../../components/CheckBox';
import { useState, useEffect, useContext } from 'react';
import right_arrow_icon from '../../assets/left_arrow_icon.svg';
import { fetchPurchasesById, fetchSellById } from '../../services/Api'
import { SyncLoader } from 'react-spinners';
import { MarketContext } from '../../markets/MarketContext'
import Input from '../../components/Input';
import { IssuanceButton } from '../../components/SubmitButton';
import toast from 'react-hot-toast';
import { createPurchase } from '../../services/Api';

import '../../styles/Cards/Returns.css';
import { ReactSVG } from 'react-svg';
import { TDetail } from '../../types/Detail';

//@ts-ignore
import styles from './DetailModal.module.css';

interface SellsModalProps {
    isOpen: boolean;
    onClose: () => void;
    detail: TDetail;
    updateDetail: (detail: TDetail) => void;
}


const DetailModal: FC<SellsModalProps> = ({ isOpen, onClose, detail, updateDetail }) => {
    const [loading, setLoading] = useState(false);
    const [isNeedText, setIsNeedText] = useState(false);
    const [editedDetail, setEditedDetail] = useState<TDetail>(detail);
    const { value, setValue } = useContext(MarketContext);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        setEditedDetail(detail);
    }, [detail]);

    useEffect(() => {
        if (editedDetail.market !== detail.market || editedDetail.vin !== detail.vin) {
            setIsChanged(true)
        } else {
            setIsChanged(false)
        }
    }, [editedDetail])

    if (!isOpen) return null;


    const handleClose = (e: any) => {
        if (e.target.id === 'modal-overlay') {
            onClose();
        }
    };

    const notify = () => toast.error('Заполниет все обязательные поля');

    const checkIsOkDetail = () => {
        if (editedDetail.name.length === 0) return false;
        if (editedDetail.vin.length === 0) return false;
        return true;
    }

    const submitButtonClick = () => {
        if (!isChanged) {
            toast('Ничего не изменилось!', {
                icon: '🤔',
            });
            return;
        }
        if (checkIsOkDetail()) {
            setIsNeedText(false);
            updateDetail(editedDetail);
            return;
        } else {
            setIsNeedText(true);
            toast.error('Заполните все обязательные поля');
        }
    }

    const getInputChange = (fieldName: string) => {
        return (value: string) => {
            setEditedDetail({ ...editedDetail, [fieldName]: value });
            console.log(fieldName, value);
        }
    }

    return (
        <div className="modal-overlay" id="modal-overlay" onClick={handleClose}>
            <div className="ModalContent">
                <div className={styles.DetailModalMain}>
                    <header className='ModalHeader'>
                        <h1>Цау Цау</h1>
                        <button className="backButton" onClick={onClose}><ReactSVG src={right_arrow_icon} /> Назад</button>
                    </header>
                    {loading ?
                        <div className='LoaderWrapper'>
                            <SyncLoader color="#A7A7A7" />
                        </div> :
                        <div className='HistoryModalItem'>
                            <Input
                                label="Номер запчасти"
                                hint="000"
                                parentText={editedDetail.vin}
                                value={editedDetail.vin}
                                type="text"
                                isDynamic={true}
                                maxlength={10}
                                isNeedText={isNeedText}
                                isLong={true}
                                setParentText={getInputChange('vin')} />
                            <Input
                                label="Название запчасти"
                                hint="000"
                                parentText={editedDetail.name}
                                value={editedDetail.name}
                                type="text"
                                isDynamic={true}
                                maxlength={10}
                                isNeedText={isNeedText}
                                isLong={true}
                                setParentText={getInputChange('name')} />
                            <Input
                                label="Количество"
                                hint={editedDetail.amount}
                                type="text"
                                isDynamic={true}
                                maxlength={100}
                                isNeedText={false}
                                isLong={false}
                                disabled={true} />
                            <Input
                                label="Цена"
                                hint={editedDetail.price}
                                type="text"
                                isDynamic={true}
                                maxlength={100}
                                isNeedText={false}
                                isLong={false}
                                disabled={true} />

                        </div>
                    }

                </div>
                <IssuanceButton
                    onClick={submitButtonClick}
                    label="Изменить Деталь"
                    disabled={loading}
                    needConfirmation={true} />

            </div>

        </div >
    );
};

export default DetailModal;