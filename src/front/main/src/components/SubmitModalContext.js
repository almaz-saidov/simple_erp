import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [onConfirm, setOnConfirm] = useState(null);

  const openModal = (confirmCallback) => {
    setOnConfirm(() => confirmCallback);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setOnConfirm(null);
  };

  return (
    <ModalContext.Provider value={{ isModalVisible, openModal, closeModal, onConfirm }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
      throw new Error('useModal должен использоваться внутри ModalProvider');
    }
    return context;
  };