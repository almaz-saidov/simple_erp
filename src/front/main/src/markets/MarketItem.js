import '../styles/Markets.css';
import '../styles/Components.css';
import { ReactComponent as RightArrow } from '../assets/right_arrow_icon.svg';
import { useState } from 'react';
import TextField from '../components/TextField';

function MarketItem(props) {
    const { market, onClick } = props;

    const handleOnClick = () => {
        onClick(market);
    }

    return (
        <div onClick={handleOnClick} className="MarketItem">

            <div className='MarketItemContent'>
                <div className='NameCutter'>
                    <TextField text={market.name} />
                </div>
                {
                    market.address && (
                        <div className='MarketAdress'>
                            <span className='HelperText'>Адрес</span>
                            <span className='PrimaryText'>{market.address}</span>
                        </div>
                    )
                }
            </div>
            <RightArrow />
        </div>
    );
}

export default MarketItem;
