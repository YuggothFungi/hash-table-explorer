import React from 'react';
import { ChainEntry } from '../types/hashTableTypes';

interface ChainVisualizerProps {
  chainEntries: ChainEntry[];
}

export const ChainVisualizer: React.FC<ChainVisualizerProps> = ({ chainEntries }) => {
  // Фильтруем только цепочки, у которых есть узлы
  const activeChains = chainEntries.filter(chain => chain.nodes.length > 0);

  if (activeChains.length === 0) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-4">Визуализация цепочек</h2>
        <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
          <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          <p>Нет активных цепочек.</p>
          <p className="text-sm mt-1">Добавьте элементы, создающие коллизии, в таблицу.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-4">Визуализация цепочек</h2>
      
      <div className="space-y-3">
        {activeChains.map((chain) => (
          <div 
            key={chain.index} 
            className={`p-3 border rounded-lg ${chain.isHighlighted ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Индекс: {chain.index}
              </h3>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {chain.nodes.length} {chain.nodes.length === 1 ? 'элемент' : 
                    chain.nodes.length < 5 ? 'элемента' : 'элементов'}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center">
              {chain.nodes.map((node, nodeIndex) => (
                <React.Fragment key={nodeIndex}>
                  <div 
                    className={`
                      flex items-center justify-center 
                      w-12 h-12 rounded-lg 
                      ${node.isHighlighted 
                        ? 'bg-yellow-200 border-2 border-yellow-500 shadow-sm' 
                        : 'bg-blue-100 border border-blue-300'
                      }
                      text-sm font-medium
                      transition-all duration-300
                    `}
                    title={String(node.key)}
                  >
                    {String(node.key).length > 5 
                      ? String(node.key).substring(0, 4) + '…' 
                      : node.key}
                  </div>
                  
                  {nodeIndex < chain.nodes.length - 1 && (
                    <div className="mx-1">
                      <svg 
                        className="text-gray-400" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 