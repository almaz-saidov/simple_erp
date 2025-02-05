import '../../styles/Cards/History.css'
import { ReactComponent as RightArrow } from '../../assets/right_arrow_icon.svg';

import { useState } from 'react';

function HistoryItem(props) {
    const { item, isSell, onClick } = props;

    return (
        <div onClick={onClick} className="HistoryItem">

            <div className='HistoryItemContent'>

                <div className='HistoryNumberWrapper'>
                    <span className='HelperText'>Номер запчасти</span>
                    <span className='PrimaryText'>{item.detailNumber}</span>
                </div>
                <div className='ItemDateWrapper'>
                    <span className='HelperText'>{isSell ? "Дата выдачи" : "Дата поступления"}: </span>
                    <span className='PrimaryText'>{isSell ? item.date : item.date}</span>
                </div>
                <div className='ItemCountWrapper'>
                    <span className='HelperText'>Количество: </span>
                    <span className='PrimaryText'>{item.count}</span>
                </div>
                <div className='ItemPriceWrapper'>
                    <span className='HelperText'>Цена: </span>
                    <span className='PrimaryText'>{item.price}</span>
                </div>


            </div>
            <RightArrow />
        </div>
    );
}

export default HistoryItem;
