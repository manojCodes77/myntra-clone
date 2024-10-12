import { createSlice, current } from "@reduxjs/toolkit";

const fetchStatusSlice = createSlice({
    name: "fetchStatus",
    initialState:{
        fetchDone:false,
        currentlyRetching:false,
    },
    reducers:{
    }
});
