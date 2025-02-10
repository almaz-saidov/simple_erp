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
import { ReactComponent as FailIcon } from './assets/auth_fail_icon.svg';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToasterWithMax } from './components/ToasterWithMax';
import Market from './markets/Market';
import MarketSelector from './markets/MarketSelector';
import CreateMarket from './markets/CreateMarket';
import { MarketProvider } from './markets/MarketContext';
import { ModalProvider, useModal } from './components/SubmitModalContext';
import { ConfirmationModal } from './components/SubmitButton';

function App() {
  const [currentCardId, setCurrentCardId] = useState(0);
  const [authorized, setAuthorized] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <ModalProvider>
      <MarketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="markets/:market_id" element={<Market />} />
            <Route path="markets" element={<MarketSelector />} />
            <Route path="markets/create" element={<CreateMarket />} />
            <Route path="*" element={<Navigate to="/markets" />} />
          </Routes>
          <MainContent />
        </BrowserRouter>
      </MarketProvider>
    </ModalProvider>
  );
}

function MainContent() {
  const { isModalVisible, closeModal, onConfirm } = useModal();

  return (
    <>
      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onConfirm={onConfirm}
      />
      <ToasterWithMax toastOptions={{
        duration: 1000,
        style: {
          backgroundColor: '#131313',
          color: '#DBDBDB',
        }
      }} />
    </>
  );
}

export default App;
