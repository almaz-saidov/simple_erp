
import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToasterWithMax } from './components/ToasterWithMax';
import Market from './markets/Market';
import MarketSelector from './pages/marketSelector/MarketSelector';
import CreateMarket from './markets/CreateMarket';
import { MarketProvider } from './markets/MarketContext';
import { ModalProvider, useModal } from './components/SubmitModalContext';
import { ConfirmationModal } from './components/SubmitButton';
import CommonSearch from './pages/commonSearch/CommonSearch';
import CommonDetail from './pages/commonDetail/CommonDetail';

// @ts-ignore
import './styles/App.css';

function App() {

  return (
    <ModalProvider>
      <MarketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="markets/:market_id" element={<Market />} />
            <Route path="markets" element={<MarketSelector />} />
            <Route path="markets/create" element={<CreateMarket />} />
            <Route path="common/search" element={<CommonSearch />} />
            <Route path="common/detail/:vin" element={<CommonDetail />} />
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
