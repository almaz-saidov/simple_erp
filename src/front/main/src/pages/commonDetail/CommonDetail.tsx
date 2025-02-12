import React from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
// @ts-ignore
import styles from './CommonDetail.module.css';


function CommonDetail() {

    const navigate = useNavigate();
    const { vin } = useParams();
    const handleItemClick = (item: any) => {
        // setSelectedItem(item);
        // setIsPanelOpen(true);
        console.log("O$KO")
        navigate(`/common/detail/${item.vin}`);
    };





    return (
        <div className={styles.CommonSearch}>
            <div className={styles.Search}>
                ХУЙ
                <p>VIN: {vin}</p>
            </div >

        </div>

    );
}

export default CommonDetail;