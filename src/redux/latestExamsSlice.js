import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  latestExams: [],
  loading: true,
};

const latestExamsSlice = createSlice({
  name: "latestExams",
  initialState,
  reducers: {
    setLatestExams: (state, action) => {
      state.latestExams = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLatestExams, setLoading } = latestExamsSlice.actions;

export const selectLatestExams = (state) => state.latestExams;

export default latestExamsSlice.reducer;
