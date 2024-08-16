import { useDispatch, useSelector } from "react-redux";
import { bagAction } from "../store/bagSlice";
import { GrAddCircle } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";

const HomeItem = ({ item }) => {
    const dispatch = useDispatch();
    const bagItems = useSelector((state) => state.bag);
    const elementFound = bagItems.indexOf(item.id) >= 0;
    const handleAddToBag = () => {
        dispatch(bagAction.addToBag(item.id));
    }
    const handleRemoveFromBag = () => {
        dispatch(bagAction.removeFromBag(item.id));
    }
    return (
        <div className="item-container">
            <img className="item-image" src={item.image} alt="item image" />
            <div className="rating">
                {item.rating.stars} ⭐ | {item.rating.count}
            </div>
            <div className="company-name">{item.company}</div>
            <div className="item-name">{item.item_name}</div>
            <div className="price">
                <span className="current-price">Rs {item.current_price}</span>
                <span className="original-price">Rs {item.original_price}</span>
                <span className="discount">({item.discount_percentage}% OFF)</span>
            </div>
            {!elementFound ?
                <button className="my-2 py-2 rounded-lg w-full flex flex-row justify-center items-center bg-green-500 text-black hover:bg-green-600" onClick={handleAddToBag}><GrAddCircle /> Add to Bag</button> :
                <button className="my-2 py-2 rounded-lg w-full flex flex-row justify-center items-center bg-red-500 text-white hover:bg-red-600" onClick={handleRemoveFromBag} ><AiFillDelete /> Remove</button>
            }
        </div>
    );
};

export default HomeItem;