import { HashTableEntry } from '../../types/hashTableTypes';
import { divisionMethod, multiplicationMethod, polynomialDivisionMethod } from '../hashing/hashFunctions';

export const calculateHash = (key: string | number, hashMethod: string, size: number): number => {
    if (hashMethod === 'division') {
        return divisionMethod(key, size);
    } else if (hashMethod === 'multiplication') {
        return multiplicationMethod(key, size);
    } else {
        return polynomialDivisionMethod(String(key), size);
    }
};

export const resolveCollision = (entries: HashTableEntry[], index: number, key: string | number, hashValue: number, collisionMethod: string): HashTableEntry[] => {
    const newEntries = [...entries];

    if (collisionMethod === 'chain') {
        return resolveChainCollision(newEntries, index, key, hashValue);
    } else if (collisionMethod === 'internalChain') {
        return resolveInternalChainCollision(newEntries, index, key, hashValue, entries.length);
    } else if (collisionMethod === 'linear') {
        return resolveLinearCollision(newEntries, index, key, hashValue, entries.length);
    } else if (collisionMethod === 'quadratic') {
        return resolveQuadraticCollision(newEntries, index, key, hashValue, entries.length);
    }

    return newEntries;
};

const resolveChainCollision = (entries: HashTableEntry[], index: number, key: string | number, hashValue: number): HashTableEntry[] => {
    const newEntries = [...entries];
    if (newEntries[index].key === null) {
        newEntries[index] = { ...newEntries[index], key, hashValue, collisions: 0 };
    } else {
        newEntries[index] = { ...newEntries[index], collisions: newEntries[index].collisions + 1 };
    }
    return newEntries;
};

const resolveInternalChainCollision = (entries: HashTableEntry[], index: number, key: string | number, hashValue: number, size: number): HashTableEntry[] => {
    const newEntries = [...entries];
    if (newEntries[index].key === null) {
        newEntries[index] = { ...newEntries[index], key, hashValue, collisions: 0 };
    } else {
        let freeIndex = (index + 1) % size;
        while (newEntries[freeIndex].key !== null && freeIndex !== index) {
            freeIndex = (freeIndex + 1) % size;
        }

        if (freeIndex === index) {
            alert('Таблица переполнена!');
            return newEntries;
        }

        let currentIndex: number | null = index;
        while (currentIndex !== null && newEntries[currentIndex].link !== null) {
            currentIndex = newEntries[currentIndex].link;
        }

        if (currentIndex !== null) {
            newEntries[currentIndex] = { ...newEntries[currentIndex], link: freeIndex };
            newEntries[freeIndex] = { ...newEntries[freeIndex], key, hashValue, collisions: newEntries[index].collisions + 1 };
        }
    }
    return newEntries;
};

const resolveLinearCollision = (entries: HashTableEntry[], index: number, key: string | number, hashValue: number, size: number): HashTableEntry[] => {
    const newEntries = [...entries];
    if (newEntries[index].key === null) {
        newEntries[index] = { ...newEntries[index], key, hashValue, collisions: 0 };
    } else {
        let probeIndex = (index + 1) % size;
        let collisions = 1;

        while (newEntries[probeIndex].key !== null && probeIndex !== index) {
            probeIndex = (probeIndex + 1) % size;
            collisions++;
        }

        if (probeIndex === index) {
            alert('Таблица переполнена!');
            return newEntries;
        }

        newEntries[probeIndex] = { ...newEntries[probeIndex], key, hashValue, collisions };
    }
    return newEntries;
};

const resolveQuadraticCollision = (entries: HashTableEntry[], index: number, key: string | number, hashValue: number, size: number): HashTableEntry[] => {
    const newEntries = [...entries];
    if (newEntries[index].key === null) {
        newEntries[index] = { ...newEntries[index], key, hashValue, collisions: 0 };
    } else {
        let i = 1;
        let collisions = 1;
        let probeIndex = (index + i * i) % size;

        while (newEntries[probeIndex].key !== null && i < size) {
            i++;
            probeIndex = (index + i * i) % size;
            collisions++;
        }

        if (i >= size) {
            alert('Таблица переполнена или не удалось найти свободную ячейку!');
            return newEntries;
        }

        newEntries[probeIndex] = { ...newEntries[probeIndex], key, hashValue, collisions };
    }
    return newEntries;
};

