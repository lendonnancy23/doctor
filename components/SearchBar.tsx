import { useState } from 'react';
import styles from './SearchBar.module.css';

export interface SearchFilters {
  name: string;
  speciality: string;
  location: string;
  hospital: string;
  sortBy?: string;
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  specialties: string[];
  loading?: boolean;
}

export default function SearchBar({ onSearch, specialties = [], loading = false }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    speciality: '',
    location: '',
    hospital: '',
    sortBy: 'name'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const clearFilters = () => {
    const resetFilters = {
      name: '',
      speciality: '',
      location: '',
      hospital: '',
      sortBy: 'name'
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const hasActiveFilters = filters.name || filters.speciality !== '' || 
                          filters.location || filters.hospital || 
                          filters.sortBy !== 'name';

  return (
    <div className={styles.searchBarContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.searchRow}>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleInputChange}
            placeholder="Search by doctor name..."
            className={styles.searchInput}
            disabled={loading}
          />
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleInputChange}
            placeholder="Search by location..."
            className={styles.searchInput}
            disabled={loading}
          />
          <input
            type="text"
            name="hospital"
            value={filters.hospital}
            onChange={handleInputChange}
            placeholder="Search by hospital..."
            className={styles.searchInput}
            disabled={loading}
          />
          <button 
            type="submit" 
            className={styles.searchButton}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className={styles.filterGroup}>
          <select 
            name="speciality"
            value={filters.speciality}
            onChange={handleInputChange}
            className={styles.select}
            disabled={loading}
          >
            <option value="">All Specialities</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div className={styles.activeFilters}>
            {filters.name && (
              <span className={styles.chip}>
                Name: {filters.name}
                <button
                  type="button"
                  className={styles.removeChip}
                  onClick={() => handleInputChange({
                    target: { name: 'name', value: '' }
                  } as React.ChangeEvent<HTMLInputElement>)}
                >
                  ×
                </button>
              </span>
            )}
            {filters.speciality && (
              <span className={styles.chip}>
                Speciality: {filters.speciality}
                <button
                  type="button"
                  className={styles.removeChip}
                  onClick={() => handleInputChange({
                    target: { name: 'speciality', value: '' }
                  } as React.ChangeEvent<HTMLInputElement>)}
                >
                  ×
                </button>
              </span>
            )}
            {filters.location && (
              <span className={styles.chip}>
                Location: {filters.location}
                <button
                  type="button"
                  className={styles.removeChip}
                  onClick={() => handleInputChange({
                    target: { name: 'location', value: '' }
                  } as React.ChangeEvent<HTMLInputElement>)}
                >
                  ×
                </button>
              </span>
            )}
            {filters.hospital && (
              <span className={styles.chip}>
                Hospital: {filters.hospital}
                <button
                  type="button"
                  className={styles.removeChip}
                  onClick={() => handleInputChange({
                    target: { name: 'hospital', value: '' }
                  } as React.ChangeEvent<HTMLInputElement>)}
                >
                  ×
                </button>
              </span>
            )}
            {filters.sortBy !== 'name' && (
              <span className={styles.chip}>
                Sorted by: {filters.sortBy}
                <button
                  type="button"
                  className={styles.removeChip}
                  onClick={() => handleInputChange({
                    target: { name: 'sortBy', value: 'name' }
                  } as React.ChangeEvent<HTMLInputElement>)}
                >
                  ×
                </button>
              </span>
            )}
            <button
              type="button"
              className={`${styles.chip} ${styles.clearAll}`}
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </form>
    </div>
  );
}