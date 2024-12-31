export function isFirstEarlier(date1, date2) {
    console.log(date1, date2);
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    console.log(`${d1} < ${d2} = ${d1 <= d2}`)
    return d1 < d2;
}