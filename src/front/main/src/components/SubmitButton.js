import { useModal } from './SubmitModalContext';
import '../styles/Components.css';
import '../styles/Components.css';
import React, { useState } from 'react';



export function IssuanceButton(props) {
    const { label, onClick, disabled, needConfirmation } = props;
    const { openModal } = useModal();

    const handleClick = () => {
        if (!needConfirmation) {
            onClick && onClick();
        }
        else {
            openModal(() => {
                onClick && onClick();
            });
        }
    }

    return (
        <div className="SubmitButtonWrapper">
            <button className="SubmitButton" onClick={handleClick} disabled={disabled}>{label}</button>
        </div>
    );
}



export const ConfirmationModal = ({ isVisible, onClose, onConfirm }) => {
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm(); // Выполняем функцию подтверждения
        }
        onClose(); // Закрываем модалку
    };

    if (!isVisible) return null;

    return (
        <div className="SubmitModal">
            <div className="SubmitModalWrapper" onClick={onClose}>
                <div className="SubmitModalContent" onClick={(e) => e.stopPropagation()}>
                    <h2 className="PrimaryText">Вы уверены, что хотите<br /> изменить этот элемент?</h2>
                    <div className="SubmitDeleteButtonsContainer">
                        <button className="SubmitButton" onClick={onClose}>
                            Нет
                        </button>
                        <button className="SubmitButton" onClick={handleConfirm}>
                            Да
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export function DeleteButton({ onClick }) {
    const { openModal } = useModal();

    const handleDelete = () => {
        openModal(() => {
            onClick && onClick();
        });
    };

    return (
        <div className="SubmitButtonWrapper">
            <button className="SubmitButton" onClick={handleDelete}>
                Удалить
            </button>
        </div>
    );
}