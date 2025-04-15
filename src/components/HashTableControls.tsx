import React from 'react';
import { HashTableControlsProps, KeyType, HashMethod, CollisionMethod } from '../types/hashTableTypes';

export const HashTableControls: React.FC<HashTableControlsProps> = ({ 
    params, 
    onParamsChange, 
    onLockChange, 
    onAddKey,
    onFindKey
}) => {
    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const size = Math.min(Math.max(5, parseInt(e.target.value)), 20);
        onParamsChange({ ...params, size });
    };

    const handleKeyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onParamsChange({ ...params, keyType: e.target.value as KeyType });
    };

    const handleHashMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onParamsChange({ ...params, hashMethod: e.target.value as HashMethod });
    };

    const handleCollisionMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onParamsChange({ ...params, collisionMethod: e.target.value as CollisionMethod });
    };

    const handleRenderTable = () => {
        // Блокируем параметры и устанавливаем флаг tableRendered в true
        onParamsChange({ ...params, isLocked: true, tableRendered: true });
        onLockChange(true);
    };

    const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Преобразуем ввод в число, если тип ключа - число
        const newValue = params.keyType === 'number' 
            ? e.target.value === '' ? '' : Number(e.target.value) 
            : e.target.value;
        
        onParamsChange({ ...params, currentKey: newValue });
    };

    // Проверка валидности текущего ключа
    const isKeyValid = () => {
        if (params.currentKey === '' || params.currentKey === null) return false;
        
        if (params.keyType === 'number') {
            const numValue = Number(params.currentKey);
            return !isNaN(numValue) && numValue >= 0 && numValue <= 1023;
        } else {
            const strValue = String(params.currentKey);
            return strValue.length > 0 && strValue.length <= 50;
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-lg font-semibold mb-4">Параметры хеш-таблицы</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Размер таблицы (5-20)
                    </label>
                    <input
                        type="number"
                        min="5"
                        max="20"
                        value={params.size}
                        onChange={handleSizeChange}
                        disabled={params.isLocked}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Тип ключа
                    </label>
                    <select
                        value={params.keyType}
                        onChange={handleKeyTypeChange}
                        disabled={params.isLocked}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="number">Числовой (0-1023)</option>
                        <option value="string">Строковый (до 50 символов)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Метод хеширования
                    </label>
                    <select
                        value={params.hashMethod}
                        onChange={handleHashMethodChange}
                        disabled={params.isLocked}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="division">Метод деления</option>
                        <option value="multiplication">Метод умножения</option>
                        <option value="polynomial">Метод многочленов</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Метод разрешения коллизий
                    </label>
                    <select
                        value={params.collisionMethod}
                        onChange={handleCollisionMethodChange}
                        disabled={params.isLocked}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="chain">Внешние цепочки</option>
                        <option value="internalChain">Внутренние цепочки</option>
                        <option value="linear">Линейное опробование</option>
                        <option value="quadratic">Квадратичное опробование</option>
                    </select>
                </div>

                <div className="flex space-x-2 pt-2">
                    <button
                        onClick={() => onLockChange(!params.isLocked)}
                        className={`flex-1 py-2 px-4 rounded-md text-white ${
                            params.isLocked
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {params.isLocked ? 'Разблокировать параметры' : 'Заблокировать параметры'}
                    </button>
                    
                    {!params.tableRendered && !params.isLocked && (
                        <button
                            onClick={handleRenderTable}
                            className="flex-1 py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Создать таблицу
                        </button>
                    )}
                </div>
                
                {params.tableRendered && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {params.keyType === 'number' 
                                    ? 'Ключ (0-1023)' 
                                    : 'Ключ (до 50 символов)'}
                            </label>
                            <input
                                type={params.keyType === 'number' ? 'number' : 'text'}
                                value={params.currentKey}
                                onChange={handleKeyChange}
                                min={params.keyType === 'number' ? 0 : undefined}
                                max={params.keyType === 'number' ? 1023 : undefined}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                            <button
                                onClick={() => onAddKey(params.currentKey)}
                                className="flex-1 py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700"
                                disabled={!isKeyValid()}
                            >
                                Добавить
                            </button>
                            <button
                                onClick={() => onFindKey(params.currentKey)}
                                className="flex-1 py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                disabled={!isKeyValid()}
                            >
                                Найти
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}; 