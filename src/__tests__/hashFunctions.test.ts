import { describe, it, expect } from 'vitest';
import { divisionMethod } from '../hashFunctions';

// Тесты для метода деления
describe('divisionMethod', () => {
  it('должен корректно хешировать числовые ключи', () => {
    // Проверка с числовыми ключами
    expect(divisionMethod(10, 7)).toBe(3); // 10 % 7 = 3
    expect(divisionMethod(100, 13)).toBe(9); // 100 % 13 = 9
    expect(divisionMethod(0, 5)).toBe(0); // 0 % 5 = 0
    expect(divisionMethod(-5, 3)).toBe(-2); // -5 % 3 = -2
  });

  it('должен корректно хешировать строковые ключи', () => {
    // Для строк мы не можем точно предсказать результат из-за stringToInteger
    // Но можем проверить консистентность
    const m = 11;
    const hash1 = divisionMethod('hello', m);
    const hash2 = divisionMethod('hello', m);
    
    // Один и тот же ключ должен давать одинаковый хеш при одинаковом размере таблицы
    expect(hash1).toBe(hash2);
    
    // Разные ключи могут давать разные хеши
    const hash3 = divisionMethod('world', m);
    // Мы не можем гарантировать, что хеши будут разными, но можем проверить,
    // что функция возвращает число в допустимом диапазоне [0, m-1] для положительных m
    expect(hash3).toBeGreaterThanOrEqual(0);
    expect(hash3).toBeLessThan(m);
  });

  it('должен возвращать значение в пределах размера таблицы для положительных m', () => {
    const m = 10;
    // Генерируем случайные числа для тестирования
    for (let i = 0; i < 20; i++) {
      const randomKey = Math.floor(Math.random() * 1000);
      const hash = divisionMethod(randomKey, m);
      expect(hash).toBeGreaterThanOrEqual(0);
      expect(hash).toBeLessThan(m);
    }
  });
}); 