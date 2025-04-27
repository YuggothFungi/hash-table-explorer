import React from 'react';
import { HashTableVisualizerProps, HashTableEntry } from '../types/hashTableTypes';
import { ChainVisualizer } from './ChainVisualizer';

export const HashTableVisualizer: React.FC<HashTableVisualizerProps> = ({ 
    entries, 
    collisionMethod,
    searchResult,
    chainEntries = []
}) => {
    // Расчет заполненности таблицы
    const occupiedCells = entries.filter(entry => entry.key !== null).length;
    const totalCells = entries.length;
    const occupancyPercentage = Math.round((occupiedCells / totalCells) * 100);
    const isNearlyFull = occupancyPercentage >= 75;
    const isFull = occupancyPercentage === 100;

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
        const isHighlighted = searchResult !== null && entry.index === searchResult;
        const isCellOccupied = entry.key !== null;
        
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
            <tr 
                key={entry.index} 
                className={`
                    ${isHighlighted ? 'bg-yellow-100' : 'hover:bg-gray-50'}
                    ${isCellOccupied ? 'bg-opacity-80' : ''}
                `}
            >
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
            
            {/* Индикатор заполненности */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                        Заполненность таблицы: {occupancyPercentage}%
                    </span>
                    {isNearlyFull && !isFull && (
                        <span className="text-sm font-medium text-orange-500">
                            Внимание: таблица заполнена более чем на 75%
                        </span>
                    )}
                    {isFull && (
                        <span className="text-sm font-medium text-red-500">
                            Внимание: таблица полностью заполнена
                        </span>
                    )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className={`h-2.5 rounded-full ${
                            occupancyPercentage < 50 ? 'bg-green-600' : 
                            occupancyPercentage < 75 ? 'bg-yellow-400' : 
                            'bg-red-600'
                        }`}
                        style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                </div>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:space-x-4">
                <div className={`w-full ${collisionMethod === 'chain' && chainEntries.length > 0 ? 'lg:w-7/12' : 'lg:w-full'}`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            {renderTableHeader()}
                            <tbody className="bg-white divide-y divide-gray-200">
                                {entries.map(renderTableRow)}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {collisionMethod === 'chain' && (
                    <div className="w-full lg:w-5/12 mt-4 lg:mt-0">
                        <ChainVisualizer chainEntries={chainEntries} />
                    </div>
                )}
            </div>
        </div>
    );
}; 