export function compareDates(date1, date2) {
    const d1 = dayjs(date1, 'DD.MM.YYYY'); // Парсим первую дату
    const d2 = dayjs(date2, 'DD.MM.YYYY'); // Парсим вторую дату

    return d1.isBefore(d2); // Возвращает true, если d1 раньше d2
}