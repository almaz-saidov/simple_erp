
import React from 'react';
import { useState } from 'react';
import NavButton from './NavButton'

import '../styles/Nav.css'

import { ReactComponent as searchIcon } from '../assets/search_icon.svg';
import { ReactComponent as historyIcon } from '../assets/history_icon.svg';
import { ReactComponent as issuanceIcon } from '../assets/issuance_icon.svg';
import { ReactComponent as receiptIcon } from '../assets/receipt_icon.svg';
import { ReactComponent as returnsIcon } from '../assets/returns_icon.svg';



function Nav(props) {
    const { getCurrentCardId, setCurrentCardId } = props;

    return (
        <div className='Nav'>
            <NavButton
                Icon={searchIcon}
                getCurrentCardId={getCurrentCardId}
                label="Поиск"
                id={0}
                setCurrentCardId={setCurrentCardId}
            />
            <NavButton
                Icon={issuanceIcon}
                getCurrentCardId={getCurrentCardId}
                label="Выдача"
                id={1}
                setCurrentCardId={setCurrentCardId}
            />
            <NavButton
                Icon={receiptIcon}
                getCurrentCardId={getCurrentCardId}
                label="Поступление"
                id={2}
                setCurrentCardId={setCurrentCardId}
            />
            <NavButton
                Icon={returnsIcon}
                getCurrentCardId={getCurrentCardId}
                label="Возвраты"
                id={3}
                setCurrentCardId={setCurrentCardId}
            />
            <NavButton
                Icon={historyIcon}
                getCurrentCardId={getCurrentCardId}
                label="История"
                id={4}
                setCurrentCardId={setCurrentCardId}
            />
        </div>
    );
}

export default Nav;
