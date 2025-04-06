import React from 'react';
import { Filter as FilterIcon, Tag } from 'lucide-react';

interface FiltersProps {
  darkMode: boolean;
  activeFilter: string;
  categories: string[];
  tags: string[];
  onFilterByCategory: (category: string) => void;
  onFilterByTag: (tag: string) => void;
  onResetFilters: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  darkMode,
  activeFilter,
  categories,
  tags,
  onFilterByCategory,
  onFilterByTag,
  onResetFilters
}) => {
  return (
    <div className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FilterIcon size={18} className="mr-2" /> 
          Filters
        </h3>
        {activeFilter !== "all" && (
          <button 
            onClick={onResetFilters}
            className={`text-sm px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onResetFilters()}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${activeFilter === "all" 
            ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
            : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          }`}
        >
          All Posts
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onFilterByCategory(category)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${activeFilter === category 
              ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
              : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Tag size={14} className="mr-1" /> Popular Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 6).map(tag => (
            <button
              key={tag}
              onClick={() => onFilterByTag(tag)}
              className={`px-2 py-1 text-xs rounded-full ${activeFilter === tag
                ? `${darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`
                : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters; 