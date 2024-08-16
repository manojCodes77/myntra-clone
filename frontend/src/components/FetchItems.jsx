import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { itemsAction } from '../store/itemsSlice';
import { fetchStatusActions } from '../store/fetchStatusSlice';
const FetchItems=()=>{
    const fetchStatus = useSelector((store) => store.fetchStatus);
    const dispatch = useDispatch();
    console.log("fetchStatus",fetchStatus);
    useEffect(()=>{
        if(fetchStatus.fetchDone)return ;
        
        const controller= new AbortController();
        const signal = controller.signal;
        dispatch(fetchStatusActions.markFetchingStarted());
        fetch('http://localhost:8080/items', {signal})
        .then((res)=>res.json())
        .then(({items})=>{
            dispatch(fetchStatusActions.markFetchingFinished());
            dispatch(fetchStatusActions.markFetchDone());
            dispatch(itemsAction.addInitialItems(items));
            console.log("jai shree ram",items);
        });
        return ()=>{
            console.log('cleanup');
            controller.abort();
        }
    }
    , [fetchStatus]);
    return(
        <>
        </>
    )
}
export default FetchItems;