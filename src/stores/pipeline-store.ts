import { create } from 'zustand';

type PipelineView = 'kanban' | 'table';
type SortField = 'name' | 'date' | 'priority' | 'salary';
type SortOrder = 'asc' | 'desc';
type PriorityFilter = 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface PipelineState {
  // View
  view: PipelineView;
  setView: (view: PipelineView) => void;

  // Sorting
  sortBy: SortField;
  setSortBy: (field: SortField) => void;
  sortOrder: SortOrder;
  toggleSortOrder: () => void;

  // Filters
  filterPriority: PriorityFilter;
  setFilterPriority: (priority: PriorityFilter) => void;
  filterStageId: string | null;
  setFilterStageId: (stageId: string | null) => void;

  // Selection
  selectedCompanyIds: string[];
  addSelectedCompany: (id: string) => void;
  removeSelectedCompany: (id: string) => void;
  clearSelectedCompanies: () => void;
  toggleAllCompanies: (allIds: string[]) => void;

  // Drag state
  draggedCompanyId: string | null;
  setDraggedCompanyId: (id: string | null) => void;
}

export const usePipelineStore = create<PipelineState>()((set) => ({
  // View
  view: 'kanban',
  setView: (view) => set({ view }),

  // Sorting
  sortBy: 'date',
  setSortBy: (field) => set({ sortBy: field }),
  sortOrder: 'desc',
  toggleSortOrder: () =>
    set((state) => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' })),

  // Filters
  filterPriority: 'ALL',
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  filterStageId: null,
  setFilterStageId: (stageId) => set({ filterStageId: stageId }),

  // Selection
  selectedCompanyIds: [],
  addSelectedCompany: (id) =>
    set((state) => ({
      selectedCompanyIds: state.selectedCompanyIds.includes(id)
        ? state.selectedCompanyIds
        : [...state.selectedCompanyIds, id],
    })),
  removeSelectedCompany: (id) =>
    set((state) => ({
      selectedCompanyIds: state.selectedCompanyIds.filter(
        (companyId) => companyId !== id
      ),
    })),
  clearSelectedCompanies: () => set({ selectedCompanyIds: [] }),
  toggleAllCompanies: (allIds) =>
    set((state) => ({
      selectedCompanyIds:
        state.selectedCompanyIds.length === allIds.length ? [] : [...allIds],
    })),

  // Drag state
  draggedCompanyId: null,
  setDraggedCompanyId: (id) => set({ draggedCompanyId: id }),
}));
