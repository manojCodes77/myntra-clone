import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { itemsAction } from '../store/itemsSlice';
import { fetchStatusActions } from '../store/fetchStatusSlice';

const FetchItems = () => {
    const fetchStatus = useSelector((store) => store.fetchStatus);
    const dispatch = useDispatch();

    const API_URL=import.meta.env.VITE_API_URL;
    
    useEffect(() => {
        if (fetchStatus.fetchDone) return;
        
        const controller = new AbortController();
        const signal = controller.signal;
        
        dispatch(fetchStatusActions.markFetchingStarted());
        
        fetch(API_URL, { signal })
            .then((res) => res.json())
            .then(({ items }) => {
                dispatch(fetchStatusActions.markFetchingFinished());
                dispatch(fetchStatusActions.markFetchDone());
                dispatch(itemsAction.addInitialItems(items));
            })
            .catch((error) => {
                // Ignore abort errors
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                    return;
                }
                console.error('Error fetching items:', error);
                dispatch(fetchStatusActions.markFetchingFinished());
            });
        
        return () => {
            controller.abort();
        };
    }, [dispatch]); // Only depend on dispatch, not fetchStatus to prevent infinite loops
    
    return null;
};

export default FetchItems;