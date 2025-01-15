import '../styles/Components.css'
import '../styles/Components.css'
import React, { useState } from 'react';



export function IssuanceButton(props) {
    const { label, onClick } = props;

    const handleClick = () => {
        onClick && onClick();
    }

    return (
        <div className="SubmitButtonWrapper">
            <button className="SubmitButton" onClick={handleClick}>{label}</button>
        </div>
    );
}



const ConfirmationModal = ({ isVisible, onClose, onConfirm }) => {
    if (!isVisible) return null;

    return (
        <div className="SubmitModal">
            <div className='SubmitModalWrapper' onClick={onClose}>
                <div className="SubmitModalContent">
                    <h2 className='PrimaryText'>Вы уверены, что хотите удалить этот элемент?</h2>
                    <div className='SubmitDeleteButtonsContainer'>
                        <button className='SubmitButton' onClick={onClose}>Нет</button>
                        <button className='DeleteButton' onClick={onConfirm}>Да</button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export function DeleteButton(props) {
    const { onClick } = props;
    const [isModalVisible, setModalVisible] = useState(false);

    const handleClick = () => {
        setModalVisible(true);
    };

    const handleClose = () => {
        setModalVisible(false);
    };

    const handleConfirm = () => {
        onClick && onClick();
        setModalVisible(false);
    };

    return (
        <div className="SubmitButtonWrapper" >
            <button className="SubmitButton" onClick={handleClick}>Удалить</button>
            <ConfirmationModal
                isVisible={isModalVisible}
                onClose={handleClose}
                onConfirm={handleConfirm}
            />
        </div >
    );
}


