import { id } from "date-fns/locale";

export const API_URL = 'https://asm3ceps.ru/api'
//export const API_URL = 'http://127.0.0.1:5000/api'

export function formatDateToSend(inputDate) {
    const date = new Date(inputDate); // Создаем объект Date

    // Проверяем, является ли дата валидной
    if (isNaN(date)) {
        return "";
    }

    // Получаем год, месяц и день
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы с 0
    const day = String(date.getDate()).padStart(2, '0'); // День с ведущим нулем

    // Форматируем в нужный вид
    return `${year}-${month}-${day}`;
}

export function formatDateToDisplay(inputDate) {
    const date = new Date(inputDate); // Создаем объект Date

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



// export const fetchReturns = async (filters, setData, setLoading) => {
//     setLoading(true); // Начинаем загрузку
//     await new Promise(resolve => setTimeout(resolve, 2000)); // Задержка 2 секунды
//     const returnData = [
//         { detailNumber: 525252, date: "2020-12-12", isAir: false, count: 100, sellDate: "2012-12-12", seller: "Волтер Уайт", price: 1000, store: "", comment: "Ю гот дем райт" },
//         { detailNumber: 525252, date: "2020-12-12", isAir: true, count: 100, sellDate: "2012-12-12", seller: "Волтер Уайт", price: 1000, store: "Пивоман", comment: "Ю гот дем райт" },
//         // Добавьте больше данных по необходимости
//     ];
//     setData(returnData);
//     setLoading(false); // Завершение загрузки
// }

// export const fetchPurchase = async (filters, setData, setLoading) => {
//     setLoading(true); // Начинаем загрузку
//     await new Promise(resolve => setTimeout(resolve, 2000)); // Задержка 2 секунды
//     let returnData = [];
//     if (filters.vin == "12345" || filters.vin.length == 0) {
//         returnData.push
//             ({
//                 detailNumber: 525252,
//                 name: "Detail",
//                 count: 10,
//                 price: 1000,
//                 sellDate: "2012-12-12",
//                 purchaseDate: "2012-12-12",
//             });
//         // Добавьте больше данных по необходимости
//     };
//     setData(returnData);
//     setLoading(false); // Завершение загрузки
// }

// export const fetchSells = async (filters, setData, setLoading) => {
//     setLoading(true); // Начинаем загрузку
//     await new Promise(resolve => setTimeout(resolve, 2000)); // Задержка 2 секунды
//     const returnData = [
//         { detailNumber: 525252, name: "Detail", count: 10, price: 1000, sellDate: "2012-12-12", purchaseDate: "2012-12-12" },
//         // Добавьте больше данных по необходимости
//     ];
//     setData(returnData);
//     setLoading(false); // Завершение загрузки
// }

export const fetchPurchaseReal = async (filters, setData, setLoading) => {
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

export const fetchSellsReal = async (filters, setData, setLoading) => {
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

export const fetchReturnsReal = async (filters, setData, setLoading) => {
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


export const updateReturnById = async (returnId, updatedReturn, isAir, setLoading) => {
    setLoading(true); // Устанавливаем загрузку в true перед запросом
    const type = isAir ? "airreturn" : "return";
    updateReturnById.sell_date = formatDateToSend(updateReturnById.sell_date);
    updateReturnById.return_date = formatDateToSend(updateReturnById.return_date);
    try {
        const response = await fetch(`${API_URL}/returns/${returnId}?type=${type}`, {
            method: 'POST', // Метод запроса,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedReturn),


        });

        // Проверяем, успешен ли ответ
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return (data);

    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return ({}); // Обрабатываем ошибку, возвращая пустой массив
    } finally {
        setLoading(false); // Всегда отключаем загрузку после выполнения
    }
    return ({});
};

export const updateReturnHistoryById = async (returnId, updatedReturn, isAir, setLoading) => {
    setLoading(true); // Устанавливаем загрузку в true перед запросом
    const type = isAir ? "airreturn" : "return";
    updateReturnById.sell_date = formatDateToSend(updateReturnById.sell_date);
    updateReturnById.return_date = formatDateToSend(updateReturnById.return_date);
    try {
        const response = await fetch(`${API_URL}/history/returns/${returnId}?type=${type}`, {
            method: 'POST', // Метод запроса,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedReturn),


        });

        // Проверяем, успешен ли ответ
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return (data);

    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return ({}); // Обрабатываем ошибку, возвращая пустой массив
    } finally {
        setLoading(false); // Всегда отключаем загрузку после выполнения
    }
    return ({});
};

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
    setLoading(true); // Устанавливаем загрузку в true перед запросом
    const type = isAir ? "airreturn" : "return";
    try {
        const response = await fetch(`${API_URL}/returns/${returnId}?type=${type}`, {
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

export const fetchPurchaseById = async (itemId, setLoading) => {
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
                count: detail.amount || 0, // Обеспечиваем, что count не буде undefined
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




export const submitData = async (submitData, url) => {
    try {
        const response = {
            ok: true,
            status: 200,
            json: async () => ({
                id: 1,
                ...submitData,
            }),
        };

        if (!response.ok) {
            throw new Error(response.status);
        }

        const data = await response.json();

        if (response.status !== 200) {
            throw new Error(response.status);
        }

        return {
            status: response.status,
            message: "Данные обновлены!",
            data: data,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const postData = async (dataObject, type) => {
    let response;
    try {
        // Формируем URL запроса
        const url = `${API_URL}/${type}`;

        // Отправляем POST-запрос с данными
        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Добавьте заголовок Authorization, если нужен
                // 'Authorization': 'Bearer ваш-токен',
            },
            body: JSON.stringify(dataObject), // Преобразуем объект в JSON-строку
        });

        // Проверяем статус ответа
        if (!response.ok) {
            const errorText = await response.text(); // Получаем текст ошибки
            throw new Error(`HTTP ошибка! Статус: ${response.status}, текст: ${errorText}`);
        }

        // Парсим JSON-ответ
        const data = await response.json();
        return data; // Возвращаем полученные данные

    } catch (error) {
        console.error("Ошибка при отправке данных:", error);
        throw error; // Бросаем ошибку дальше, чтобы обработать её в вызывающей функции
    }
};




export const auth = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 2000);
    });
};
