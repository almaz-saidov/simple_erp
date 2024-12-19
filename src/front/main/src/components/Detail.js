
import { ReactComponent as RightArrow } from '../assets/right_arrow_icon.svg';
import { useState } from 'react';

import '../styles/Detail.css'
import '../styles/Components.css'

function Detail(props) {
    const { detail } = props;

    return (
        <div className="Detail">
            <div className='DetailLeft'>
                <span className='PrimaryText'>{detail.name}</span>
                <div className='DetailCountWrapper'>
                    <span className='HelperText'>Количество: </span>
                    <span className='PrimaryText'>{detail.count}</span>
                </div>
            </div>
            <div className='DetailRight'>
                <div className='DetailNumberWrapper'>
                    <span className='HelperText'>Номер запчасти</span>
                    <span className='PrimaryText'>{detail.detailNumber}</span>
                </div>
                <RightArrow />
            </div>
        </div>
    );
}

export default Detail;
