import React, { useState, useEffect, useRef } from 'react';
import { HashTableControls } from './components/HashTableControls';
import { HashTableVisualizer } from './components/HashTableVisualizer';
import { Notification } from './components/Notification';
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
    const [notification, setNotification] = useState<{ 
        isVisible: boolean, 
        message: string, 
        type: 'success' | 'error' | 'info' | 'warning' 
    }>({
        isVisible: false,
        message: '',
        type: 'info'
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
            
            // Сбрасываем все уведомления при создании новой таблицы
            setNotification(prev => ({ ...prev, isVisible: false }));
        } else {
            setEntries([]);
            setChainEntries([]);
            setSearchResult(null);
            hashTableRef.current = null;
            
            // Сбрасываем все уведомления при удалении таблицы
            setNotification(prev => ({ ...prev, isVisible: false }));
        }
    }, [params.tableRendered, params.size, params.collisionMethod]);

    // Дополнительный эффект для сброса уведомлений при смене других параметров
    useEffect(() => {
        if (!params.isLocked) {
            // Сбрасываем уведомления при изменении типа ключа или метода хеширования
            setNotification(prev => ({ ...prev, isVisible: false }));
        }
    }, [params.keyType, params.hashMethod]);

    const handleAddKey = (key: string | number) => {
        if (key === '' || key === null) return;

        const hashValue = calculateHash(key, params.hashMethod, params.size);
        
        // Для метода внешних цепочек используем класс HashTable
        if (params.collisionMethod === 'chain' && hashTableRef.current) {
            const success = hashTableRef.current.insert(key, key);
            if (!success) {
                setNotification({
                    isVisible: true,
                    message: 'Ошибка при добавлении элемента в таблицу.',
                    type: 'error'
                });
                return;
            }
            
            // Обновляем записи в таблице
            const tableNodes = hashTableRef.current.getTable();
            const updatedEntries = [...entries];
            
            // Для каждого индекса с непустым узлом обновляем соответствующую запись в таблице
            tableNodes.forEach((node, idx) => {
                if (node !== null) {
                    // Подсчитываем количество коллизий (количество узлов после первого)
                    let collisionCount = 0;
                    let current = node.next;
                    while (current !== null) {
                        collisionCount++;
                        current = current.next;
                    }
                    
                    // Обновляем запись с ключом и хеш-значением
                    updatedEntries[idx] = {
                        ...updatedEntries[idx],
                        key: node.key,
                        hashValue: idx,
                        collisions: collisionCount
                    };
                }
            });
            
            setEntries(updatedEntries);
            
            // Обновляем цепочки
            setChainEntries(hashTableRef.current.getChainEntries());
            
            // Показываем уведомление об успешном добавлении
            setNotification({
                isVisible: true,
                message: `Ключ "${key}" успешно добавлен в таблицу.`,
                type: 'success'
            });
        } else {
            // Для других методов используем существующую логику
            const result = resolveCollision(entries, hashValue, key, hashValue, params.collisionMethod);
            
            if (result.overflow) {
                setNotification({
                    isVisible: true,
                    message: result.message || 'Таблица переполнена! Невозможно добавить новый элемент.',
                    type: 'error'
                });
            } else {
                setEntries(result.entries);
                
                // Показываем уведомление об успешном добавлении
                setNotification({
                    isVisible: true,
                    message: `Ключ "${key}" успешно добавлен в таблицу.`,
                    type: 'success'
                });
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
                setNotification({
                    isVisible: true,
                    message: `Ключ "${key}" не найден в таблице.`,
                    type: 'warning'
                });
                setSearchResult(null);
            } else {
                setSearchResult(hashValue);
                // Обновляем цепочки с подсветкой найденного ключа
                setChainEntries(hashTableRef.current.getChainEntries(key));
                
                // Показываем уведомление о найденном ключе
                setNotification({
                    isVisible: true,
                    message: `Ключ "${key}" найден в таблице по индексу ${hashValue}.`,
                    type: 'success'
                });
            }
        } else {
            // Для других методов используем функцию searchKey
            const result = searchKey(entries, key, params.hashMethod);
            if (!result.found) {
                setNotification({
                    isVisible: true,
                    message: result.message || `Ключ "${key}" не найден в таблице.`,
                    type: 'warning'
                });
                setSearchResult(null);
            } else {
                setSearchResult(result.index);
                
                // Показываем уведомление о найденном ключе
                setNotification({
                    isVisible: true,
                    message: `Ключ "${key}" найден в таблице по индексу ${result.index}.`,
                    type: 'success'
                });
            }
        }
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, isVisible: false }));
    };

    const handleParamsChange = (newParams: HashTableParams) => {
        if (params.isLocked && !newParams.isLocked) {
            setParams({ ...newParams, tableRendered: false });
            // Сбрасываем уведомления при пересоздании таблицы
            setNotification(prev => ({ ...prev, isVisible: false }));
        } else {
            setParams(newParams);
            // Если создается новая таблица, сбрасываем уведомления
            if (params.tableRendered !== newParams.tableRendered && newParams.tableRendered) {
                setNotification(prev => ({ ...prev, isVisible: false }));
            }
        }
    };

    const handleLockChange = (isLocked: boolean) => {
        if (params.isLocked && !isLocked) {
            setParams(prev => ({ ...prev, isLocked, tableRendered: false }));
            // Сбрасываем уведомления при разблокировке параметров
            setNotification(prev => ({ ...prev, isVisible: false }));
        } else {
            setParams(prev => ({ ...prev, isLocked }));
            // При блокировке параметров для новой таблицы сбрасываем уведомления
            if (!params.isLocked && isLocked && !params.tableRendered) {
                setNotification(prev => ({ ...prev, isVisible: false }));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 w-full max-w-5xl mx-auto">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                    <div className="w-full mx-auto">
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
            <Notification 
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={handleCloseNotification}
                type={notification.type}
            />
        </div>
    );
};

export default App;