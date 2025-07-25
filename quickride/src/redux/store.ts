import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import authReducer from './slices/authslice';

// Step 1: Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Step 2: Create persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist auth slice
};

// Step 3: Wrap root reducer with persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Step 4: Configure store with middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist uses non-serializable actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Step 5: Create persistor
export const persistor = persistStore(store);

// Step 6: Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
