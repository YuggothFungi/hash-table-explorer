import { describe, it, expect } from 'vitest';
import { chainMethod } from '../collisionResolution';
import { divisionMethod, multiplicationMethod, polynomialDivisionMethod } from '../../hashing/hashFunctions';

// Константное значение размера хеш-таблицы для всех тестов
const DEFAULT_TABLE_SIZE = 7;

describe('Метод внешних цепочек (разрешение коллизий)', () => {
  
  describe('Метод деления', () => {
    // Тест 1: Вставка и поиск числовых ключей, дающих коллизию при методе деления
    it('должен корректно обрабатывать коллизии числовых ключей (метод деления)', () => {
      const keys = [7, 14, 21];
      const values = ['значение 7', 'значение 14', 'значение 21'];
      
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      const hashIndex = divisionMethod(keys[0], DEFAULT_TABLE_SIZE);
      keys.forEach((key, i) => {
        chainMethod.insert(table, hashIndex, key, values[i]);
      });
      
      keys.forEach((key, i) => {
        const result = chainMethod.search(table, hashIndex, key);
        expect(result).toBe(values[i]);
      });
      
      let node = table[hashIndex];
      expect(node?.key).toBe(keys[0]);
      expect(node?.data).toBe(values[0]);
      
      node = node?.next || null;
      expect(node?.key).toBe(keys[1]);
      expect(node?.data).toBe(values[1]);
      
      node = node?.next || null;
      expect(node?.key).toBe(keys[2]);
      expect(node?.data).toBe(values[2]);
    });

    it('должен добавлять ключ в новую строку, если хеш не совпадает', () => {
      const keys = [7, 8]; // 7 % 7 = 0, 8 % 7 = 1
      const values = ['значение 7', 'значение 8'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      // Вставляем первый ключ
      chainMethod.insert(table, divisionMethod(keys[0], DEFAULT_TABLE_SIZE), keys[0], values[0]);
      // Вставляем второй ключ, который должен попасть в новую строку
      chainMethod.insert(table, divisionMethod(keys[1], DEFAULT_TABLE_SIZE), keys[1], values[1]);
      
      expect(table[divisionMethod(keys[0], DEFAULT_TABLE_SIZE)]?.key).toBe(keys[0]);
      expect(table[divisionMethod(keys[1], DEFAULT_TABLE_SIZE)]?.key).toBe(keys[1]);
    });

    it('должен добавлять ключ в цепочку, если хеш совпадает', () => {
      const keys = [7, 14, 21]; // Все дают одинаковый хеш
      const values = ['значение 7', 'значение 14', 'значение 21'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, divisionMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      // Проверяем, что все значения доступны через цепочку
      let node = table[divisionMethod(keys[0], DEFAULT_TABLE_SIZE)];
      expect(node?.key).toBe(keys[0]);
      node = node?.next || null;
      expect(node?.key).toBe(keys[1]);
      node = node?.next || null;
      expect(node?.key).toBe(keys[2]);
    });

    it('должен искать ключ первого уровня', () => {
      const keys = [7, 14];
      const values = ['значение 7', 'значение 14'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, divisionMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      expect(chainMethod.search(table, divisionMethod(keys[0], DEFAULT_TABLE_SIZE), keys[0])).toBe(values[0]);
      expect(chainMethod.search(table, divisionMethod(keys[1], DEFAULT_TABLE_SIZE), keys[1])).toBe(values[1]);
    });

    it('должен искать ключ по цепочке из трех элементов', () => {
      const keys = [7, 14, 21]; // Все дают одинаковый хеш
      const values = ['значение 7', 'значение 14', 'значение 21'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, divisionMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      expect(chainMethod.search(table, divisionMethod(keys[0], DEFAULT_TABLE_SIZE), keys[0])).toBe(values[0]);
      expect(chainMethod.search(table, divisionMethod(keys[1], DEFAULT_TABLE_SIZE), keys[1])).toBe(values[1]);
      expect(chainMethod.search(table, divisionMethod(keys[2], DEFAULT_TABLE_SIZE), keys[2])).toBe(values[2]);
    });

    it('должен возвращать null при поиске отсутствующего ключа первого уровня', () => {
      const keys = [7, 14];
      const values = ['значение 7', 'значение 14'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, divisionMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      expect(chainMethod.search(table, divisionMethod(100, DEFAULT_TABLE_SIZE), 100)).toBeNull(); // Не существует
    });

    it('должен возвращать null при поиске отсутствующего ключа в цепочке', () => {
      const keys = [7, 14, 21]; // Все дают одинаковый хеш
      const values = ['значение 7', 'значение 14', 'значение 21'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, divisionMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      expect(chainMethod.search(table, divisionMethod(keys[0], DEFAULT_TABLE_SIZE), 100)).toBeNull(); // Не существует
    });
  });

  describe('Метод умножения', () => {
    // Тест 2: Вставка и поиск числовых ключей, дающих коллизию при методе умножения
    it('должен корректно обрабатывать коллизии числовых ключей (метод умножения)', () => {
      const keys = [10, 17, 24];
      const values = ['значение 10', 'значение 17', 'значение 24'];
      
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      const hashIndex = multiplicationMethod(keys[0], DEFAULT_TABLE_SIZE);
      keys.forEach((key, i) => {
        chainMethod.insert(table, hashIndex, key, values[i]);
      });
      
      keys.forEach((key, i) => {
        const result = chainMethod.search(table, hashIndex, key);
        expect(result).toBe(values[i]);
      });
      
      let node = table[hashIndex];
      expect(node?.key).toBe(keys[0]);
      expect(node?.data).toBe(values[0]);
      
      node = node?.next || null;
      expect(node?.key).toBe(keys[1]);
      expect(node?.data).toBe(values[1]);
      
      node = node?.next || null;
      expect(node?.key).toBe(keys[2]);
      expect(node?.data).toBe(values[2]);
    });

    it('должен добавлять ключ в новую строку, если хеш не совпадает', () => {
      const keys = [10, 11]; // 10 % 7 = 3, 11 % 7 = 4
      const values = ['значение 10', 'значение 11'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      chainMethod.insert(table, multiplicationMethod(keys[0], DEFAULT_TABLE_SIZE), keys[0], values[0]);
      chainMethod.insert(table, multiplicationMethod(keys[1], DEFAULT_TABLE_SIZE), keys[1], values[1]);
      
      expect(table[multiplicationMethod(keys[0], DEFAULT_TABLE_SIZE)]?.key).toBe(keys[0]);
      expect(table[multiplicationMethod(keys[1], DEFAULT_TABLE_SIZE)]?.key).toBe(keys[1]);
    });

    it('должен добавлять ключ в цепочку, если хеш совпадает', () => {
      const keys = [10, 17, 24]; // Пример ключей, которые могут дать одинаковый хеш
      const values = ['значение 10', 'значение 17', 'значение 24'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, multiplicationMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      let node = table[multiplicationMethod(keys[0], DEFAULT_TABLE_SIZE)];
      expect(node?.key).toBe(keys[0]);
      node = node?.next || null;
      expect(node?.key).toBe(keys[1]);
      node = node?.next || null;
      expect(node?.key).toBe(keys[2]);
    });

    it('должен искать ключ первого уровня', () => {
      const keys = [10, 11];
      const values = ['значение 10', 'значение 11'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, multiplicationMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      expect(chainMethod.search(table, multiplicationMethod(keys[0], DEFAULT_TABLE_SIZE), keys[0])).toBe(values[0]);
      expect(chainMethod.search(table, multiplicationMethod(keys[1], DEFAULT_TABLE_SIZE), keys[1])).toBe(values[1]);
    });

    it('должен искать ключ по цепочке из трех элементов', () => {
      const keys = [10, 17, 24]; // Пример ключей
      const values = ['значение 10', 'значение 17', 'значение 24'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, multiplicationMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      expect(chainMethod.search(table, multiplicationMethod(keys[0], DEFAULT_TABLE_SIZE), keys[0])).toBe(values[0]);
      expect(chainMethod.search(table, multiplicationMethod(keys[1], DEFAULT_TABLE_SIZE), keys[1])).toBe(values[1]);
      expect(chainMethod.search(table, multiplicationMethod(keys[2], DEFAULT_TABLE_SIZE), keys[2])).toBe(values[2]);
    });

    it('должен возвращать null при поиске отсутствующего ключа первого уровня', () => {
      const keys = [10, 11];
      const values = ['значение 10', 'значение 11'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, multiplicationMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      expect(chainMethod.search(table, multiplicationMethod(100, DEFAULT_TABLE_SIZE), 100)).toBeNull(); // Не существует
    });

    it('должен возвращать null при поиске отсутствующего ключа в цепочке', () => {
      const keys = [10, 11, 12]; // Пример ключей
      const values = ['значение 10', 'значение 11', 'значение 12'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, multiplicationMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      expect(chainMethod.search(table, multiplicationMethod(keys[0], DEFAULT_TABLE_SIZE), 100)).toBeNull(); // Не существует
    });
  });

  describe('Метод деления многочленов', () => {
    // Тест 3: Вставка и поиск строковых ключей, дающих коллизию при полиномиальном методе
    it('должен корректно обрабатывать коллизии строковых ключей (метод деления многочленов)', () => {
      const keys = ['Romeo', 'November', 'Delta'];
      const values = ['значение Romeo', 'значение November', 'значение Delta'];
      
      const hashIndex = polynomialDivisionMethod(keys[0], DEFAULT_TABLE_SIZE);
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, hashIndex, key, values[i]);
      });
      
      keys.forEach((key, i) => {
        const result = chainMethod.search(table, hashIndex, key);
        expect(result).toBe(values[i]);
      });
    });

    it('должен добавлять ключ в новую строку, если хеш не совпадает', () => {
      const keys = ['Alpha', 'Bravo']; // Пример ключей
      const values = ['значение Alpha', 'значение Bravo'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      chainMethod.insert(table, polynomialDivisionMethod(keys[0], DEFAULT_TABLE_SIZE), keys[0], values[0]);
      chainMethod.insert(table, polynomialDivisionMethod(keys[1], DEFAULT_TABLE_SIZE), keys[1], values[1]);
      
      expect(table[polynomialDivisionMethod(keys[0], DEFAULT_TABLE_SIZE)]?.key).toBe(keys[0]);
      expect(table[polynomialDivisionMethod(keys[1], DEFAULT_TABLE_SIZE)]?.key).toBe(keys[1]);
    });

    it('должен добавлять ключ в цепочку, если хеш совпадает', () => {
      const keys = ['Alpha', 'Bravo', 'Charlie']; // Пример ключей
      const values = ['значение Alpha', 'значение Bravo', 'значение Charlie'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, polynomialDivisionMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      let node = table[polynomialDivisionMethod(keys[0], DEFAULT_TABLE_SIZE)];
      expect(node?.key).toBe(keys[0]);
      node = node?.next || null;
      expect(node?.key).toBe(keys[1]);
      node = node?.next || null;
      expect(node?.key).toBe(keys[2]);
    });

    it('должен искать ключ первого уровня', () => {
      const keys = ['Alpha', 'Bravo'];
      const values = ['значение Alpha', 'значение Bravo'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, polynomialDivisionMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      expect(chainMethod.search(table, polynomialDivisionMethod(keys[0], DEFAULT_TABLE_SIZE), keys[0])).toBe(values[0]);
      expect(chainMethod.search(table, polynomialDivisionMethod(keys[1], DEFAULT_TABLE_SIZE), keys[1])).toBe(values[1]);
    });

    it('должен искать ключ по цепочке из трех элементов', () => {
      const keys = ['Alpha', 'Bravo', 'Charlie']; // Пример ключей
      const values = ['значение Alpha', 'значение Bravo', 'значение Charlie'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, polynomialDivisionMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      expect(chainMethod.search(table, polynomialDivisionMethod(keys[0], DEFAULT_TABLE_SIZE), keys[0])).toBe(values[0]);
      expect(chainMethod.search(table, polynomialDivisionMethod(keys[1], DEFAULT_TABLE_SIZE), keys[1])).toBe(values[1]);
      expect(chainMethod.search(table, polynomialDivisionMethod(keys[2], DEFAULT_TABLE_SIZE), keys[2])).toBe(values[2]);
    });

    it('должен возвращать null при поиске отсутствующего ключа первого уровня', () => {
      const keys = ['Alpha', 'Bravo'];
      const values = ['значение Alpha', 'значение Bravo'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, polynomialDivisionMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      expect(chainMethod.search(table, polynomialDivisionMethod('Nonexistent', DEFAULT_TABLE_SIZE), 'Nonexistent')).toBeNull(); // Не существует
    });

    it('должен возвращать null при поиске отсутствующего ключа в цепочке', () => {
      const keys = ['Alpha', 'Bravo', 'Charlie']; // Пример ключей
      const values = ['значение Alpha', 'значение Bravo', 'значение Charlie'];
      const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
      
      keys.forEach((key, i) => {
        chainMethod.insert(table, polynomialDivisionMethod(key, DEFAULT_TABLE_SIZE), key, values[i]);
      });
      
      expect(chainMethod.search(table, polynomialDivisionMethod(keys[0], DEFAULT_TABLE_SIZE), 'Nonexistent')).toBeNull(); // Не существует
    });
  });
});

describe('Метод внешних цепочек (разрешение коллизий) с методом умножения', () => {
  // Тест 1: Вставка и поиск строковых ключей, дающих коллизию при методе умножения
  it('должен корректно обрабатывать коллизии строковых ключей (метод умножения)', () => {
    // Строковые ключи, которые дадут коллизию при методе умножения
    const keys = ['Alpha', 'Bravo', 'Charlie']; // Пример ключей
    const values = ['значение Alpha', 'значение Bravo', 'значение Charlie'];
    
    // Вычисляем хеш-индекс для первого ключа
    const hashIndex = multiplicationMethod(keys[0], DEFAULT_TABLE_SIZE);
    
    // Создаем простой массив для хранения данных
    const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
    
    // Намеренно вставляем все ключи по одному индексу
    keys.forEach((key, i) => {
      chainMethod.insert(table, hashIndex, key, values[i]);
    });
    
    // Проверяем, что все значения доступны
    keys.forEach((key, i) => {
      const result = chainMethod.search(table, hashIndex, key);
      expect(result).toBe(values[i]);
    });
  });
});