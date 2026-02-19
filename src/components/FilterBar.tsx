import type { FilterBarProps, MovieType } from '../types';
import { getYearOptions, getTypeLabel } from '../utils/helpers';

export const FilterBar = ({ filters, onFilterChange, onReset }: FilterBarProps) => {
  const types: MovieType[] = ['all', 'movie', 'series', 'episode'];
  const years = getYearOptions();

  const hasActiveFilters = filters.type !== 'all' || filters.year !== '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Type filter */}
        <div className="flex-1 min-w-50">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value as MovieType })}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 outline-none transition-colors"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'Tous' : getTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Year filter */}
        <div className="flex-1 min-w-50">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Année
          </label>
          <select
            value={filters.year}
            onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 outline-none transition-colors"
          >
            <option value="">Toutes</option>
            {years.slice(1, 30).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold transition-colors mt-7"
          >
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  );
};