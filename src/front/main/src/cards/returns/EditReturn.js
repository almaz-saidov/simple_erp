import { ReactComponent as RightArrow } from '../../assets/right_arrow_icon.svg';
import { useState } from 'react';
import { ReactComponent as AirIcon } from '../../assets/air_icon.svg';



import '../../styles/Detail.css'
import '../../styles/Return.css'



function EditReturn(props) {
    const { returnData } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    const getReturn = () => {
        return
    }

    return (
        <div className="EditReturn" onClick={onClick}>
            <header>
                <h1>{returnData.isAir ? "Возврат-воздух" : "Возврат"}</h1>
            </header>
            <ReturnModal isOpen={isModalOpen} onClose={toggleModal}>
                <h2>Это модальное окно</h2>
                <p>Здесь может быть любое содержимое.</p>
                <button onClick={toggleModal}>Закрыть</button>
            </ReturnModal>
        </div>
    );
}

export default Return;
