import React, { useEffect, useState, useContext } from 'react';
import CardHeader from '../../components/CardHeader';
import Return from './Return';
import { SyncLoader } from 'react-spinners'
import ReturnModal from './ReturnModal';
import { fetchReturns, fetchReturnsAll } from '../../api/Api'
import { createReturn, updateReturnById, deleteReturnById } from '../../api/Api';
import toast, { Toaster } from 'react-hot-toast';
import { MarketContext } from '../../markets/MarketContext'

import '../../styles/Card.css';
import '../../styles/Card.css'
import '../../styles/Cards/Returns.css'
import '../../styles/LoaderWrapper.css'
import '../../styles/Modal.css';
import '../../styles/Components.css'

function Returns() {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isAir, setIsAir] = useState(false);
    const [modalReturnData, setModalReturnData] = useState({
        vin: "",
        amount: "",
        sell_date: "",
        return_date: "",
        to_seller: "",
        price: "",
        comment: "",
        is_compleat: "",
    });
    const { value, setValue } = useContext(MarketContext);


    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const loadReturns = () => {
        setLoading(true);
        fetchReturnsAll(setReturns, value.id);
        setLoading(false);
    }

    useEffect(() => {
        loadReturns();
    }, []);

    const getSubmitButtonOnClick = () => { }

    async function tryEditReturn(editedReturn, isAir, isNew, id) {
        if (isNew) {
            await createReturn(editedReturn, isAir, id);
        } else {
            await updateReturnById(editedReturn, isAir, id);
        }
    }

    const handleApiResponse = async (editedReturn, isNew, isAir, type) => {
        const successMessage = isNew ? 'Возврат создан' : 'Возврат изменён';
        try {
            if (type === 'edit') {
                tryEditReturn(editedReturn, isNew, isAir, value.id);
            } else if (type === 'delete') {
                await deleteReturnById(editedReturn, isAir, value.id);
            }

            // Успешное завершение
            if (isModalOpen) {
                toggleModal();
            }
            loadReturns();
            toast.success(successMessage);
        } catch (e) {
            // Обработка ошибок
            console.error('Ошибка в handleApiResponse:', e);
            toast.error('Что-то пошло не так');
        }
    };




    return (
        <>
            <div className="Returns">
                <CardHeader label="Возврат" />

                <span className='ReturnAddictionHeader' >Незавершённые возвраты</span>

                {loading ?
                    <div className='LoaderWrapper'>
                        <SyncLoader color="#A7A7A7" />
                    </div>
                    : returns.length != 0 ?
                        < div className="ReturnsWrapper">
                            {returns.map((returnData, index) => (
                                <Return
                                    key={index}
                                    returnData={returnData}
                                    onClick={() => {
                                        setIsAir(returnData.isAir);
                                        setIsCreating(false);
                                        setModalReturnData(returnData);
                                        toggleModal();
                                    }}
                                />
                            ))}
                            <div className='Space' />
                        </div>
                        : <div className="NumberDoesNotExist">
                            <span>Ничего  <br /> не найдено</span>
                        </div>
                }

            </div >
            <div className='CreateReturnWrapper'>
                <button
                    className='CreateReturn'
                    onClick={() => {
                        setModalReturnData({});
                        setIsAir(false);
                        setIsCreating(true);
                        toggleModal();
                    }} >
                    Создать возврат
                </button>
                <button
                    className='CreateReturnAir'
                    onClick={() => {
                        setModalReturnData({});
                        setIsAir(true);
                        setIsCreating(true);
                        toggleModal();
                    }}>
                    Создать возврат-воздух
                </button>
            </div>
            <ReturnModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                returnData={modalReturnData}
                isCreating={isCreating}
                isAir={isAir}
                isHistory={false}
                loadReturns={loadReturns}
                handleApiResponse={handleApiResponse}
            />
        </>
    );
}

export default Returns;
