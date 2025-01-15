import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  topExams: [],
  loading: true,
};

const topExamsSlice = createSlice({
  name: "topExams",
  initialState,
  reducers: {
    setTopExams: (state, action) => {
      state.topExams = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setTopExams, setLoading } = topExamsSlice.actions;

export const selectTopExams = (state) => state.topExams;

export default topExamsSlice.reducer;
