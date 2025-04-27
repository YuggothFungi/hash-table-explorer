import React, { useState, useEffect, useRef } from 'react';
import { HashTableControls } from './components/HashTableControls';
import { HashTableVisualizer } from './components/HashTableVisualizer';
import { ErrorNotification } from './components/ErrorNotification';
import { HashTableParams, HashTableEntry, ChainEntry } from './types/hashTableTypes';
import { calculateHash, resolveCollision, searchKey } from './lib/collision/collisionResolution';
import { HashTable } from './lib/hashTable';

const App: React.FC = () => {
    const [params, setParams] = useState<HashTableParams>({
        size: 7,
        keyType: 'number',
        hashMethod: 'division',
        collisionMethod: 'chain',
        isLocked: false,
        tableRendered: false,
        currentKey: ''
    });

    const [entries, setEntries] = useState<HashTableEntry[]>([]);
    const [chainEntries, setChainEntries] = useState<ChainEntry[]>([]);
    const [searchResult, setSearchResult] = useState<number | null>(null);
    const [error, setError] = useState<{ isVisible: boolean, message: string }>({
        isVisible: false,
        message: ''
    });
    
    // Используем useRef для хранения экземпляра HashTable
    const hashTableRef = useRef<HashTable | null>(null);

    useEffect(() => {
        if (params.tableRendered) {
            // Создаем экземпляр HashTable
            hashTableRef.current = new HashTable(params.size);
            
            const initialEntries: HashTableEntry[] = Array.from({ length: params.size }, (_, index) => ({
                index,
                key: null,
                hashValue: null,
                collisions: 0,
                link: null
            }));
            setEntries(initialEntries);
            setChainEntries([]);
            setSearchResult(null);
        } else {
            setEntries([]);
            setChainEntries([]);
            setSearchResult(null);
            hashTableRef.current = null;
        }
    }, [params.tableRendered, params.size, params.collisionMethod]);

    const handleAddKey = (key: string | number) => {
        if (key === '' || key === null) return;

        const hashValue = calculateHash(key, params.hashMethod, params.size);
        
        // Для метода внешних цепочек используем класс HashTable
        if (params.collisionMethod === 'chain' && hashTableRef.current) {
            const success = hashTableRef.current.insert(key, key);
            if (!success) {
                setError({
                    isVisible: true,
                    message: 'Ошибка при добавлении элемента в таблицу.'
                });
                return;
            }
            
            // Обновляем записи в таблице
            const updatedEntries = [...entries];
            const entryIndex = hashValue;
            updatedEntries[entryIndex] = {
                ...updatedEntries[entryIndex],
                key: updatedEntries[entryIndex].key === null ? key : updatedEntries[entryIndex].key,
                hashValue,
                collisions: updatedEntries[entryIndex].collisions + (updatedEntries[entryIndex].key !== null ? 1 : 0)
            };
            
            setEntries(updatedEntries);
            
            // Обновляем цепочки
            if (hashTableRef.current) {
                setChainEntries(hashTableRef.current.getChainEntries());
            }
        } else {
            // Для других методов используем существующую логику
            const result = resolveCollision(entries, hashValue, key, hashValue, params.collisionMethod);
            
            if (result.overflow) {
                setError({
                    isVisible: true,
                    message: result.message || 'Таблица переполнена! Невозможно добавить новый элемент.'
                });
            } else {
                setEntries(result.entries);
            }
        }
        
        setSearchResult(null);
    };

    const handleFindKey = (key: string | number) => {
        // Для метода внешних цепочек используем класс HashTable
        if (params.collisionMethod === 'chain' && hashTableRef.current) {
            const hashValue = calculateHash(key, params.hashMethod, params.size);
            const result = hashTableRef.current.search(key);
            
            if (!result.found) {
                setError({
                    isVisible: true,
                    message: 'Ключ не найден в таблице.'
                });
                setSearchResult(null);
            } else {
                setSearchResult(hashValue);
                // Обновляем цепочки с подсветкой найденного ключа
                setChainEntries(hashTableRef.current.getChainEntries(key));
            }
        } else {
            // Для других методов используем существующую логику
            const result = searchKey(entries, key, params.hashMethod);
            if (!result.found) {
                setError({
                    isVisible: true,
                    message: result.message || 'Ключ не найден в таблице.'
                });
                setSearchResult(null);
            } else {
                setSearchResult(result.index);
            }
        }
    };

    const handleCloseError = () => {
        setError({ isVisible: false, message: '' });
    };

    const handleParamsChange = (newParams: HashTableParams) => {
        if (params.isLocked && !newParams.isLocked) {
            setParams({ ...newParams, tableRendered: false });
        } else {
            setParams(newParams);
        }
    };

    const handleLockChange = (isLocked: boolean) => {
        if (params.isLocked && !isLocked) {
            setParams(prev => ({ ...prev, isLocked, tableRendered: false }));
        } else {
            setParams(prev => ({ ...prev, isLocked }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                    <div className="max-w-md mx-auto">
                        <div className="divide-y divide-gray-200">
                            <HashTableControls
                                params={params}
                                onParamsChange={handleParamsChange}
                                onLockChange={handleLockChange}
                                onAddKey={handleAddKey}
                                onFindKey={handleFindKey}
                            />
                            {params.tableRendered && (
                                <HashTableVisualizer
                                    entries={entries}
                                    collisionMethod={params.collisionMethod}
                                    searchResult={searchResult}
                                    chainEntries={chainEntries}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ErrorNotification 
                message={error.message}
                isVisible={error.isVisible}
                onClose={handleCloseError}
            />
        </div>
    );
};

export default App;