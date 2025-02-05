import React, { useState, useRef, useEffect, Children } from "react";
import { ReactComponent as LeftArrow } from '../../assets/left_arrow_icon.svg';

import "./SlidePanel.css";

const SlidePanel = ({ isOpen, onClose, children }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [panelHeight, setPanelHeight] = useState(250);
    const panelRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartY(e.clientY || e.touches[0].clientY);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const clientY = e.clientY || e.touches[0].clientY;
        const deltaY = clientY - startY;

        const newHeight = panelHeight - deltaY;

        if (newHeight >= 100 && newHeight <= 400) {
            setPanelHeight(newHeight);
            setStartY(clientY);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);

        if (panelHeight < 150) {
            onClose();
            setPanelHeight(250);
        }
    };

    const panelStyle = {
        height: `${panelHeight}px`,
        transition: isDragging ? "none" : "height 0.3s ease-in-out",
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            className={`slide-panel ${isOpen ? "open" : ""}`}
            ref={panelRef}
            style={panelStyle}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
        >

            <div className="SlidePanelHeader">
                <div className="close-button" onClick={onClose}>
                    <LeftArrow />Назад
                </div>
            </div>
            <div className="panel-content">

                {children && children}
            </div>
        </div>
    );
};

export default SlidePanel;