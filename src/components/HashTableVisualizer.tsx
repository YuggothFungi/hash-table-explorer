import React from 'react';
import { HashTableVisualizerProps, HashTableEntry } from '../types/hashTableTypes';
import { ChainVisualizer } from './ChainVisualizer';
import { cn } from '../lib/utils';

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
            <thead className="bg-muted/50">
                <tr>
                    {baseHeaders.map(header => (
                        <th
                            key={header.key}
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
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
                className={cn(
                    "transition-colors duration-200",
                    isHighlighted ? "bg-yellow-100" : "hover:bg-accent/50",
                    isCellOccupied && "bg-opacity-80"
                )}
            >
                {baseCells.map(cell => (
                    <td
                        key={cell.key}
                        className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                        {cell.value}
                    </td>
                ))}
            </tr>
        );
    };

    return (
        <div className="mt-8 p-6 rounded-lg border border-border bg-card shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">Визуализация хеш-таблицы</h2>
            
            {/* Индикатор заполненности */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                        Заполненность таблицы: {occupancyPercentage}%
                    </span>
                    {isNearlyFull && !isFull && (
                        <span className="text-sm font-medium text-yellow-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                            </svg>
                            Внимание: таблица заполнена более чем на 75%
                        </span>
                    )}
                    {isFull && (
                        <span className="text-sm font-medium text-destructive flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                            </svg>
                            Внимание: таблица полностью заполнена
                        </span>
                    )}
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div 
                        className={cn(
                            "h-2.5 rounded-full transition-all duration-500 ease-in-out",
                            occupancyPercentage < 50 ? "bg-green-500" : 
                            occupancyPercentage < 75 ? "bg-yellow-500" : 
                            "bg-destructive"
                        )}
                        style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                </div>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:space-x-6">
                <div className={`w-full ${collisionMethod === 'chain' && chainEntries.length > 0 ? 'lg:w-7/12' : 'lg:w-full'}`}>
                    <div className="overflow-x-auto rounded-md border border-border">
                        <table className="min-w-full divide-y divide-border">
                            {renderTableHeader()}
                            <tbody className="bg-card divide-y divide-border">
                                {entries.map(renderTableRow)}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {collisionMethod === 'chain' && (
                    <div className="w-full lg:w-5/12 mt-6 lg:mt-0">
                        <ChainVisualizer chainEntries={chainEntries} />
                    </div>
                )}
            </div>
        </div>
    );
}; 