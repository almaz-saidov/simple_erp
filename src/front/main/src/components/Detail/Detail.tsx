
import React from "react";
import right_arrow_icon from '../../assets/right_arrow_icon.svg';
import { useState } from 'react';
import { TDetail } from '../../types/Detail';

//@ts-ignore
import styles from './Detail.module.css';

interface DetailProps {
    detail: TDetail;
    onClick?: () => void;

}



function Detail({ detail, onClick }: DetailProps) {

    return (
        <div className={styles.Detail} onClick={onClick}>
            <div className={styles.DetailLeft}>
                <span className={styles.PrimaryText}>{detail.name}</span>
                <div className={styles.DetailCountWrapper}>
                    <p className={styles.HelperText}>Количество: </p>
                    <p className={styles.PrimaryText}>{detail.amount}</p>
                </div >
            </div >
            <div className={styles.DetailRight}>
                < div className={
                    styles.DetailNumberWrapper}>
                    <p className={styles.HelperText}>Номер запчасти</p>
                    <p className={styles.PrimaryText}>{detail.vin}</p>
                </div >
                <div className={styles.RightArrowWrapper}>
                    < img className={
                        styles.RightArrow} src={right_arrow_icon} />
                </div>
            </div >

        </div >
    );
}

export default Detail;
