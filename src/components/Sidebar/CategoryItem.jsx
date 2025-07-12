// // src/components/Sidebar/CategoryItem.js
// import React from "react";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";

// const CategoryItem = ({ item, level = 0, filters, handleCheckboxChange }) => {
//     const paddingLeft = `${level * 10}px`; // Add indentation for nesting

//     const isChecked = () => {
//         if (level === 0) return filters.catId.includes(item._id);
//         if (level === 1) return filters.subCatId.includes(item._id);
//         if (level === 2) return filters.thirdsubCatId.includes(item._id);
//         return false;
//     };

//     const getFilterField = () => {
//         if (level === 0) return "catId";
//         if (level === 1) return "subCatId";
//         if (level === 2) return "thirdsubCatId";
//         return "";
//     };

//     return (
//         <div style={{ paddingLeft }} className="category-item">
//             <FormControlLabel
//                 value={item._id}
//                 control={<Checkbox />}
//                 checked={isChecked()}
//                 onChange={() => handleCheckboxChange(getFilterField(), item._id)}
//                 label={item.name}
//                 className="w-full"
//             />

//             {item.children && item.children.length > 0 && (
//                 <div className="ml-2">
//                     {item.children.map((child) => (
//                         <CategoryItem
//                             key={child._id}
//                             item={child}
//                             level={level + 1}
//                             filters={filters}
//                             handleCheckboxChange={handleCheckboxChange}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CategoryItem;

// Updated CategoryItem.js with collapsible functionality

import React, { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { Collapse } from "react-collapse";

const CategoryItem = ({ item, level = 0, filters, handleCheckboxChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const paddingLeft = `${level * 15}px`;

    const isChecked = () => {
        if (level === 0) return filters.catId.includes(item._id);
        if (level === 1) return filters.subCatId.includes(item._id);
        if (level === 2) return filters.thirdsubCatId.includes(item._id);
        return false;
    };

    const getFilterField = () => {
        if (level === 0) return "catId";
        if (level === 1) return "subCatId";
        if (level === 2) return "thirdsubCatId";
        return "";
    };

    const hasChildren = item.children && item.children.length > 0;

    return (
        <div style={{ paddingLeft }} className="category-item">
            <div className="flex items-center w-full">
                <FormControlLabel
                    value={item._id}
                    control={<Checkbox />}
                    checked={isChecked()}
                    onChange={() => handleCheckboxChange(getFilterField(), item._id)}
                    label={item.name}
                    className="flex-1"
                />

                {hasChildren && (
                    <Button
                        className="!w-[25px] !h-[25px] !min-w-[25px] !rounded-full !text-[#000] !ml-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FaAngleUp size={12} /> : <FaAngleDown size={12} />}
                    </Button>
                )}
            </div>

            {hasChildren && (
                <Collapse isOpened={isOpen}>
                    <div className="ml-2">
                        {item.children.map((child) => (
                            <CategoryItem
                                key={child._id}
                                item={child}
                                level={level + 1}
                                filters={filters}
                                handleCheckboxChange={handleCheckboxChange}
                            />
                        ))}
                    </div>
                </Collapse>
            )}
        </div>
    );
};

export default CategoryItem;