import { ReactComponent as RightArrow } from '../../assets/right_arrow_icon.svg';
import { useState } from 'react';
import { ReactComponent as AirIcon } from '../../assets/air_icon.svg';



import '../../styles/Detail.css'
import '../../styles/Cards/Returns.css'



function Return(props) {
    const { returnData, onClick } = props;

    const getReturn = () => {
        return
    }

    return (
        <div className="Return" onClick={onClick}>
            <div className='ReturnLeft'>
                <div className='DetailNumberWrapper'>
                    <span className='NumberText'>Номер запчасти</span>
                    <span className='DetailNumber'>{returnData.detailNumber}</span>
                    {(returnData.isAir) ? <AirIcon className="AirIcon" /> : <></>}
                </div>

            </div>

            <div className='ReturnRight'>
                <div className='ReturnDateWrapper'>
                    <span className='DateText'>Дата возврата: </span>
                    <span className='ReturnDate'>{returnData.returnDate}</span>
                </div>
                <RightArrow />
            </div>


        </div>
    );
}

export default Return;
