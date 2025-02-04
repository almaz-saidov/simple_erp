import { id } from "date-fns/locale";

export const API_URL = 'https://asm3ceps.ru/api'
//export const API_URL = 'http://127.0.0.1:5000/api'

export function formatDateToSend(inputDate) {
    const date = new Date(inputDate);

    if (isNaN(date)) {
        return "";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function formatDateToDisplay(inputDate) {
    const date = new Date(inputDate);

    // Проверяем, является ли дата валидной
    if (isNaN(date)) {
        return "";
    }

    // Получаем год, месяц и день
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы с 0
    const day = String(date.getDate()).padStart(2, '0'); // День с ведущим нулем

    // Форматируем в нужный вид и возвращаем
    return `${day}.${month}.${year}`;
}

export const postData = async (dataObject, url) => {
    //let response;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObject),
        });

        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}, text: ${response.text()}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Ошибка при отправке данных:", error);
        throw error;
    }

};

export const deleteData = async (dataObject, url) => {
    //let response;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObject),
        });

        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}, text: ${response.text()}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Ошибка при отправке данных:", error);
        throw error;
    }

};

export const getData = async (url, parseData) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const parsedData = parseData(data);

        if (parsedData) {
            return parsedData;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return null;
    }
};



export const updateReturnById = async (updatedReturn, isAir, market_id) => {
    const type = isAir ? "airreturn" : "return";
    updatedReturn.sell_date = formatDateToSend(updatedReturn.sell_date);
    updatedReturn.return_date = formatDateToSend(updatedReturn.return_date);
    await postData(updatedReturn, `${API_URL}/returns/${updatedReturn.id}?type=${type}&market_id=${market_id}`);

};

export const updateReturnHistoryById = async (updatedReturn, isAir, market_id) => {
    const type = isAir ? "airreturn" : "return";
    updatedReturn.sell_date = formatDateToSend(updatedReturn.sell_date);
    updatedReturn.return_date = formatDateToSend(updatedReturn.return_date);
    await postData(updatedReturn, `${API_URL}/history/returns/${updatedReturn.id}?type=${type}&market_id=${market_id}`);
}

export const createReturn = async (newReturn, isAir, market_id) => {
    const url = `${API_URL}/${(isAir ? "returns/create_air_return" : "returns/create_return")}?market_id=${market_id}`;
    await postData(newReturn, url);
}


export const deleteReturnById = async (updatedReturn, isAir, market_id) => {
    const type = isAir ? "airreturn" : "return";
    updatedReturn.sell_date = formatDateToSend(updatedReturn.sell_date);
    updatedReturn.return_date = formatDateToSend(updatedReturn.return_date);
    await deleteData(updatedReturn, `${API_URL}/returns/${updatedReturn.id}?type=${type}&market_id=${market_id}`);

}
export const createPurchase = async (newPurchase, market_id) => {
    await postData(newPurchase, `${API_URL}/purchases?market_id=${market_id}`);
}

export const createSell = async (newSell, market_id) => {
    await postData(newSell, `${API_URL}/sales?market_id=${market_id}`);
}

export const fetchReturnHistoryById = async (itemId, isAir, market_id) => {
    const type = isAir ? "airreturn" : "return";
    const parseData = (data) => {
        const returnData = {
        };
        returnData.count = data.return.amount;
        if (isAir) {
            returnData.store = data.return.another_shop;
        }
        returnData.comment = data.return.comment;
        returnData.isCompleat = data.return.is_compleat;
        returnData.price = data.return.price;
        returnData.date = formatDateToSend(data.return.return_date);
        returnData.sellDate = formatDateToSend(data.return.sell_date);
        returnData.seller = data.return.to_seller;
        returnData.detailNumber = data.return.vin;
        returnData.whoAdded = data.return.who_added;
        return (returnData);
    }

    const url = `${API_URL}/history/returns/${itemId}?type=${type}&market_id=${market_id}`;
    let result = await getData(url, parseData);
    if (result == null) { return {}; }
    return result;
};


export const fetchReturnById = async (itemId, isAir, market_id) => {
    const type = isAir ? "airreturn" : "return";
    const parseData = (data) => {
        const returnData = {
        };
        returnData.count = data.return.amount;
        if (isAir) {
            returnData.store = data.return.another_shop;
        }
        returnData.comment = data.return.comment;
        returnData.isCompleat = data.return.is_compleat;
        returnData.price = data.return.price;
        returnData.date = formatDateToSend(data.return.return_date);
        returnData.sellDate = formatDateToSend(data.return.sell_date);
        returnData.seller = data.return.to_seller;
        returnData.detailNumber = data.return.vin;
        return (returnData);
    }

    const url = `${API_URL}/returns/${itemId}?type=${type}&market_id=${market_id}`;
    let result = await getData(url, parseData);
    if (result == null) { return {}; }
    return result;
};


