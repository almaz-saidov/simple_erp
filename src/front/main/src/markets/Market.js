import '../styles/App.css';
import '../styles/Markets.css'
import { Fragment, useEffect, useState } from 'react';
import Nav from '../components/Nav';
import History from '../cards/history/History';
import Sells from '../cards/sells/Sells';
import Purchases from '../cards/purchases/Purchases';
import Returns from '../cards/returns/Returns';
import Search from '../cards/search/Search';
import { useNavigate } from 'react-router-dom';

import { ToasterWithMax } from '../components/ToasterWithMax'
function Market() {
    const [currentCardId, setCurrentCardId] = useState(0);
    const [authorized, setAuthorized] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const cards = [<Search />, <Sells />, <Purchases />, <Returns />, <History />];

    const renderComponent = () => {
        return cards[currentCardId];
    };


    return (
        <div className="Market">
            <Fragment>
                <div className='Card'>
                    {renderComponent()}
                </div>
                <Nav getCurrentCardId={() => currentCardId} setCurrentCardId={setCurrentCardId} />


            </Fragment>
        </div>
    );
}

export default Market;
