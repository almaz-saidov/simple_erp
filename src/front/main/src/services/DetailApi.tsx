import axios from 'axios';
import { TDetail } from '../types/Detail';
import { TMarket } from '../types/Market';
import { API_URL } from './Api';
import { fetchMarkets } from '../services/MarketsApi';


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

export const searchDetailsCommon = (vin: string): Promise<TDetail[]> => {
    const url = `${API_URL}/entire-search?vin=${vin || ""}`;
    return axios.get(url, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            console.log(response.data)
            return response.data.details;
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


// export const searchDetailsCommon = (vin: string): Promise<TDetail[]> => {
//     // Заглушка: возвращаем фиктивные данные
//     return new Promise((resolve) => {
//         // Создаем пример данных
//         const mockData: TDetail[] = [
//             {
//                 vin: vin || "1234567890abcdef",
//                 name: "Пример автомобиля",
//                 amount: 10,
//                 price: 20000,
//                 market: "Рынок России",
//             },
//             {
//                 vin: vin || "1234567890abcdef",
//                 name: "Другой автомобиль",
//                 amount: 5,
//                 price: 15000,
//                 market: "Рынок Европы",
//             },
//         ];

//         // Имитация задержки, как при реальном запросе
//         setTimeout(() => {
//             resolve(mockData);
//         }, 1000); // задержка 1 секунда
//     });
// };


export const searchDetailInMarkets = async (vin: string): Promise<TDetail[]> => {

    try {
        const markets: TMarket[] = await fetchMarkets();
        const detailPromises = markets.map(async market => {
            const details = await searchDetails(vin, market.id);
            return details[0];
        });
        const results = await Promise.all(detailPromises);
        const allDetails = results.flat();
        return allDetails;
    } catch (error) {
        console.error(error);
        throw new Error('Не удалось найти деталь');
    }

}
