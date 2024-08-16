import { configureStore } from '@reduxjs/toolkit';
import itemsSlice from './itemsSlice';
import fetchStatusSlice from './fetchStatusSlice';
import bagSlice from './bagSlice';
const myntraStore= configureStore({
    reducer: {
        items: itemsSlice.reducer,
        fetchStatus:fetchStatusSlice.reducer,
    }
});
export default myntraStore;