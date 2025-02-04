
import { ReactComponent as RightArrow } from '../assets/right_arrow_icon.svg';
import { useState } from 'react';

import '../styles/Detail.css'
import '../styles/Components.css'

function Detail(props) {
    const { detail, onClick } = props;

    return (
        <div className="Detail" onClick={onClick}>
            <div className='DetailLeft'>
                <span className='PrimaryText'>{detail.name}</span>
                <div className='DetailCountWrapper'>
                    <p className='HelperText'>Количество: </p>
                    <p className='PrimaryText'>{detail.count}</p>
                </div>
            </div>
            <div className='DetailRight'>
                <div className='DetailNumberWrapper'>
                    <p className='HelperText'>Номер запчасти</p>
                    <p className='PrimaryText'>{detail.detailNumber}</p>
                </div>
            </div>
        </div>
    );
}

export default Detail;
