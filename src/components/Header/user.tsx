import { useState } from "react";

import { FaUserCircle } from "react-icons/fa";

import PaperMenu from "./DropDownMenu";

export default function UserIcon() {
    const [opend, setOpend] = useState(false)

    return (
        <div className="relative flex-center">
            <button
            onClick={() => setOpend(!opend)} 
            className="">
                <FaUserCircle className="w-[30px] h-[30px]"/>
            </button>

            {opend && (
            <div className="absolute top-12 right-0 z-50">
                <PaperMenu/>
            </div>
            )}
        </div>
    )
}