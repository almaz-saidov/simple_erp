import { id } from "date-fns/locale";

//export const API_URL = 'https://asm3ceps.ru/api'
export const API_URL = 'http://127.0.0.1:5000/api'

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



export const fetchPurchases = async (filters, setData, setLoading) => {
    setLoading(true); // Устанавливаем загрузку в true перед запросом

    try {
        const response = await fetch(`${API_URL}/history?type=postupleniya&like=${filters.vin || ""}&date_from=${filters.date_from}&date_before=${filters.date_before}`, {
            method: 'GET', // Метод запроса,
            headers: {
                'Content-Type': 'application/json',
            },

        });

        // Проверяем, успешен ли ответ
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.records)) {
            const returnData = data.records.map(sell => ({
                count: sell.amount || 0,
                date: formatDateToDisplay(sell.date),
                id: sell.id,
                price: sell.price,
                type: sell.type,
                detailNumber: sell.vin,

            }));
            setData(returnData);
        } else {
            setData([]);
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setData([]);
    } finally {
        setLoading(false);
    }
};

export const fetchSells = async (filters, setData, setLoading) => {
    setLoading(true); // Устанавливаем загрузку в true перед запросом

    try {
        const response = await fetch(`${API_URL}/history?type=vidyacha&like=${filters.vin || ""}&date_from=${filters.date_from}&date_before=${filters.date_before}`, {
            method: 'GET', // Метод запроса,
            headers: {
                'Content-Type': 'application/json',
            },

        });

        // Проверяем, успешен ли ответ
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.records)) {
            const returnData = data.records.map(sell => ({
                count: sell.amount || 0,
                date: formatDateToDisplay(sell.date),
                id: sell.id,
                price: sell.price,
                type: sell.type,
                detailNumber: sell.vin,

            }));
            setData(returnData); // Устанавливаем данные
        } else {
            setData([]); // Если ответ неудачный, возвращаем пустой массив
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setData([]); // Обрабатываем ошибку, возвращая пустой массив
    } finally {
        setLoading(false); // Всегда отключаем загрузку после выполнения
    }
};

export const fetchReturns = async (filters, setData, setLoading) => {
    setLoading(true); // Устанавливаем загрузку в true перед запросом

    try {
        const response = await fetch(`${API_URL}/history?type=vozvraty&like=${filters.vin || ""}&date_from=${filters.date_from}&date_before=${filters.date_before}`, {
            method: 'GET', // Метод запроса,
            headers: {
                'Content-Type': 'application/json',
            },

        });

        // Проверяем, успешен ли ответ
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.records)) {
            const returnData = data.records.map(returnData => ({
                count: returnData.amount || 0,
                returnDate: formatDateToDisplay(returnData.date),
                id: returnData.id,
                price: returnData.price,
                isAir: returnData.type === "airreturn",
                detailNumber: returnData.vin,

            }));
            setData(returnData); // Устанавливаем данные
        } else {
            setData([]); // Если ответ неудачный, возвращаем пустой массив
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setData([]); // Обрабатываем ошибку, возвращая пустой массив
    } finally {
        setLoading(false); // Всегда отключаем загрузку после выполнения
    }
};

export const updateReturnById = async (updatedReturn, isAir) => {
    const type = isAir ? "airreturn" : "return";
    updatedReturn.sell_date = formatDateToSend(updatedReturn.sell_date);
    updatedReturn.return_date = formatDateToSend(updatedReturn.return_date);
    await postData(updatedReturn, `${API_URL}/returns/${updatedReturn.id}?type=${type}`);

};

export const updateReturnHistoryById = async (updatedReturn, isAir) => {
    const type = isAir ? "airreturn" : "return";
    updatedReturn.sell_date = formatDateToSend(updatedReturn.sell_date);
    updatedReturn.return_date = formatDateToSend(updatedReturn.return_date);
    await postData(updatedReturn, `${API_URL}/history/returns/${updatedReturn.id}?type=${type}`);
}

export const createReturn = async (newReturn, isAir) => {
    const url = `${API_URL}/${(isAir ? "returns/create_air_return" : "returns/create_return")}`;
    await postData(newReturn, url);
}

export const createPurchase = async (newPurchase) => {
    await postData(newPurchase, `${API_URL}/purchases`);
}

export const createSell = async (newSell) => {
    await postData(newSell, `${API_URL}/sales`);
}

