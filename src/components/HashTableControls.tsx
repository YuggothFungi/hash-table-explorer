import React from 'react';
import { HashTableControlsProps, KeyType, HashMethod, CollisionMethod } from '../types/hashTableTypes';
import { cn } from '../lib/utils';

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
        <div className="p-6 border rounded-lg shadow-sm bg-card">
            <h2 className="text-xl font-semibold mb-5 text-card-foreground">Параметры хеш-таблицы</h2>
            
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Размер таблицы (5-20)
                        </label>
                        <input
                            type="number"
                            min="5"
                            max="20"
                            value={params.size}
                            onChange={handleSizeChange}
                            disabled={params.isLocked}
                            className={cn(
                                "w-full rounded-md border px-3 py-2 text-sm",
                                "focus:outline-none focus:ring-2 focus:ring-primary",
                                params.isLocked ? "bg-muted cursor-not-allowed" : "bg-background"
                            )}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Тип ключа
                        </label>
                        <select
                            value={params.keyType}
                            onChange={handleKeyTypeChange}
                            disabled={params.isLocked}
                            className={cn(
                                "w-full rounded-md border px-3 py-2 text-sm",
                                "focus:outline-none focus:ring-2 focus:ring-primary",
                                params.isLocked ? "bg-muted cursor-not-allowed" : "bg-background"
                            )}
                        >
                            <option value="number">Числовой (0-1023)</option>
                            <option value="string">Строковый (до 50 символов)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Метод хеширования
                        </label>
                        <select
                            value={params.hashMethod}
                            onChange={handleHashMethodChange}
                            disabled={params.isLocked}
                            className={cn(
                                "w-full rounded-md border px-3 py-2 text-sm",
                                "focus:outline-none focus:ring-2 focus:ring-primary",
                                params.isLocked ? "bg-muted cursor-not-allowed" : "bg-background"
                            )}
                        >
                            <option value="division">Метод деления</option>
                            <option value="multiplication">Метод умножения</option>
                            <option value="polynomial">Метод многочленов</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Метод разрешения коллизий
                        </label>
                        <select
                            value={params.collisionMethod}
                            onChange={handleCollisionMethodChange}
                            disabled={params.isLocked}
                            className={cn(
                                "w-full rounded-md border px-3 py-2 text-sm",
                                "focus:outline-none focus:ring-2 focus:ring-primary",
                                params.isLocked ? "bg-muted cursor-not-allowed" : "bg-background"
                            )}
                        >
                            <option value="chain">Внешние цепочки</option>
                            <option value="internalChain">Внутренние цепочки</option>
                            <option value="linear">Линейное опробование</option>
                            <option value="quadratic">Квадратичное опробование</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        onClick={() => onLockChange(!params.isLocked)}
                        className={cn(
                            "py-2 px-4 rounded-md text-sm font-medium transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2",
                            params.isLocked 
                                ? "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500" 
                                : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
                            "flex-1"
                        )}
                    >
                        {params.isLocked ? 'Разблокировать параметры' : 'Заблокировать параметры'}
                    </button>
                    
                    {!params.tableRendered && !params.isLocked && (
                        <button
                            onClick={handleRenderTable}
                            className={cn(
                                "py-2 px-4 rounded-md text-sm font-medium transition-colors",
                                "bg-primary text-primary-foreground hover:bg-primary/90",
                                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                "flex-1"
                            )}
                        >
                            Создать таблицу
                        </button>
                    )}
                </div>
                
                {params.tableRendered && (
                    <div className="border-t border-border pt-4 mt-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
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
                                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => onAddKey(params.currentKey)}
                                className={cn(
                                    "py-2 px-4 rounded-md text-sm font-medium transition-colors",
                                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                                    "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
                                    "flex-1",
                                    !isKeyValid() && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={!isKeyValid()}
                            >
                                Добавить
                            </button>
                            <button
                                onClick={() => onFindKey(params.currentKey)}
                                className={cn(
                                    "py-2 px-4 rounded-md text-sm font-medium transition-colors",
                                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                                    "bg-primary text-primary-foreground hover:bg-primary/90",
                                    "focus:ring-primary",
                                    "flex-1",
                                    !isKeyValid() && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={!isKeyValid()}
                            >
                                Найти
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 