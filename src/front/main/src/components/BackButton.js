import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as RightArrow } from '../assets/right_arrow_icon.svg';
import '../styles/BackButton.css'

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className='BackButtonWrapper'>
            <button className='BackButton' onClick={handleBack}>
                Назад
            </button>
            <RightArrow />
        </div>
    );
};

export default BackButton;