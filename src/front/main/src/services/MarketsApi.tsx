import { getData, postData, API_URL } from './Api.js';
import { TMarket, TCreateMarketData } from '../types/Market.js';
import axios from 'axios';

// export const fetchMarkets = async (setData) => {
//     const parseData = (data) => {
//         return data.records.map(market => ({
//             id: market.id,
//             name: market.name,
//             address: market.address,
//         }));
//     };

//     const url = `${API_URL}/markets`;
//     let result = await getData(url, parseData);
//     if (result == null) { setData([]); }
//     else {
//         setData(result);
//     }

// };

// export const createMarket = async (newMarket) => {
//     await postData(newMarket, `${API_URL}/markets`);
// }

export const createMarket = (newMarket: TCreateMarketData): Promise<TMarket[]> => {
    const url = `${API_URL}/markets`;
    return axios
        .post(url, newMarket, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
};


export const fetchMarkets = (): Promise<TMarket[]> => {
    const url = `${API_URL}/markets`;
    return axios
        .get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                console.error("Ошибка при получении данных:", error.message);
            } else {
                console.error("Ошибка при получении данных:", error);
            }
            return [];
        });
};

