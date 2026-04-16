import { createContext, useContext, useReducer, useEffect } from 'react';
import { defaultValues } from '../data/defaultValues';

// ─── Context ─────────────────────────────────────────────────────────────────
const ContractContext = createContext(null);

// ─── Reducer ─────────────────────────────────────────────────────────────────
function contractReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_SECTION': {
      // If existing state for section is an array, replace with payload directly
      if (Array.isArray(action.payload)) {
        return { ...state, [action.section]: action.payload };
      }
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          ...action.payload,
        },
      };
    }
    case 'UPDATE_FIELD': {
      // action.path = ['section'] for top-level replacement, ['section','field'], or ['section','sub','field']
      const [section, ...rest] = action.path;
      if (rest.length === 0) {
        // Top-level replacement (e.g., techStack array)
        return { ...state, [section]: action.value };
      }
      if (rest.length === 1) {
        const existing = state[section];
        if (Array.isArray(existing)) {
          // shouldn't happen but safe fallback
          return { ...state, [section]: action.value };
        }
        return {
          ...state,
          [section]: { ...existing, [rest[0]]: action.value },
        };
      }
      if (rest.length === 2) {
        return {
          ...state,
          [section]: {
            ...state[section],
            [rest[0]]: { ...state[section][rest[0]], [rest[1]]: action.value },
          },
        };
      }
      return state;
    }
    case 'UPDATE_ARRAY_ITEM': {
      const arr = [...state[action.section][action.field]];
      arr[action.index] = { ...arr[action.index], ...action.payload };
      return {
        ...state,
        [action.section]: { ...state[action.section], [action.field]: arr },
      };
    }
    case 'SET_STEP':
      return { ...state, _step: action.step };
    case 'RESET_FORM':
      return { ...defaultValues, _step: 0 };
    default:
      return state;
  }
}

// ─── Session Storage Key ──────────────────────────────────────────────────────
const SESSION_KEY = 'vxt_contract_form';

function loadFromSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function ContractProvider({ children }) {
  const saved = loadFromSession();
  const initial = saved ? { ...defaultValues, ...saved } : { ...defaultValues, _step: 0 };

  const [state, dispatch] = useReducer(contractReducer, initial);

  // Persist to sessionStorage on every state change
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <ContractContext.Provider value={{ state, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
}

// ─── Custom Hook ─────────────────────────────────────────────────────────────
export function useContract() {
  const ctx = useContext(ContractContext);
  if (!ctx) throw new Error('useContract must be used within ContractProvider');
  return ctx;
}
