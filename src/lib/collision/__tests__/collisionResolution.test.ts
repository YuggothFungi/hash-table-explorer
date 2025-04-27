import { describe, it, expect } from 'vitest';
import { chainMethod, resolveQuadraticCollision, resolveCollision } from '../collisionResolution';
import { divisionMethod, multiplicationMethod, polynomialDivisionMethod } from '../../hashing/hashFunctions';
import { HashTableEntry } from '../../../types/hashTableTypes';

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

describe('Метод квадратичного опробования', () => {
  const createEmptyEntries = (size: number): HashTableEntry[] => {
    return Array(size).fill(null).map((_, index) => ({
      index,
      key: null,
      hashValue: null,
      collisions: 0,
      link: null
    }));
  };
  
  it('должен добавлять элемент в свободную ячейку при исходном индексе', () => {
    const size = 10;
    const entries = createEmptyEntries(size);
    const index = 3;
    const key = 123;
    const hashValue = index;
    
    const result = resolveQuadraticCollision(entries, index, key, hashValue, size);
    
    expect(result.overflow).toBe(false);
    expect(result.entries[index].key).toBe(key);
    expect(result.entries[index].hashValue).toBe(hashValue);
    expect(result.entries[index].collisions).toBe(0);
  });
  
  it('должен разрешать коллизию с помощью квадратичного опробования', () => {
    const size = 10;
    const entries = createEmptyEntries(size);
    const index = 3;
    
    // Занимаем исходную ячейку
    entries[index] = { ...entries[index], key: 100, hashValue: index, collisions: 0, link: null };
    
    const newKey = 123;
    const hashValue = index;
    
    const result = resolveQuadraticCollision(entries, index, newKey, hashValue, size);
    
    // Проверяем, что новый элемент добавлен с использованием квадратичного опробования
    // Должен быть помещен в ячейку с индексом (3 + 1²) % 10 = 4
    expect(result.overflow).toBe(false);
    expect(result.entries[4].key).toBe(newKey);
    expect(result.entries[4].hashValue).toBe(hashValue);
    expect(result.entries[4].collisions).toBe(1);
  });
  
  it('должен разрешать множественные коллизии с квадратичным опробованием', () => {
    const size = 10;
    const entries = createEmptyEntries(size);
    const index = 3;
    
    // Занимаем исходную ячейку и ячейку первого опробования
    entries[index] = { ...entries[index], key: 100, hashValue: index, collisions: 0, link: null };
    entries[(index + 1) % size] = { ...entries[(index + 1) % size], key: 101, hashValue: index, collisions: 1, link: null };
    
    const newKey = 123;
    const hashValue = index;
    
    const result = resolveQuadraticCollision(entries, index, newKey, hashValue, size);
    
    // Должен быть помещен в ячейку с индексом (3 + 2²) % 10 = 7
    expect(result.overflow).toBe(false);
    expect(result.entries[7].key).toBe(newKey);
    expect(result.entries[7].hashValue).toBe(hashValue);
    expect(result.entries[7].collisions).toBe(2);
  });
  
  it('должен ограничивать количество проб и сообщать о переполнении', () => {
    const size = 10;
    const entries = createEmptyEntries(size);
    const index = 3;
    const MAX_PROBES = Math.ceil(size / 2); // 5 для таблицы размером 10
    
    // Занимаем все ячейки, которые могут быть использованы при квадратичном опробовании
    entries[index] = { ...entries[index], key: 100, hashValue: index, collisions: 0, link: null };
    for (let i = 1; i <= MAX_PROBES; i++) {
      const probeIndex = (index + i * i) % size;
      entries[probeIndex] = { 
        ...entries[probeIndex], 
        key: 100 + i, 
        hashValue: index, 
        collisions: i, 
        link: null 
      };
    }
    
    const newKey = 123;
    const hashValue = index;
    
    const result = resolveQuadraticCollision(entries, index, newKey, hashValue, size);
    
    // Должно сообщить о переполнении, так как все возможные ячейки заняты
    expect(result.overflow).toBe(true);
    expect(result.message).toContain('Превышено максимальное число проб');
  });
  
  it('должен корректно обрабатывать выход индекса за пределы таблицы', () => {
    const size = 10;
    const entries = createEmptyEntries(size);
    const index = 8; // Выбираем индекс ближе к концу таблицы
    
    // Занимаем исходную ячейку
    entries[index] = { ...entries[index], key: 100, hashValue: index, collisions: 0, link: null };
    
    const newKey = 123;
    const hashValue = index;
    
    const result = resolveQuadraticCollision(entries, index, newKey, hashValue, size);
    
    // (8 + 1²) % 10 = 9, но если бы не было операции по модулю, было бы 9
    expect(result.overflow).toBe(false);
    expect(result.entries[9].key).toBe(newKey);
    
    // Теперь проверим случай, когда индекс выходит за пределы
    const entries2 = createEmptyEntries(size);
    entries2[index] = { ...entries2[index], key: 100, hashValue: index, collisions: 0, link: null };
    entries2[9] = { ...entries2[9], key: 101, hashValue: index, collisions: 1, link: null };
    
    const result2 = resolveQuadraticCollision(entries2, index, newKey, hashValue, size);
    
    // (8 + 2²) % 10 = 12 % 10 = 2
    expect(result2.overflow).toBe(false);
    expect(result2.entries[2].key).toBe(newKey);
  });
});

