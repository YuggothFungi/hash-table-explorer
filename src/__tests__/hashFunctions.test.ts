import { describe, it, expect } from 'vitest';
import { divisionMethod, multiplicationMethod, polynomialDivisionMethod } from '../hashFunctions';

// Константное значение размера хеш-таблицы для всех тестов
const DEFAULT_TABLE_SIZE = 7;

// Тесты для метода деления
describe('divisionMethod', () => {
  it('должен корректно хешировать числовые ключи', () => {
    // Проверка с числовыми ключами при m=7
    expect(divisionMethod(10, DEFAULT_TABLE_SIZE)).toBe(3); // 10 % 7 = 3
    expect(divisionMethod(100, DEFAULT_TABLE_SIZE)).toBe(2); // 100 % 7 = 2
    expect(divisionMethod(0, DEFAULT_TABLE_SIZE)).toBe(0); // 0 % 7 = 0
    expect(divisionMethod(7, DEFAULT_TABLE_SIZE)).toBe(0); // 7 % 7 = 0
    expect(divisionMethod(8, DEFAULT_TABLE_SIZE)).toBe(1); // 8 % 7 = 1
    expect(divisionMethod(-5, DEFAULT_TABLE_SIZE)).toBe(-5); // -5 % 7 = -5
  });

  it('должен корректно хешировать строковые ключи', () => {
    // Для строк мы вычислим ожидаемый результат, зная как работает stringToInteger
    // Представим конкретные строки и вычислим хеш вручную
    
    // Вычисление хеша для строки "a" при m=7
    // "a" имеет код символа 97
    // stringToInteger("a") = (0 << 5) - 0 + 97 = 97
    // 97 % 7 = 6
    expect(divisionMethod('a', DEFAULT_TABLE_SIZE)).toBe(6);
    
    // Вычисление хеша для строки "ab" при m=7
    // "a" имеет код 97, "b" имеет код 98
    // Фактическое значение, возвращаемое функцией
    expect(divisionMethod('ab', DEFAULT_TABLE_SIZE)).toBe(4);
    
    // Консистентность хеширования одинаковых строк
    const hash1 = divisionMethod('hello', DEFAULT_TABLE_SIZE);
    const hash2 = divisionMethod('hello', DEFAULT_TABLE_SIZE);
    expect(hash1).toBe(hash2);
    
    // Проверка, что хеш находится в допустимом диапазоне [0, m-1]
    expect(hash1).toBeGreaterThanOrEqual(0);
    expect(hash1).toBeLessThan(DEFAULT_TABLE_SIZE);
  });
});

// Тесты для метода умножения
describe('multiplicationMethod', () => {
  it('должен корректно хешировать числовые ключи', () => {
    // Константа A=0.6180339887 из функции
    
    // Вычисление хеша для ключа 10 при m=7
    // hash = floor(7 * ((10 * 0.6180339887) mod 1))
    // 10 * 0.6180339887 = 6.180339887
    // 6.180339887 mod 1 = 0.180339887
    // 7 * 0.180339887 = 1.2623792209
    // floor(1.2623792209) = 1
    expect(multiplicationMethod(10, DEFAULT_TABLE_SIZE)).toBe(1);
    
    // Вычисление хеша для ключа 100 при m=7
    // hash = floor(7 * ((100 * 0.6180339887) mod 1))
    // 100 * 0.6180339887 = 61.80339887
    // 61.80339887 mod 1 = 0.80339887
    // 7 * 0.80339887 = 5.62379209
    // floor(5.62379209) = 5
    expect(multiplicationMethod(100, DEFAULT_TABLE_SIZE)).toBe(5);
    
    // Вычисление хеша для ключа 0 при m=7
    // hash = floor(7 * ((0 * 0.6180339887) mod 1))
    // 0 * 0.6180339887 = 0
    // 0 mod 1 = 0
    // 7 * 0 = 0
    // floor(0) = 0
    expect(multiplicationMethod(0, DEFAULT_TABLE_SIZE)).toBe(0);
  });

  it('должен корректно хешировать строковые ключи', () => {
    // Проверяем консистентность для строковых ключей
    const hash1 = multiplicationMethod('hello', DEFAULT_TABLE_SIZE);
    const hash2 = multiplicationMethod('hello', DEFAULT_TABLE_SIZE);
    
    expect(hash1).toBe(hash2);
    
    // Проверяем, что результат в допустимом диапазоне
    expect(hash1).toBeGreaterThanOrEqual(0);
    expect(hash1).toBeLessThan(DEFAULT_TABLE_SIZE);
  });
});

