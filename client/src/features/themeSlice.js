import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name:'themeSlice',
    initialState:true,
    reducers:{
        toggleTheme:(state)=> !state
    }
});

export default themeSlice.reducer;
export const {toggleTheme} = themeSlice.actions;