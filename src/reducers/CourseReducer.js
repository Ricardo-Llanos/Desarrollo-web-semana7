// src/reducers/coursesReducer.js
export const INITIAL_STATE = {
  categoryFilter: 'Todos',
  sortBy: 'id', // 'id', 'title', 'lessonsCount', 'durationHours'
  searchQuery: ''
};

export const coursesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, categoryFilter: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'RESET_FILTERS':
      return INITIAL_STATE;
    default:
      return state;
  }
};