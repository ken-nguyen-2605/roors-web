import { FaMagnifyingGlass } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";


export default function SearchBar() {
    return (
        <div className="relative flex items-center w-full h-[50px] bg-black">
            <div className="absolute right-[42px] flex items-center flex-row gap-2.5">    
                <div className="flex flex-row gap-1">
                    <input 
                    className="w-[226px] h-[30px] bg-[#F5F4ED] rounded-[60px] px-3 placeholder-black outline-none"
                    type="search"
                    name="search"
                    placeholder="Searching..."
                    >
                    </input>
                    <div className="flex-center w-[30px] h-[30px] bg-[#F5F4ED] rounded-full">
                        <FaMagnifyingGlass/>
                    </div>
                </div>
                <LuNotebookPen size={30} color="#F5F4ED" />
            </div>
        </div>
    )
}