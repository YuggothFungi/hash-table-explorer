import React from 'react';
import { HashTableVisualizerProps, HashTableEntry } from '../types/hashTableTypes';

export const HashTableVisualizer: React.FC<HashTableVisualizerProps> = ({ entries, collisionMethod }) => {
    const renderTableHeader = () => {
        const baseHeaders = [
            { key: 'index', label: 'Индекс' },
            { key: 'key', label: 'Значение ключа' },
            { key: 'hashValue', label: 'Значение хеш-функции' },
            { key: 'collisions', label: 'Количество коллизий' }
        ];

        if (collisionMethod === 'internalChain') {
            baseHeaders.push({ key: 'link', label: 'Ссылка' });
        }

        return (
            <thead className="bg-gray-50">
                <tr>
                    {baseHeaders.map(header => (
                        <th
                            key={header.key}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            {header.label}
                        </th>
                    ))}
                </tr>
            </thead>
        );
    };

    const renderTableRow = (entry: HashTableEntry) => {
        const baseCells = [
            { key: 'index', value: entry.index },
            { key: 'key', value: entry.key ?? '-' },
            { key: 'hashValue', value: entry.hashValue ?? '-' },
            { key: 'collisions', value: entry.collisions }
        ];

        if (collisionMethod === 'internalChain') {
            baseCells.push({ key: 'link', value: entry.link ?? '-' });
        }

        return (
            <tr key={entry.index} className="hover:bg-gray-50">
                {baseCells.map(cell => (
                    <td
                        key={cell.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                        {cell.value}
                    </td>
                ))}
            </tr>
        );
    };

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Визуализация хеш-таблицы</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    {renderTableHeader()}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {entries.map(renderTableRow)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}; 