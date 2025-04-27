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

export const resolveCollision = (entries: HashTableEntry[], index: number, key: string | number, hashValue: number, collisionMethod: string): { entries: HashTableEntry[], overflow: boolean, message?: string } => {
    const newEntries = [...entries];

    // Проверяем, существует ли уже такой ключ в таблице
    const existingKeyIndex = findKeyIndex(newEntries, key);
    if (existingKeyIndex !== null) {
        // Если ключ уже существует, считаем это успешной операцией без изменений
        return { entries: newEntries, overflow: false, message: `Ключ "${key}" уже существует в таблице.` };
    }

    if (collisionMethod === 'chain') {
        return resolveChainCollision(newEntries, index, key, hashValue);
    } else if (collisionMethod === 'internalChain') {
        return resolveInternalChainCollision(newEntries, index, key, hashValue, entries.length);
    } else if (collisionMethod === 'linear') {
        return resolveLinearCollision(newEntries, index, key, hashValue, entries.length);
    } else if (collisionMethod === 'quadratic') {
        return resolveQuadraticCollision(newEntries, index, key, hashValue, entries.length);
    }

    return { entries: newEntries, overflow: false };
};

// Функция для поиска индекса существующего ключа
const findKeyIndex = (entries: HashTableEntry[], key: string | number): number | null => {
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].key === key) {
            return i;
        }
    }
    return null;
};

const resolveChainCollision = (entries: HashTableEntry[], index: number, key: string | number, hashValue: number): { entries: HashTableEntry[], overflow: boolean } => {
    const newEntries = [...entries];
    if (newEntries[index].key === null) {
        newEntries[index] = { ...newEntries[index], key, hashValue, collisions: 0 };
    } else {
        newEntries[index] = { ...newEntries[index], collisions: newEntries[index].collisions + 1 };
    }
    return { entries: newEntries, overflow: false };
};

const resolveInternalChainCollision = (entries: HashTableEntry[], index: number, key: string | number, hashValue: number, size: number): { entries: HashTableEntry[], overflow: boolean, message?: string } => {
    const newEntries = [...entries];
    if (newEntries[index].key === null) {
        newEntries[index] = { ...newEntries[index], key, hashValue, collisions: 0 };
        return { entries: newEntries, overflow: false };
    } else {
        let freeIndex = (index + 1) % size;
        while (newEntries[freeIndex].key !== null && freeIndex !== index) {
            freeIndex = (freeIndex + 1) % size;
        }

        if (freeIndex === index) {
            return { 
                entries: newEntries, 
                overflow: true, 
                message: 'Таблица переполнена! Невозможно добавить новый элемент с использованием метода внутренних цепочек.' 
            };
        }

        let currentIndex: number | null = index;
        while (currentIndex !== null && newEntries[currentIndex].link !== null) {
            currentIndex = newEntries[currentIndex].link;
        }

        if (currentIndex !== null) {
            newEntries[currentIndex] = { ...newEntries[currentIndex], link: freeIndex };
            newEntries[freeIndex] = { ...newEntries[freeIndex], key, hashValue, collisions: newEntries[index].collisions + 1 };
        }
        return { entries: newEntries, overflow: false };
    }
};

const resolveLinearCollision = (entries: HashTableEntry[], index: number, key: string | number, hashValue: number, size: number): { entries: HashTableEntry[], overflow: boolean, message?: string } => {
    const newEntries = [...entries];
    if (newEntries[index].key === null) {
        newEntries[index] = { ...newEntries[index], key, hashValue, collisions: 0 };
        return { entries: newEntries, overflow: false };
    } else {
        let probeIndex = (index + 1) % size;
        let collisions = 1;

        while (newEntries[probeIndex].key !== null && probeIndex !== index) {
            probeIndex = (probeIndex + 1) % size;
            collisions++;
        }

        if (probeIndex === index) {
            return { 
                entries: newEntries, 
                overflow: true, 
                message: 'Таблица переполнена! Невозможно добавить новый элемент с использованием метода линейного опробования.' 
            };
        }

        newEntries[probeIndex] = { ...newEntries[probeIndex], key, hashValue, collisions };
        return { entries: newEntries, overflow: false };
    }
};

