export { store, persistor } from './store';
export type { RootState, AppDispatch } from './store';
export { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout 
} from './slices/authslice';

// Typed hooks for use throughout the app
import { useDispatch, useSelector } from 'react-redux';
import type {  TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;