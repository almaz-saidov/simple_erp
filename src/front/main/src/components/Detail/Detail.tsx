
// import React from "react";
// import right_arrow_icon from '../../assets/right_arrow_icon.svg';
// import { useState } from 'react';
// import { TDetail } from '../../types/Detail';

// //@ts-ignore
// import styles from './Detail.module.css';

// interface DetailProps {
//     detail: TDetail;
//     onClick?: () => void;
//     displayPrice?: boolean;
// }


// function Detail({ detail, onClick, displayPrice = false }: DetailProps) {

//     return (
//         <div className={styles.Detail} onClick={onClick}>
//             <div className={styles.DetailLeft}>
//                 <span className={styles.PrimaryText}>{detail.name}</span>
//                 <div className={styles.DetailCountWrapper}>
//                     <p className={styles.HelperText}>Количество: </p>
//                     <p className={styles.PrimaryText}>{detail.amount}</p>
//                 </div >
//                 {displayPrice && <div className={styles.DetailCountWrapper}>
//                     <p className={styles.HelperText}>Цена: </p>
//                     <p className={styles.PrimaryText}>{detail.price}</p>
//                 </div>}
//             </div >
//             <div className={styles.DetailRight}>
//                 < div className={styles.DetailNumberWrapper}>
//                     <p className={styles.HelperText} id={styles.detail_number_label}>Номер запчасти</p>
//                     <p className={styles.PrimaryText}>{detail.vin}</p>
//                 </div >
//                 <div className={styles.RightArrowWrapper}>
//                     < img className={
//                         styles.RightArrow} src={right_arrow_icon} />
//                 </div>
//             </div >


//         </div >
//     );
// }

// export default Detail;

import React from "react";
import right_arrow_icon from '../../assets/right_arrow_icon.svg';
import { TDetail } from '../../types/Detail';

// @ts-ignore
import styles from './Detail.module.css';
import toast from "react-hot-toast";

interface DetailProps {
    detail: TDetail;
    onClick?: () => void;
    displayPrice?: boolean;
}

function Detail({ detail, onClick, displayPrice = false }: DetailProps) {
    const isClickable = detail.amount > 0;

    const getOnClick = () => {
        if (detail.amount === 0) {
            return () => {
                toast('Затонировано, для снятия тонировки пополните склад',
                    {
                        icon: '😎',
                        duration: 3000,
                    });
            }
        } else {
            return onClick;
        }

    }

    return (
        <div
            className={styles.Detail}
            onClick={getOnClick()}
            style={{ opacity: isClickable ? 1 : 0.5, cursor: isClickable ? 'pointer' : 'not-allowed' }} // Инлайн стили
        >
            <div className={styles.DetailLeft}>
                <span className={styles.PrimaryText}>{detail.name}</span>
                <div className={styles.DetailCountWrapper}>
                    <p className={styles.HelperText}>Количество: </p>
                    <p className={styles.PrimaryText}>{detail.amount}</p>
                </div>
                {displayPrice && (
                    <div className={styles.DetailCountWrapper}>
                        <p className={styles.HelperText}>Цена: </p>
                        <p className={styles.PrimaryText}>{detail.price}</p>
                    </div>
                )}
            </div>
            <div className={styles.DetailRight}>
                <div className={styles.DetailNumberWrapper}>
                    <p className={styles.HelperText} id={styles.detail_number_label}>Номер запчасти</p>
                    <p className={styles.PrimaryText}>{detail.vin}</p>
                </div>
                <div className={styles.RightArrowWrapper}>
                    <img className={styles.RightArrow} src={right_arrow_icon} />
                </div>
            </div>
        </div>
    );
}

export default Detail;