export const fetchPurchasesById = async (itemId, market_id) => {

    const parseData = (data) => {
        return {
            count: data.purchase.amount,
            date: formatDateToDisplay(data.purchase.date),
            detailName: data.purchase.detail_name,
            price: data.purchase.price,
            detailNumber: data.purchase.vin,
            whoAdded: data.purchase.who_added,
        };
    }
    const url = `${API_URL}/history/purchase/${itemId}?market_id=${market_id}`;
    let result = await getData(url, parseData);
    if (result == null) { return {}; }
    return result;
};

export const fetchSellById = async (itemId, market_id) => {

    const parseData = (data) => {
        return {
            count: data.sell.amount,
            date: formatDateToDisplay(data.sell.date),
            name: data.sell.name,
            price: data.sell.price,
            detailNumber: data.sell.vin,
            whoAdded: data.sell.who_added,
        };
    }
    const url = `${API_URL}/history/sell/${itemId}?market_id=${market_id}`;
    let result = await getData(url, parseData);
    if (result == null) { return {}; }
    return result;
};


export const fetchPurchases = async (filters, setData, market_id) => {

    const parseData = (data) => {
        return data.records.map(sell => ({
            count: sell.amount || 0,
            date: formatDateToDisplay(sell.date),
            id: sell.id,
            price: sell.price,
            type: sell.type,
            detailNumber: sell.vin,

        }));
    }

    const url = `${API_URL}/history?type=postupleniya&like=${filters.vin || ""}&date_from=${filters.date_from}&date_before=${filters.date_before}&market_id=${market_id}`;
    let result = await getData(url, parseData);
    if (result == null) { setData([]); }
    else {
        setData(result);
    }
}


export const fetchSells = async (filters, setData, market_id) => {
    const parseData = (data) => {
        return data.records.map(sell => ({
            count: sell.amount || 0,
            date: formatDateToDisplay(sell.date),
            id: sell.id,
            price: sell.price,
            type: sell.type,
            detailNumber: sell.vin,

        }));
    };

    const url = `${API_URL}/history?type=vidyacha&like=${filters.vin || ""}&date_from=${filters.date_from}&date_before=${filters.date_before}&market_id=${market_id}`;
    let result = await getData(url, parseData);
    if (result == null) { setData([]); }
    else {
        setData(result);
    }

};

export const fetchReturns = async (filters, setData, market_id) => {
    const parseData = (data) => {
        if (data.success && Array.isArray(data.records)) {
            return data.records.map(returnData => ({
                count: returnData.amount || 0,
                returnDate: formatDateToDisplay(returnData.date),
                id: returnData.id,
                price: returnData.price,
                isAir: returnData.type === "airreturn",
                detailNumber: returnData.vin,

            }));
        }
    }

    const url = `${API_URL}/history?type=vozvraty&like=${filters.vin || ""}&date_from=${filters.date_from}&date_before=${filters.date_before}&market_id=${market_id}`;
    let result = await getData(url, parseData);
    if (result == null) { setData([]); }
    else {
        setData(result);
    }
};

export const fetchReturnsAll = async (setData, market_id) => {
    const parseData = (data) => {
        if (data.success && Array.isArray(data.sorted_return_list)) {
            return data.sorted_return_list.map(returnData => ({
                id: returnData.id,
                returnDate: formatDateToDisplay(returnData.return_date),
                isAir: returnData.type == "airreturn",
                detailNumber: returnData.vin,
            }));
        }
        return null;
    };

    const url = `${API_URL}/returns?market_id=${market_id}`;
    let result = await getData(url, parseData);
    if (result == null) { setData([]); }
    else {
        setData(result);
    }
};


// export const fetchDetailsNew = async (vin, setData, market_id) => {
//     const parseDetailsData = (data) => {
//         if (data.success && Array.isArray(data.details)) {
//             return data.details.map(detail => ({
//                 detailNumber: detail.vin,
//                 name: detail.name,
//                 count: detail.amount || 0,
//             }));
//         }
//         return null;
//     };

//     const url = `${API_URL}/search?vin=${vin || ""}&market_id=${market_id}`;
//     const result = await getData(url, parseDetailsData);
//     if (result == null) { setData([]); }
//     else {
//         setData(result);
//     }
// };

export const fetchDetailsNew = async (vin, setData, market_id) => {
    const parseDetailsData = (data) => {
        if (data.success && Array.isArray(data.details)) {
            return data.details.map(detail => ({
                detailNumber: detail.vin,
                name: detail.name,
                count: detail.amount || 0,
            }));
        }
        return null;
    };

    // Мок-функция для тестирования
    const mockFetchDetails = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    details: [
                        { vin: '1234567890', name: 'Detail 1Detail 1Detail 1Detail 1Detail 1Detail 1Detail 1', amount: 5 },
                        { vin: '0987654321', name: 'Detail 2', amount: 3 },
                        { vin: '1357924680', name: 'Detail 3', amount: 7 },
                    ],
                });
            }, 1000); // Имитация задержки сети
        });
    };

    // Используем мок-функцию вместо реального запроса
    const result = await mockFetchDetails().then(parseDetailsData);

    if (result == null) {
        setData([]);
    } else {
        setData(result);
    }
};



