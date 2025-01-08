import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  classes: [],
};

const classSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    setClasses: (state, action) => {
      state.classes = action.payload;
    },
  },
});

export const { setClasses } = classSlice.actions;
export default classSlice.reducer;
