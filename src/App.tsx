import React, { useState, useEffect } from 'react';
import { HashTableControls } from './components/HashTableControls';
import { HashTableVisualizer } from './components/HashTableVisualizer';
import { HashTableParams, HashTableEntry } from './types/hashTableTypes';
import { divisionMethod, multiplicationMethod, polynomialDivisionMethod } from './lib/hashing/hashFunctions';

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
    const [searchResult, setSearchResult] = useState<number | null>(null);

    useEffect(() => {
        // Если таблица отрендерена, инициализируем пустую таблицу
        if (params.tableRendered) {
            const initialEntries: HashTableEntry[] = Array.from({ length: params.size }, (_, index) => ({
                index,
                key: null,
                hashValue: null,
                collisions: 0,
                link: null
            }));
            setEntries(initialEntries);
            setSearchResult(null);
        } else {
            // Если таблица не отрендерена, очищаем массив записей
            setEntries([]);
            setSearchResult(null);
        }
    }, [params.tableRendered, params.size, params.collisionMethod]);

    // Функция для расчета хеш-значения на основе выбранного метода
    const calculateHash = (key: string | number): number => {
        const { hashMethod, size } = params;
        
        if (hashMethod === 'division') {
            return divisionMethod(key, size);
        } else if (hashMethod === 'multiplication') {
            return multiplicationMethod(key, size);
        } else {
            // polynomialDivisionMethod принимает только строки, поэтому преобразуем ключ
            return polynomialDivisionMethod(String(key), size);
        }
    };

    // Функция для разрешения коллизий при добавлении ключа
    const resolveCollision = (entries: HashTableEntry[], index: number, key: string | number, hashValue: number): HashTableEntry[] => {
        const { collisionMethod, size } = params;
        const newEntries = [...entries];
        
        // Внешние цепочки - ключи, имеющие одинаковый хеш, хранятся в связанном списке
        // В нашей модели мы просто помещаем их в один слот и увеличиваем счетчик коллизий
        if (collisionMethod === 'chain') {
            if (newEntries[index].key === null) {
                newEntries[index] = { ...newEntries[index], key, hashValue, collisions: 0 };
            } else {
                newEntries[index] = { ...newEntries[index], collisions: newEntries[index].collisions + 1 };
            }
        }
        // Внутренние цепочки - используем поле "link" для указания на следующую ячейку
        else if (collisionMethod === 'internalChain') {
            if (newEntries[index].key === null) {
                newEntries[index] = { ...newEntries[index], key, hashValue, collisions: 0 };
            } else {
                // Ищем свободную ячейку
                let freeIndex = (index + 1) % size;
                while (newEntries[freeIndex].key !== null && freeIndex !== index) {
                    freeIndex = (freeIndex + 1) % size;
                }
                
                if (freeIndex === index) {
                    alert('Таблица переполнена!');
                    return newEntries;
                }
                
                // Находим последний элемент в цепочке
                let currentIndex: number | null = index;
                while (currentIndex !== null && newEntries[currentIndex].link !== null) {
                    currentIndex = newEntries[currentIndex].link;
                }
                
                // Обновляем связь
                if (currentIndex !== null) {
                    newEntries[currentIndex] = { ...newEntries[currentIndex], link: freeIndex };
                }
                
                // Добавляем новый элемент
                newEntries[freeIndex] = { 
                    ...newEntries[freeIndex], 
                    key, 
                    hashValue, 
                    collisions: newEntries[index].collisions + 1 
                };
            }
        }
        // Линейное опробование - ищем следующую свободную ячейку с шагом 1
        else if (collisionMethod === 'linear') {
            if (newEntries[index].key === null) {
                newEntries[index] = { ...newEntries[index], key, hashValue, collisions: 0 };
            } else {
                let probeIndex = (index + 1) % size;
                let collisions = 1;
                
                while (newEntries[probeIndex].key !== null && probeIndex !== index) {
                    probeIndex = (probeIndex + 1) % size;
                    collisions++;
                }
                
                if (probeIndex === index) {
                    alert('Таблица переполнена!');
                    return newEntries;
                }
                
                newEntries[probeIndex] = { 
                    ...newEntries[probeIndex], 
                    key, 
                    hashValue, 
                    collisions 
                };
            }
        }
        // Квадратичное опробование - ищем следующую свободную ячейку с шагом i^2
        else if (collisionMethod === 'quadratic') {
            if (newEntries[index].key === null) {
                newEntries[index] = { ...newEntries[index], key, hashValue, collisions: 0 };
            } else {
                let i = 1;
                let collisions = 1;
                let probeIndex = (index + i * i) % size;
                
                while (newEntries[probeIndex].key !== null && i < size) {
                    i++;
                    probeIndex = (index + i * i) % size;
                    collisions++;
                }
                
                if (i >= size) {
                    alert('Таблица переполнена или не удалось найти свободную ячейку!');
                    return newEntries;
                }
                
                newEntries[probeIndex] = { 
                    ...newEntries[probeIndex], 
                    key, 
                    hashValue, 
                    collisions 
                };
            }
        }
        
        return newEntries;
    };

    // Обработчик добавления ключа
    const handleAddKey = (key: string | number) => {
        if (key === '' || key === null) return;
        
        const hashValue = calculateHash(key);
        const updatedEntries = resolveCollision(entries, hashValue, key, hashValue);
        setEntries(updatedEntries);
        setSearchResult(null);
    };

    // Обработчик поиска ключа
    const handleFindKey = (key: string | number) => {
        if (key === '' || key === null) return;
        
        const hashValue = calculateHash(key);
        const { collisionMethod, size } = params;
        
        // Ищем ключ в таблице в зависимости от метода разрешения коллизий
        let index = hashValue;
        let found = false;
        
        if (collisionMethod === 'chain') {
            if (entries[index].key === key) {
                found = true;
            }
        } else if (collisionMethod === 'internalChain') {
            let currentIndex: number | null = index;
            
            while (currentIndex !== null) {
                if (entries[currentIndex].key === key) {
                    found = true;
                    index = currentIndex;
                    break;
                }
                currentIndex = entries[currentIndex].link;
            }
        } else if (collisionMethod === 'linear') {
            let probeIndex = index;
            let probeCount = 0;
            
            while (probeCount < size) {
                if (entries[probeIndex].key === key) {
                    found = true;
                    index = probeIndex;
                    break;
                }
                
                probeIndex = (probeIndex + 1) % size;
                probeCount++;
            }
        } else if (collisionMethod === 'quadratic') {
            let i = 0;
            let probeIndex = (index + i * i) % size;
            
            while (i < size) {
                if (entries[probeIndex].key === key) {
                    found = true;
                    index = probeIndex;
                    break;
                }
                
                i++;
                probeIndex = (index + i * i) % size;
            }
        }
        
        if (found) {
            setSearchResult(index);
        } else {
            setSearchResult(null);
            alert(`Ключ "${key}" не найден в таблице!`);
        }
    };

    const handleParamsChange = (newParams: HashTableParams) => {
        // Если разблокировали параметры, сбрасываем флаг tableRendered
        if (params.isLocked && !newParams.isLocked) {
            setParams({ ...newParams, tableRendered: false });
        } else {
            setParams(newParams);
        }
    };

    const handleLockChange = (isLocked: boolean) => {
        // Если разблокировали параметры, сбрасываем флаг tableRendered
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
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App; 