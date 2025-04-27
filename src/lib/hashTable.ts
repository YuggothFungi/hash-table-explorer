import { divisionMethod, polynomialDivisionMethod } from './hashing/hashFunctions';
import { Node, chainMethod } from './collision/collisionResolution';
import { ChainEntry } from '../types/hashTableTypes';
import { extractChainEntries } from '../utils/chainUtils';

export class HashTable {
    private table: (Node | null)[];
    private size: number;
    private elementsCount: number;

    constructor(size: number) {
        this.size = size;
        this.table = new Array(size).fill(null); // Initialize the table with null
        this.elementsCount = 0;
    }

    // Получить текущую заполненность таблицы
    public getOccupancyRate(): number {
        return this.elementsCount / this.size;
    }

    // Проверить, переполнена ли таблица
    public isOverflowed(): boolean {
        return this.elementsCount >= this.size;
    }
    
    // Hash function to get the index
    private hash(key: string | number): number {
        if (typeof key === 'string') {
            return polynomialDivisionMethod(key, this.size);
        } else {
            return divisionMethod(key, this.size);
        }
    }

    // Insert key-value pair
    public insert(key: string | number, data: any): boolean | { success: boolean, updated: boolean } {
        // Проверка на переполнение
        if (this.isOverflowed()) {
            // Таблица уже переполнена
            return false;
        }
        
        const index = this.hash(key);
        const result = chainMethod.insert(this.table, index, key, data);
        
        if (result.success) {
            if (result.isNewElement) {
                this.elementsCount++;
                return { success: true, updated: false }; // Новый элемент
            } else {
                return { success: true, updated: true }; // Обновленный элемент
            }
        }
        
        return false;
    }

    // Search for a key
    public search(key: string | number): { found: boolean, data: any } {
        const index = this.hash(key);
        const result = chainMethod.search(this.table, index, key);
        
        return {
            found: result !== null,
            data: result
        };
    }
    
    // Получить внутреннюю структуру для визуализации цепочек
    public getChainEntries(searchKey: string | number | null = null): ChainEntry[] {
        return extractChainEntries(this.table, searchKey);
    }
    
    // Получить таблицу узлов (для доступа к ней напрямую)
    public getTable(): (Node | null)[] {
        return this.table;
    }
}