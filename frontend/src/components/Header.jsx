import { IoPerson } from "react-icons/io5";
import { FaFaceGrinHearts } from "react-icons/fa6";
import { IoBag } from "react-icons/io5";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
const Header = () => {
    return (
        <>
            <header className="flex flex-row bg-white items-center justify-between border-b-2 border-b-slate-500 flex-nowrap overflow-y-hidden overflow-x-scroll pl-2" >
                <div className="inline-block min-w-16">
                    <Link to="/" className="inline-block" ><img className="myntra_home w-15 h-11" src="images/myntra_logo.webp" alt="Myntra Home" /></Link>
                </div>
                <nav className="nav_bar">
                    <a href="#">Men</a>
                    <a href="#">Women</a>
                    <a href="#">Kids</a>
                    <a href="#">Home & Living</a>
                    <a href="#">Beauty</a>
                    <a href="#">Studio <sup>New</sup></a>
                </nav>
                <div className="search_bar flex flex-row gap-1 items-center">
                    {/* <span className="material-symbols-outlined search_icon">search</span> */}
                    <button><IoMdSearch className="w-9 h-9 bg-zinc-200 p-2" /></button>
                    <input className="search_input px-2 bg-zinc-200 min-w-60 text-sm box-content text-zinc-700 " placeholder="Search for products, brands and more" />
                </div>
                <div className="action_bar items-center">
                    <div className="action_container">
                        <IoPerson />
                        <span className="action_name">Profile</span>
                    </div>

                    <div className="action_container">
                        <FaFaceGrinHearts />
                        <span className="action_name">Wishlist</span>
                    </div>
                    <Link className=" flex flex-col justify-start items-center" to="bag">
                        <div className="flex flex-row justify-center items-center" >
                        <IoBag />
                        <span className="bag-item-count">0</span>
                        </div>
                        <span className="action_name">Bag</span>
                    </Link>
                </div>
            </header>
        </>
    );
}
export default Header;