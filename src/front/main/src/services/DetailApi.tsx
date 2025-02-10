import axios from 'axios';
import { TDetail } from '../types/Detail';
import { API_URL } from './Api';


export const searchDetails = (vin: string, market_id: string): Promise<TDetail[]> => {
    const url = `${API_URL}/search?vin=${vin || ""}&market_id=${market_id}`;
    return axios.get(url, {
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


export const mockSearchDetails = async (vin: string, market_id: string): Promise<TDetail[]> => {
    const mockData: TDetail[] = [{
        vin: vin || "12345678901234567",
        name: "Тестовый Автомобиль",
        amount: Math.floor(Math.random() * 10000) + 1000,
    }];
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockData);
        }, 1000);

    });

};
