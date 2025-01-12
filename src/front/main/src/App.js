import './styles/App.css';

import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import History from './cards/history/History';
import Sells from './cards/sells/Sells';
import Purchases from './cards/purchases/Purchases';
import Returns from './cards/returns/Returns';
import Search from './cards/search/Search';
import { Fragment } from 'react';
import { SyncLoader } from 'react-spinners';
import { ReactComponent as FailIcon } from './assets/auth_fail_icon.svg'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ToasterWithMax } from './components/ToasterWithMax';
import Market from './markets/Market';
import MarketSelector from './markets/MarketSelector';
import CreateMarket from './markets/CreateMarket';
import { MarketProvider } from './markets/MarketContext'

function App() {
  const [currentCardId, setCurrentCardId] = useState(0);
  const [authorized, setAuthorized] = useState(true);
  const [loading, setLoading] = useState(false);


  const cards = [<Search />, <Sells />, <Purchases />, <Returns />, <History />];

  const renderComponent = () => {
    return cards[currentCardId];
  };

  return (
    <div className="App">
      <MarketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/front" element={<Navigate to="/markets" />} />
            <Route path="markets/:market_id" element={<Market />} />
            <Route path="markets" element={<MarketSelector />} />
            <Route path="markets/create" element={<CreateMarket />} />
          </Routes>
        </BrowserRouter>
      </MarketProvider>
      <ToasterWithMax toastOptions={{
        duration: 1000,
        style: {
          backgroundColor: '#131313',
          color: '#DBDBDB',
        }
      }} />
    </div>
  );
}

export default App;
