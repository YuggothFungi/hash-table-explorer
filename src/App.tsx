import React, { useState, useEffect } from 'react';
import { HashTableControls } from './components/HashTableControls';
import { HashTableVisualizer } from './components/HashTableVisualizer';
import { HashTableParams, HashTableEntry } from './types/hashTableTypes';
import { calculateHash, resolveCollision, searchKey } from './lib/collision/collisionResolution';

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
            setEntries([]);
            setSearchResult(null);
        }
    }, [params.tableRendered, params.size, params.collisionMethod]);

    const handleAddKey = (key: string | number) => {
        if (key === '' || key === null) return;

        const hashValue = calculateHash(key, params.hashMethod, params.size);
        const updatedEntries = resolveCollision(entries, hashValue, key, hashValue, params.collisionMethod);
        setEntries(updatedEntries);
        setSearchResult(null);
    };

    const handleFindKey = (key: string | number) => {
        const result = searchKey(entries, key, params.hashMethod);
        setSearchResult(result);
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