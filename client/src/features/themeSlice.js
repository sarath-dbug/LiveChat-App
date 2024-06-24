import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name:'themeSlice',
    initialState:true,
    reducers:{
        toggleTheme:(state)=> !state // Return a new state object
    }
});

export default themeSlice.reducer;
export const {toggleTheme} = themeSlice.actions;