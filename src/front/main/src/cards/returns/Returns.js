import React, { useEffect, useState } from 'react';
import CardHeader from '../../components/CardHeader';
import Return from './Return';
import { SyncLoader } from 'react-spinners'
import ReturnModal from './ReturnModal';
import { fetchReturns, fetchReturnsAll } from '../../api/Api'

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


    const toggleModal = () => {
        setIsModalOpen(!isModalOpen); // Переключаем состояние модального окна
    };

    const loadReturns = () => {
        fetchReturnsAll(setReturns, setLoading);
    }

    useEffect(() => {
        loadReturns();
    }, []);

    const getSubmitButtonOnClick = () => { }


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
            />

        </>
    );
}

export default Returns;