describe('Проверка предотвращения дублирования ключей', () => {
  const createEmptyEntries = (size: number): HashTableEntry[] => {
    return Array(size).fill(null).map((_, index) => ({
      index,
      key: null,
      hashValue: null,
      collisions: 0,
      link: null
    }));
  };
  
  it('не должен добавлять дублирующийся ключ при использовании внутренних цепочек', () => {
    const size = 10;
    const entries = createEmptyEntries(size);
    const key = 123;
    const hashValue = 3;
    
    // Добавляем ключ в первый раз
    const firstResult = resolveCollision(entries, hashValue, key, hashValue, 'internalChain');
    expect(firstResult.overflow).toBe(false);
    
    // Пытаемся добавить тот же ключ повторно
    const secondResult = resolveCollision(firstResult.entries, hashValue, key, hashValue, 'internalChain');
    expect(secondResult.overflow).toBe(false);
    expect(secondResult.message).toContain('уже существует');
    
    // Проверяем, что ключ присутствует в таблице ровно один раз
    let keyCount = 0;
    secondResult.entries.forEach((entry: HashTableEntry) => {
      if (entry.key === key) keyCount++;
    });
    expect(keyCount).toBe(1);
  });
  
  it('не должен добавлять дублирующийся ключ при использовании линейного опробования', () => {
    const size = 10;
    const entries = createEmptyEntries(size);
    const key = 123;
    const hashValue = 3;
    
    // Добавляем ключ в первый раз
    const firstResult = resolveCollision(entries, hashValue, key, hashValue, 'linear');
    expect(firstResult.overflow).toBe(false);
    
    // Пытаемся добавить тот же ключ повторно
    const secondResult = resolveCollision(firstResult.entries, hashValue, key, hashValue, 'linear');
    expect(secondResult.overflow).toBe(false);
    expect(secondResult.message).toContain('уже существует');
    
    // Проверяем, что ключ присутствует в таблице ровно один раз
    let keyCount = 0;
    secondResult.entries.forEach((entry: HashTableEntry) => {
      if (entry.key === key) keyCount++;
    });
    expect(keyCount).toBe(1);
  });
  
  it('не должен добавлять дублирующийся ключ при использовании квадратичного опробования', () => {
    const size = 10;
    const entries = createEmptyEntries(size);
    const key = 123;
    const hashValue = 3;
    
    // Добавляем ключ в первый раз
    const firstResult = resolveCollision(entries, hashValue, key, hashValue, 'quadratic');
    expect(firstResult.overflow).toBe(false);
    
    // Пытаемся добавить тот же ключ повторно
    const secondResult = resolveCollision(firstResult.entries, hashValue, key, hashValue, 'quadratic');
    expect(secondResult.overflow).toBe(false);
    expect(secondResult.message).toContain('уже существует');
    
    // Проверяем, что ключ присутствует в таблице ровно один раз
    let keyCount = 0;
    secondResult.entries.forEach((entry: HashTableEntry) => {
      if (entry.key === key) keyCount++;
    });
    expect(keyCount).toBe(1);
  });

  it('должен обновлять данные при добавлении существующего ключа в метод цепочек', () => {
    const table = new Array(DEFAULT_TABLE_SIZE).fill(null);
    const key = 7;
    const firstValue = 'первое значение';
    const updatedValue = 'обновленное значение';
    const hashIndex = divisionMethod(key, DEFAULT_TABLE_SIZE);
    
    // Добавляем ключ в первый раз
    const firstResult = chainMethod.insert(table, hashIndex, key, firstValue);
    expect(firstResult.success).toBe(true);
    expect(firstResult.isNewElement).toBe(true);
    
    // Проверяем значение
    let value = chainMethod.search(table, hashIndex, key);
    expect(value).toBe(firstValue);
    
    // Обновляем ключ
    const updateResult = chainMethod.insert(table, hashIndex, key, updatedValue);
    expect(updateResult.success).toBe(true);
    expect(updateResult.isNewElement).toBe(false);
    
    // Проверяем, что значение обновилось
    value = chainMethod.search(table, hashIndex, key);
    expect(value).toBe(updatedValue);
    
    // Проверяем, что нет дублирующегося ключа в цепочке
    const node = table[hashIndex];
    expect(node?.key).toBe(key);
    expect(node?.data).toBe(updatedValue);
    expect(node?.next).toBe(null); // Не должно быть следующего элемента
  });
});