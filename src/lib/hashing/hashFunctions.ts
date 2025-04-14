// Метод деления
export function divisionMethod(key: number | string, m: number): number {
    if (typeof key === 'string') {
        key = stringToInteger(key);
    }
    return key % m; // h(k) = k mod m
}

// Метод умножения
export function multiplicationMethod(key: number | string, m: number): number {
    const A = 0.6180339887; // Константа A
    if (typeof key === 'string') {
        key = stringToInteger(key);
    }
    return Math.floor(m * ((key * A) % 1)); // h(k) = ⌊m × (k × A mod 1)⌋
}

// Метод деления многочленов
export function polynomialDivisionMethod(key: string, m: number): number {
    const p = 31; // Простое число
    let hashValue = 0;
    for (let i = 0; i < key.length; i++) {
        hashValue += key.charCodeAt(i) * Math.pow(p, i); // h(S) = (∑ s_i × p^i)
    }
    return hashValue % m; // mod m
}

// Функция конвертирования строки в число
function stringToInteger(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i); // hash * 31 + charCode
    }
    return hash;
}