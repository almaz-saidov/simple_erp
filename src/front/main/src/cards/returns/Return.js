import { ReactComponent as RightArrow } from '../../assets/right_arrow_icon.svg';
import { useState } from 'react';
import { ReactComponent as AirIcon } from '../../assets/air_icon.svg';
import { postData, fetchReturnById, updateReturnById } from '../../api/Api';
import toast, { Toaster } from 'react-hot-toast';

import '../../styles/Components.css'
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
                <div className='ReturnNumberWrapper'>
                    <span className='HelperText'>Номер запчасти</span>
                    <span className='PrimaryText'>{returnData.detailNumber}</span>
                    {(returnData.isAir) ? <AirIcon className="AirIcon" /> : <></>}
                </div>

            </div>

            <div className='ReturnRight'>
                <div className='ReturnDateWrapper'>
                    <span className='HelperText'>Дата возврата: </span>
                    <span className='PrimaryText'>{returnData.returnDate}</span>
                </div>
                <RightArrow />
            </div>


        </div>
    );
}

export default Return;