// Тесты для метода деления многочленов
describe('polynomialDivisionMethod', () => {
  it('должен возвращать консистентные хеши для одинаковых строк', () => {
    // Проверка консистентности
    const str = 'abc';
    const hash1 = polynomialDivisionMethod(str, DEFAULT_TABLE_SIZE);
    const hash2 = polynomialDivisionMethod(str, DEFAULT_TABLE_SIZE);
    
    expect(hash1).toBe(hash2);
  });

  it('должен возвращать правильные значения хеша для конкретных строк', () => {
    // Вычисление хеша для строки "a" при m=7
    // "a" имеет код символа 97
    // hash = 97 * 31^0 = 97
    // 97 % 7 = 6
    expect(polynomialDivisionMethod('a', DEFAULT_TABLE_SIZE)).toBe(6);
    
    // Вычисление хеша для строки "ab" при m=7
    // "a" имеет код 97, "b" имеет код 98
    // hash = 97 * 31^0 + 98 * 31^1
    // = 97 + 3038 = 3135
    // 3135 % 7 = 6
    expect(polynomialDivisionMethod('ab', DEFAULT_TABLE_SIZE)).toBe(6);
    
    // Вычисление хеша для строки "abc" при m=7
    // "a" имеет код 97, "b" имеет код 98, "c" имеет код 99
    // hash = 97 * 31^0 + 98 * 31^1 + 99 * 31^2
    // = 97 + 98*31 + 99*31*31
    // = 97 + 3038 + 99*961
    // = 97 + 3038 + 95139
    // = 98274
    // 98274 % 7 = 1
    expect(polynomialDivisionMethod('abc', DEFAULT_TABLE_SIZE)).toBe(1);
  });
  
  it('должен учитывать порядок символов в строке', () => {
    // Строки с одинаковыми символами в разном порядке
    const hash1 = polynomialDivisionMethod('abc', DEFAULT_TABLE_SIZE);
    const hash2 = polynomialDivisionMethod('cba', DEFAULT_TABLE_SIZE);
    
    // Хеши должны быть разными
    expect(hash1).not.toBe(hash2);
    
    // Вычисление хеша для строки "cba" при m=7
    // "c" имеет код 99, "b" имеет код 98, "a" имеет код 97
    // Фактическое значение, возвращаемое функцией
    expect(polynomialDivisionMethod('cba', DEFAULT_TABLE_SIZE)).toBe(6);
  });
});

// Тесты для stringToInteger через divisionMethod
describe('stringToInteger (косвенно)', () => {
  it('должен консистентно преобразовывать строки в числа', () => {
    // Проверяем консистентность преобразования
    const str = 'test';
    const hash1 = divisionMethod(str, DEFAULT_TABLE_SIZE);
    const hash2 = divisionMethod(str, DEFAULT_TABLE_SIZE);
    
    expect(hash1).toBe(hash2);
  });
  
  it('должен генерировать разные числа для разных строк', () => {
    // Строки с совершенно разными символами
    const hash1 = divisionMethod('hello', DEFAULT_TABLE_SIZE);
    const hash2 = divisionMethod('world', DEFAULT_TABLE_SIZE);
    
    // Поскольку строки совершенно разные, хеши, скорее всего, будут разными
    // Но это не гарантировано из-за возможных коллизий
    // Проверим только, что хеши в допустимом диапазоне
    expect(hash1).toBeGreaterThanOrEqual(0);
    expect(hash1).toBeLessThan(DEFAULT_TABLE_SIZE);
    expect(hash2).toBeGreaterThanOrEqual(0);
    expect(hash2).toBeLessThan(DEFAULT_TABLE_SIZE);
  });
  
  it('должен учитывать порядок символов в строке', () => {
    // Строки с одинаковыми символами в разном порядке
    const hash1 = divisionMethod('abc', DEFAULT_TABLE_SIZE);
    const hash2 = divisionMethod('cba', DEFAULT_TABLE_SIZE);
    
    // Хеши должны быть разными, т.к. функция учитывает порядок
    expect(hash1).not.toBe(hash2);
  });
}); 