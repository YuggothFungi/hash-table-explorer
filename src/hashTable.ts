import { divisionMethod, polynomialDivisionMethod } from './hashFunctions';

class Node {
    key: string | number;
    data: any;
    next: Node | null;

    constructor(key: string | number, data: any) {
        this.key = key;
        this.data = data;
        this.next = null;
    }
}

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
        const newNode = new Node(key, data);

        if (this.table[index] === null) {
            // If the position is empty, insert the new node
            this.table[index] = newNode;
        } else {
            // If the position is occupied, add to the linked list
            let current = this.table[index];
            while (current) {
                if (current.key === key) {
                    // If the key already exists, update the data
                    current.data = data;
                    return;
                }
                if (current.next === null) {
                    current.next = newNode; // Add new node at the end
                    return;
                }
                current = current.next;
            }
        }
    }

    // Search for a key
    public search(key: string | number): any {
        const index = this.hash(key);
        let current = this.table[index];

        while (current) {
            if (current.key === key) {
                return current.data; // Return the data if found
            }
            current = current.next; // Move to the next node
        }
        return null; // Key not found
    }
}