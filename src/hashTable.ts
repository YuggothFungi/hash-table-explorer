import { divisionMethod, polynomialDivisionMethod } from './hashFunctions';
import { Node, chainMethod } from './collisionResolution';

export class HashTable {
    private table: (Node | null)[];
    private size: number;

    constructor(size: number) {
        this.size = size;
        this.table = new Array(size).fill(null); // Initialize the table with null
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
    public insert(key: string | number, data: any): void {
        const index = this.hash(key);
        chainMethod.insert(this.table, index, key, data);
    }

    // Search for a key
    public search(key: string | number): any {
        const index = this.hash(key);
        return chainMethod.search(this.table, index, key);
    }
}