export const resolveQuadraticCollision = (entries: HashTableEntry[], index: number, key: string | number, hashValue: number, size: number): { entries: HashTableEntry[], overflow: boolean, message?: string } => {
    const newEntries = [...entries];
    // Максимальное число проб - ограничиваем половиной размера таблицы
    const MAX_PROBES = Math.ceil(size / 2);
    
    // Если ячейка свободна, вставляем элемент
    if (newEntries[index].key === null) {
        newEntries[index] = { ...newEntries[index], key, hashValue, collisions: 0 };
        return { entries: newEntries, overflow: false };
    } else {
        let i = 1;
        let collisions = 1;
        let probeIndex = (index + i * i) % size;
        
        // Проверяем не более MAX_PROBES раз
        while (newEntries[probeIndex].key !== null && i < MAX_PROBES) {
            i++;
            probeIndex = (index + i * i) % size;
            collisions++;
            
            // Если рассчитанный индекс выходит за пределы таблицы
            if (probeIndex >= size) {
                probeIndex %= size;
            }
        }
        
        // Если достигнут лимит проб или все ячейки заняты
        if (i >= MAX_PROBES || collisions >= size) {
            return { 
                entries: newEntries, 
                overflow: true, 
                message: `Превышено максимальное число проб (${MAX_PROBES}) при квадратичном опробовании!` 
            };
        }
        
        // Если найдена свободная ячейка - добавляем элемент
        newEntries[probeIndex] = { ...newEntries[probeIndex], key, hashValue, collisions };
        return { entries: newEntries, overflow: false };
    }
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
    insert: (table: (Node | null)[], index: number, key: string | number, data: any): { success: boolean, isNewElement: boolean } => {
        const newNode = new Node(key, data);

        if (table[index] === null) {
            // Если позиция пуста, вставляем новый узел
            table[index] = newNode;
            return { success: true, isNewElement: true };
        } else {
            // Если позиция занята, добавляем в связанный список
            let current = table[index];
            while (current) {
                if (current.key === key) {
                    // Если ключ уже существует, обновляем данные
                    current.data = data;
                    return { success: true, isNewElement: false };
                }
                if (current.next === null) {
                    current.next = newNode; // Добавляем новый узел в конец
                    return { success: true, isNewElement: true };
                }
                current = current.next;
            }
        }
        
        return { success: false, isNewElement: false };
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

export const searchKey = (entries: HashTableEntry[], key: string | number, hashMethod: string): { found: boolean, index: number | null, message?: string } => {
    const index = calculateHash(key, hashMethod, entries.length); // Вычисляем индекс

    // Ищем ключ в таблице
    if (entries[index].key === key) {
        return { found: true, index: index };
    }

    // Если ключа нет в основной позиции, проверяем в соответствии с методом разрешения коллизий
    // Для ключа с методом chain ищем в основной позиции
    if (entries[index].key !== null && entries[index].link !== null) {
        // Проверяем связанные элементы
        let currentIndex: number | null = entries[index].link;
        while (currentIndex !== null) {
            if (entries[currentIndex].key === key) {
                return { found: true, index: currentIndex };
            }
            currentIndex = entries[currentIndex].link;
        }
    }

    // Для линейного пробирования ищем последовательно
    let linearIndex = (index + 1) % entries.length;
    while (linearIndex !== index && entries[linearIndex].key !== null) {
        if (entries[linearIndex].key === key) {
            return { found: true, index: linearIndex };
        }
        linearIndex = (linearIndex + 1) % entries.length;
    }

    // Для квадратичного пробирования
    let i = 1;
    let quadraticIndex = (index + i * i) % entries.length;
    // Ограничиваем максимальное количество проб
    const MAX_SEARCH_PROBES = Math.ceil(entries.length / 2);
    while (i < MAX_SEARCH_PROBES && entries[quadraticIndex].key !== null) {
        if (entries[quadraticIndex].key === key) {
            return { found: true, index: quadraticIndex };
        }
        i++;
        quadraticIndex = (index + i * i) % entries.length;
    }

    return { found: false, index: null, message: 'Ключ не найден в таблице' };
}; 