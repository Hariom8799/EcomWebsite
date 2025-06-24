// src/components/Sidebar/CategoryItem.js
import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const CategoryItem = ({ item, level = 0, filters, handleCheckboxChange }) => {
    const paddingLeft = `${level * 10}px`; // Add indentation for nesting

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

    return (
        <div style={{ paddingLeft }} className="category-item">
            <FormControlLabel
                value={item._id}
                control={<Checkbox />}
                checked={isChecked()}
                onChange={() => handleCheckboxChange(getFilterField(), item._id)}
                label={item.name}
                className="w-full"
            />

            {item.children && item.children.length > 0 && (
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
            )}
        </div>
    );
};

export default CategoryItem;
