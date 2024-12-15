import '../styles/Detail.css'
import { ReactComponent as RightArrow } from '../assets/right_arrow_icon.svg';
import { useState } from 'react';

function Detail(props) {
    const { detail } = props;

    return (
        <div className="Detail">
            <div className='DetailLeft'>
                <span className='DetailName'>{detail.name}</span>
                <div className='DetailCountWrapper'>
                    <span className='CountText'>Количество: </span>
                    <span className='DetailCount'>{detail.count}</span>
                </div>
            </div>
            <div className='DetailRight'>
                <div className='DetailNumberWrapper'>
                    <span className='NumberText'>Номер запчасти</span>
                    <span className='DetailNumber'>{detail.detailNumber}</span>
                </div>
                <RightArrow />
            </div>
        </div>
    );
}

export default Detail;
