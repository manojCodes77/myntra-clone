import { useSelector } from "react-redux";
import BagItem from "../components/BagItem";
import BagSummary from "../components/BagSummary";

function Bag() {
    const bagItems= useSelector((state) => state.bag);
    const items=useSelector((state)=>state.items);
    const finalBagItems=items.filter((item)=>bagItems.indexOf(item.id)>=0);
    return (
        <main>
            <div className="bag-page">
                <div className="bag-items-container min-h-full">
                    {
                        finalBagItems.length === 0 && <div className="empty-bag font-semibold text-3xl flex justify-center items-center">Your bag is empty</div>
                    }
                    {finalBagItems.map((item) =>
                        <BagItem key={item.id} item={item} />
                    )}
                </div>
                <BagSummary/>
            </div>
        </main>
    )
}
export default Bag;