
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ToasterWithMax } from './components/ToasterWithMax';
import Market from './markets/Market';
import MarketSelector from './pages/marketSelector/MarketSelector';
import CreateMarket from './markets/CreateMarket';
import { MarketProvider } from './markets/MarketContext';
import { ModalProvider, useModal } from './components/SubmitModalContext';
import { ConfirmationModal } from './components/SubmitButton';
import CommonSearch from './pages/commonSearch/CommonSearch';
import CommonDetail from './pages/commonDetail/CommonDetail';
import ProtectedRoute from './components/ProtectedRoute/ProductRoute';

// @ts-ignore
import './styles/App.css';

function App() {

  const [backButtonOnCick, setBackButtonOnClick] = useState(false);
  const [userStatus, setUserStatus] = useState<string | null>(null);

  useEffect(() => {
    setUserStatus(localStorage.getItem('user_status'));
  }, [])

  const getDefaultRouteByUserStatus = (userStatus: string | null) => {
    switch (userStatus) {
      case 'admin':
        return (
          <Navigate to="/markets" />
        );
      case 'worker':
        return (
          <Navigate to="/markets" />
        );
      case 'seller':
        return (
          <Navigate to="/common/search" />
        );
      default:
        return <Navigate to="/markets" />;
    }
  };


  return (
    <ModalProvider>
      <MarketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="markets/:market_id"
              element={<ProtectedRoute
                element={<Market />}
                allowedStatuses={['admin', 'worker']} />} />
            <Route path="markets"
              element={<ProtectedRoute
                element={<MarketSelector
                  backButtonOnCick={backButtonOnCick}
                  setBackButtonOnCick={setBackButtonOnClick} />}
                allowedStatuses={['admin', 'worker']} />} />
            <Route path="markets/create"
              element={<ProtectedRoute
                element={<CreateMarket />}
                allowedStatuses={['admin']} />} />
            <Route path="common/search"
              element={<ProtectedRoute
                element={<CommonSearch />}
                allowedStatuses={['admin', 'worker', 'seller']} />} />
            <Route path="common/detail/:vin"
              element={<ProtectedRoute
                element={<CommonDetail />}
                allowedStatuses={['admin', 'worker', 'seller']} />} />
            <Route path="*"
              element={getDefaultRouteByUserStatus(userStatus)} />
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
