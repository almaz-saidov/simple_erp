import axios from 'axios';
import { TDetail } from '../types/Detail';
import { TMarket } from '../types/Market';
import { API_URL } from './Api';
import { fetchMarkets } from '../services/MarketsApi';
import { se } from 'date-fns/locale';

export const editPurchase = async (purchase: any, purchase_id: number, market_id: number): Promise<boolean> => {
    const url = `${API_URL}/history/purchase/${purchase_id || ""}?market_id=${market_id}`;
    const data = {
        vin: purchase.detailNumber,
        amount: purchase.count,
        date: purchase.date,
        price: purchase.price,
        detail_name: purchase.detailName,
        name: purchase.whoAdded,
        seller: purchase.whoAdded,
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