export const fetchReturnHistoryById = async (returnId, isAir, setLoading) => {
    setLoading(true); // Устанавливаем загрузку в true перед запросом
    const type = isAir ? "airreturn" : "return";
    try {
        const response = await fetch(`${API_URL}/history/returns/${returnId}?type=${type}`, {
            method: 'GET', // Метод запроса,
            headers: {
                'Content-Type': 'application/json',
            },

        });

        // Проверяем, успешен ли ответ
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
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
            return (returnData); // Устанавливаем данные
        } else {
            return ({}); // Если ответ неудачный, возвращаем пустой массив
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return ({}); // Обрабатываем ошибку, возвращая пустой массив
    } finally {
        setLoading(false); // Всегда отключаем загрузку после выполнения
    }
    return ({});
};

export const fetchReturnById = async (returnId, isAir, setLoading) => {
    setLoading(true);
    const type = isAir ? "airreturn" : "return";
    try {
        const response = await fetch(`${API_URL}/returns/${returnId}?type=${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
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
            return (returnData); // Устанавливаем данные
        } else {
            return ({}); // Если ответ неудачный, возвращаем пустой массив
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return ({}); // Обрабатываем ошибку, возвращая пустой массив
    } finally {
        setLoading(false); // Всегда отключаем загрузку после выполнения
    }
    return ({});
};

export const fetchPurchasesById = async (itemId, setLoading) => {
    setLoading(true); // Устанавливаем загрузку в true перед запросом
    try {
        const response = await fetch(`${API_URL}/history/purchase/${itemId}`, {
            method: 'GET', // Метод запроса,
            headers: {
                'Content-Type': 'application/json',
            },

        });

        // Проверяем, успешен ли ответ
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            const purchase = {
                count: data.purchase.amount,
                date: formatDateToDisplay(data.purchase.date),
                detailName: data.purchase.detail_name,
                price: data.purchase.price,
                detailNumber: data.purchase.vin,
                whoAdded: data.purchase.who_added,

            };

            return (purchase); // Устанавливаем данные
        } else {
            return ({}); // Если ответ неудачный, возвращаем пустой массив
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return ({}); // Обрабатываем ошибку, возвращая пустой массив
    } finally {
        setLoading(false); // Всегда отключаем загрузку после выполнения
    }
    return ({});
};


export const fetchSellById = async (itemId, setLoading) => {
    setLoading(true); // Устанавливаем загрузку в true перед запросом
    try {
        const response = await fetch(`${API_URL}/history/sell/${itemId}`, {
            method: 'GET', // Метод запроса,
            headers: {
                'Content-Type': 'application/json',
            },

        });

        // Проверяем, успешен ли ответ
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            const sell = {
                count: data.sell.amount,
                date: formatDateToDisplay(data.sell.date),
                name: data.sell.name,
                price: data.sell.price,
                detailNumber: data.sell.vin,
                whoAdded: data.sell.who_added,
            };

            return (sell); // Устанавливаем данные
        } else {
            return ({}); // Если ответ неудачный, возвращаем пустой массив
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return ({}); // Обрабатываем ошибку, возвращая пустой массив
    } finally {
        setLoading(false); // Всегда отключаем загрузку после выполнения
    }
    return ({});
};


export const fetchReturnsAll = async (setData, setLoading) => {
    setLoading(true); // Устанавливаем загрузку в true перед запросом

    try {
        const response = await fetch(`${API_URL}/returns`, {
            method: 'GET', // Метод запроса,
            headers: {
                'Content-Type': 'application/json',
            },

        });

        // Проверяем, успешен ли ответ
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.sorted_return_list)) {
            const returnData = data.sorted_return_list.map(returnData => ({
                id: returnData.id,
                returnDate: formatDateToDisplay(returnData.return_date),
                isAir: returnData.type == "airreturn",
                detailNumber: returnData.vin,
            }));
            setData(returnData); // Устанавливаем данные
        } else {
            setData([]); // Если ответ неудачный, возвращаем пустой массив
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setData([]); // Обрабатываем ошибку, возвращая пустой массив
    } finally {
        setLoading(false); // Всегда отключаем загрузку после выполнения
    }
};

export const fetchDetails = async (vin, setData, setLoading) => {
    setLoading(true); // Устанавливаем загрузку в true перед запросом

    try {
        const response = await fetch(`${API_URL}/search?vin=${vin || ""}`, {
            method: 'GET', // Метод запроса,
            headers: {
                'Content-Type': 'application/json',
            },

        });

        // Проверяем, успешен ли ответ
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.details)) {
            const returnData = data.details.map(detail => ({
                detailNumber: detail.vin,
                name: detail.name,
                count: detail.amount || 0,
            }));
            setData(returnData);
        } else {
            setData([]);
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setData([]);
    } finally {
        setLoading(false);
    }
};

export const postData = async (dataObject, url) => {
    let response;
    try {
        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObject),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ошибка! Статус: ${response.status}, текст: ${errorText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Ошибка при отправке данных:", error);
        throw error;
    }

};


