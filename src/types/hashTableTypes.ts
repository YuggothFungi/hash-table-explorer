export type KeyType = 'number' | 'string';
export type HashMethod = 'division' | 'multiplication' | 'polynomial';
export type CollisionMethod = 'chain' | 'internalChain' | 'linear' | 'quadratic';

export interface HashTableParams {
    size: number;
    keyType: KeyType;
    hashMethod: HashMethod;
    collisionMethod: CollisionMethod;
    isLocked: boolean;
    tableRendered: boolean;
}

export interface HashTableControlsProps {
    params: HashTableParams;
    onParamsChange: (params: HashTableParams) => void;
    onLockChange: (isLocked: boolean) => void;
}

export interface HashTableEntry {
    index: number;
    key: string | number | null;
    hashValue: number | null;
    collisions: number;
    link: number | null;
}

export interface HashTableVisualizerProps {
    entries: HashTableEntry[];
    collisionMethod: CollisionMethod;
} 