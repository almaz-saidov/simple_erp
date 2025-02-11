import { getData, postData, API_URL } from './Api.js';


export const fetchMarkets = async (setData) => {
    const parseData = (data) => {
        return data.records.map(market => ({
            id: market.id,
            name: market.name,
            address: market.address,
        }));
    };

    const url = `${API_URL}/markets`;
    let result = await getData(url, parseData);
    if (result == null) { setData([]); }
    else {
        setData(result);
    }

};

export const createMarket = async (newMarket) => {
    await postData(newMarket, `${API_URL}/markets`);
}