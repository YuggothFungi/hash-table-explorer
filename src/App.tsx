import React, { useState, useEffect } from 'react';
import { HashTableControls } from './components/HashTableControls';
import { HashTableVisualizer } from './components/HashTableVisualizer';
import { HashTableParams, HashTableEntry } from './types/hashTableTypes';

const App: React.FC = () => {
    const [params, setParams] = useState<HashTableParams>({
        size: 7,
        keyType: 'number',
        hashMethod: 'division',
        collisionMethod: 'chain',
        isLocked: false,
        tableRendered: false
    });

    const [entries, setEntries] = useState<HashTableEntry[]>([]);

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
        } else {
            // Если таблица не отрендерена, очищаем массив записей
            setEntries([]);
        }
    }, [params.tableRendered, params.size, params.collisionMethod]);

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
                            />
                            {params.tableRendered && (
                                <HashTableVisualizer
                                    entries={entries}
                                    collisionMethod={params.collisionMethod}
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