// Класс для узла связанного списка
export class Node {
    key: string | number;
    data: any;
    next: Node | null;

    constructor(key: string | number, data: any) {
        this.key = key;
        this.data = data;
        this.next = null;
    }
}

// Методы для работы с цепочками (связанными списками)
export const chainMethod = {
    // Вставка элемента с использованием метода цепочек
    insert: (table: (Node | null)[], index: number, key: string | number, data: any): void => {
        const newNode = new Node(key, data);

        if (table[index] === null) {
            // Если позиция пуста, вставляем новый узел
            table[index] = newNode;
        } else {
            // Если позиция занята, добавляем в связанный список
            let current = table[index];
            while (current) {
                if (current.key === key) {
                    // Если ключ уже существует, обновляем данные
                    current.data = data;
                    return;
                }
                if (current.next === null) {
                    current.next = newNode; // Добавляем новый узел в конец
                    return;
                }
                current = current.next;
            }
        }
    },

    // Поиск по ключу с использованием метода цепочек
    search: (table: (Node | null)[], index: number, key: string | number): any => {
        let current = table[index];

        while (current) {
            if (current.key === key) {
                return current.data; // Возвращаем данные, если найдены
            }
            current = current.next; // Переходим к следующему узлу
        }
        return null; // Ключ не найден
    }
};

export const searchKey = (entries: HashTableEntry[], key: string | number, hashMethod: string): number | null => {
    const index = calculateHash(key, hashMethod, entries.length); // Вычисляем индекс

    switch (hashMethod) {
        case 'chain':
            return searchChain(entries, index, key);
        case 'internalChain':
            return searchInternalChain(entries, index, key);
        case 'linear':
            return searchLinear(entries, index, key);
        case 'quadratic':
            return searchQuadratic(entries, index, key);
        default:
            return null;
    }
};

const searchChain = (entries: HashTableEntry[], index: number, key: string | number): number | null => {
    let currentIndex: number | null = index;
    while (currentIndex !== null && entries[currentIndex].key !== null) {
        if (entries[currentIndex].key === key) {
            return currentIndex; // Возвращаем индекс найденного ключа
        }
        currentIndex = entries[currentIndex].link; // Переход к следующему элементу в цепочке
    }
    return null; // Ключ не найден
};

const searchInternalChain = (entries: HashTableEntry[], index: number, key: string | number): number | null => {
    let currentIndex: number | null = index;
    while (currentIndex !== null && entries[currentIndex].key !== null) {
        if (entries[currentIndex].key === key) {
            return currentIndex; // Возвращаем индекс найденного ключа
        }
        currentIndex = entries[currentIndex].link; // Переход к следующему элементу в цепочке
    }
    return null; // Ключ не найден
};

const searchLinear = (entries: HashTableEntry[], index: number, key: string | number): number | null => {
    let probeIndex = index;
    while (entries[probeIndex].key !== null) {
        if (entries[probeIndex].key === key) {
            return probeIndex; // Возвращаем индекс найденного ключа
        }
        probeIndex = (probeIndex + 1) % entries.length; // Переход к следующему индексу
        if (probeIndex === index) break; // Вернулись к исходному индексу
    }
    return null; // Ключ не найден
};

const searchQuadratic = (entries: HashTableEntry[], index: number, key: string | number): number | null => {
    let i = 1;
    let probeIndex = index;
    while (entries[probeIndex].key !== null) {
        if (entries[probeIndex].key === key) {
            return probeIndex; // Возвращаем индекс найденного ключа
        }
        probeIndex = (index + i * i) % entries.length; // Переход к следующему индексу
        i++;
    }
    return null; // Ключ не найден
}; 