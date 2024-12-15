import '../../styles/Cards/History.css'
import { ReactComponent as RightArrow } from '../../assets/right_arrow_icon.svg';
import { useState } from 'react';

function HistoryItem(props) {
    const { item, isSell, onClick } = props;

    return (
        <div onClick={onClick} className="HistoryItem">

            <div className='HistoryItemContent'>

                <div className='DetailNumberWrapper'>
                    <span className='TextName'>Номер запчасти</span>
                    <span className='DetailNumber'>{item.detailNumber}</span>
                </div>
                <div className='ItemDateWrapper'>
                    <span className='TextName'>{isSell ? "Дата выдачи" : "Дата поступления"}: </span>
                    <span className='ItemDate'>{isSell ? item.sellDate : item.purchaseDate}</span>
                </div>
                <div className='ItemCountWrapper'>
                    <span className='TextName'><pre>Количество: </pre> </span>
                    <span className='ItemCount'>{item.count}</span>
                </div>
                <div className='ItemPriceWrapper'>
                    <span className='TextName'>Цена: </span>
                    <span className='ItemPrice'>{item.price}</span>
                </div>


            </div>
            <RightArrow />
        </div>
    );
}

export default HistoryItem;
