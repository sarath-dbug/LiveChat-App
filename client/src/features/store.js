import { configureStore } from '@reduxjs/toolkit';
import themeSlice from './themeSlice';
import refreshSidebar from './refreshSidebar';

export const store = configureStore({
    reducer:{
        themeKey: themeSlice,
        refreshKey: refreshSidebar,
    }
})