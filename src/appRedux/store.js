// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Combine reducers
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducer/authReducer';
import ticketReducer from './reducer/ticketsReducer';
import userReducer from './reducer/userReducer'
import eventScheduleReducer from './reducer/eventScheduleReducer';

// Create root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  tickets: ticketReducer,
  users: userReducer,
  eventSchedule: eventScheduleReducer
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Only persist auth reducer
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ],
      },
}),
});

export const persistor = persistStore(store);
export default store;