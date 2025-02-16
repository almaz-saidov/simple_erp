import axios from 'axios';
import { TDetail } from '../types/Detail';
import { TMarket } from '../types/Market';
import { API_URL } from './Api';
import { fetchMarkets } from '../services/MarketsApi';
import { se } from 'date-fns/locale';

export const editSell = async (sell: any, sell_id: number, market_id: number): Promise<boolean> => {
    const url = `${API_URL}/history/sell/${sell_id || ""}?market_id=${market_id}`;
    const data = {
        vin: sell.detailNumber,
        amount: sell.count,
        date: sell.date,
        price: sell.price,
        seller: sell.name,
        name: sell.name,
    }
    return axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((response) => {
            console.log(response.data)
            return response.data.status;
        })

        .catch((error) => {
            throw error;
        });
};