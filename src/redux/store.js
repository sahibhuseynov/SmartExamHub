// /src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import categoryReducer from './categorySlice';
import classReducer from './classSlice';
import topExamsReducer from "./topExamsSlice";
import latestExamsReducer from "./latestExamsSlice";
import storage from 'redux-persist/lib/storage'; // LocalStorage kullanımı için
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';

// Persist yapılandırması
const persistConfig = {
  key: 'root', // LocalStorage'da anahtar ismi
  storage,     // LocalStorage kullanılıyor
  whitelist: ['user'], // Sadece user reducer'ı kalıcı olacak
};

// Reducer'ları birleştir
const rootReducer = combineReducers({
  user: userReducer,
  categories: categoryReducer,
  classes: classReducer,
  topExams: topExamsReducer,
  latestExams: latestExamsReducer, 
});

// Persist edilmiş reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux store oluşturuluyor
export const store = configureStore({
  reducer: persistedReducer,
});

// Persistor'u oluşturuyoruz (index.js'de kullanılacak)
export const persistor = persistStore(store);
