import React, { useState, useRef, useEffect, Children } from "react";
import { ReactComponent as LeftArrow } from '../../assets/left_arrow_icon.svg';

import "./SlidePanel.css";

const SlidePanel = ({ isOpen, onClose, children }) => {
    const [isDragging, setIsDragging] = useState(false); // Состояние перетаскивания
    const [startY, setStartY] = useState(0); // Начальная позиция Y
    const [panelHeight, setPanelHeight] = useState(300); // Высота панели
    const panelRef = useRef(null); // Ссылка на панель

    // Обработчик начала перетаскивания
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartY(e.clientY || e.touches[0].clientY); // Запоминаем начальную позицию Y
    };

    // Обработчик перемещения
    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const clientY = e.clientY || e.touches[0].clientY; // Текущая позиция Y
        const deltaY = clientY - startY; // Разница между текущей и начальной позицией Y

        // Вычисляем новую высоту панели
        const newHeight = panelHeight - deltaY;

        // Ограничиваем высоту панели (например, от 100px до 500px)
        if (newHeight >= 100 && newHeight <= 300) {
            setPanelHeight(newHeight);
            setStartY(clientY); // Обновляем начальную позицию для плавного перемещения
        }
    };

    // Обработчик завершения перетаскивания
    const handleMouseUp = () => {
        setIsDragging(false);

        // Если панель слишком маленькая, закрываем её
        if (panelHeight < 150) {
            onClose();
            setPanelHeight(300); // Сбрасываем высоту после закрытия
        }
    };

    // Стиль для панели
    const panelStyle = {
        height: `${panelHeight}px`,
        transition: isDragging ? "none" : "height 0.3s ease-in-out", // Плавная анимация, если не перетаскиваем
    };

    // Закрытие панели при клике вне её области
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
            onMouseLeave={handleMouseUp} // Если курсор вышел за пределы панели
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
        >

            <div className="SlidePanelHeader">
                <button className="close-button" onClick={onClose}>
                    <LeftArrow />Назад
                </button>
            </div>
            <div className="panel-content">
                {children && children}
            </div>
        </div>
    );
};

export default SlidePanel;