interface MovieFiltersProps {
  year?: number;
  voteAverage?: number;
  onYearChange: (year: number | undefined) => void;
  onVoteAverageChange: (voteAverage: number | undefined) => void;
  onClearFilters: () => void;
}

export const MovieFilters = ({
  year,
  voteAverage,
  onYearChange,
  onVoteAverageChange,
  onClearFilters,
}: MovieFiltersProps) => {
  const currentYear = new Date().getFullYear();
  const startYear = 1950;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Año
          </label>
          <select
            id="year-filter"
            value={year || ''}
            onChange={(e) => onYearChange(e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los años</option>
            {years.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="vote-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Calificación mínima
          </label>
          <select
            id="vote-filter"
            value={voteAverage || ''}
            onChange={(e) => onVoteAverageChange(e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Cualquier calificación</option>
            <option value="5.0">5.0+</option>
            <option value="6.0">6.0+</option>
            <option value="7.0">7.0+</option>
            <option value="7.5">7.5+</option>
            <option value="8.0">8.0+</option>
            <option value="8.5">8.5+</option>
            <option value="9.0">9.0+</option>
          </select>
        </div>

        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors duration-200"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};