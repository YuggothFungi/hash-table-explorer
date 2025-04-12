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