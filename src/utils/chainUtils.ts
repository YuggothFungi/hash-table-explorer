import { Node } from '../lib/collision/collisionResolution';
import { ChainEntry, ChainNode } from '../types/hashTableTypes';

/**
 * Получение данных о цепочках из таблицы узлов
 * @param table Таблица узлов
 * @param searchKey Ключ, который нужно подсветить (для поиска)
 * @returns Массив цепочек для визуализации
 */
export const extractChainEntries = (
  table: (Node | null)[],
  searchKey: string | number | null = null
): ChainEntry[] => {
  return table
    .map((node, index) => {
      if (node === null) {
        return {
          index,
          nodes: [],
          isHighlighted: false
        };
      }

      const nodes: ChainNode[] = [];
      let current: Node | null = node;
      let hasHighlightedNode = false;

      // Проход по связному списку и извлечение данных узлов
      while (current) {
        const isHighlighted = current.key === searchKey;
        if (isHighlighted) {
          hasHighlightedNode = true;
        }

        nodes.push({
          key: current.key,
          isHighlighted
        });

        current = current.next;
      }

      return {
        index,
        nodes,
        isHighlighted: hasHighlightedNode
      };
    })
    .filter(chain => chain.nodes.length > 0); // Оставляем только непустые цепочки
}; 