import React, { useContext, useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "../Sidebar/style.css";
import { Collapse } from "react-collapse";
import { FaAngleDown } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { FaAngleUp } from "react-icons/fa6";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Rating from "@mui/material/Rating";
import { MyContext } from "../../App";
import { useLocation } from "react-router-dom";
import { postData } from "../../utils/api";
import { MdOutlineFilterAlt } from "react-icons/md";
import CategoryItem from "./CategoryItem";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export const Sidebar = (props) => {
  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);

  const [filters, setFilters] = useState({
    catId: [],
    subCatId: [],
    thirdsubCatId: [],
    minPrice: '',
    maxPrice: '',
    rating: [],
    page: 1,
    limit: 25,
    startDate: null,
    endDate: null,
  })



  const [price, setPrice] = useState([0, 60000]);

  const context = useContext(MyContext);

  const location = useLocation();


  // const handleCheckboxChange = (field, value) => {

  //   context?.setSearchData([]);

  //   const currentValues = filters[field] || []
  //   const updatedValues = currentValues?.includes(value) ?
  //     currentValues.filter((item) => item !== value) :
  //     [...currentValues, value];

  //   setFilters((prev) => ({
  //     ...prev,
  //     [field]: updatedValues
  //   }))


  //   if (field === "catId") {
  //     setFilters((prev) => ({
  //       ...prev,
  //       subCatId: [],
  //       thirdsubCatId: []
  //     }))
  //   }

  // }

  const handleCheckboxChange = (field, value) => {
    context?.setSearchData([]);

    setFilters((prev) => {
      const updatedValues = prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value];

      const newFilters = {
        ...prev,
        [field]: updatedValues
      };

      // Reset dependent filters
      if (field === 'catId') {
        newFilters.subCatId = [];
        newFilters.thirdsubCatId = [];
      }
      if (field === 'subCatId') {
        newFilters.thirdsubCatId = [];
      }

      return newFilters;
    });
  };
  
  

  useEffect(() => {

    console.log("cat data ", context?.catData)
    const url = window.location.href;
    const queryParameters = new URLSearchParams(location.search);

    if (url.includes("catId")) {
      const categoryId = queryParameters.get("catId");
      const catArr = [];
      catArr.push(categoryId);
      filters.catId = catArr;
      filters.subCatId = [];
      filters.thirdsubCatId = [];
      filters.rating = [];
      context?.setSearchData([]);
    }

    if (url.includes("subCatId")) {
      const subcategoryId = queryParameters.get("subCatId");
      const subcatArr = [];
      subcatArr.push(subcategoryId);
      filters.subCatId = subcatArr;
      filters.catId = [];
      filters.thirdsubCatId = [];
      filters.rating = [];
      context?.setSearchData([]);
    }


    if (url.includes("thirdLavelCatId")) {
      const thirdcategoryId = queryParameters.get("thirdLavelCatId");
      const thirdcatArr = [];
      thirdcatArr.push(thirdcategoryId);
      filters.subCatId = [];
      filters.catId = [];
      filters.thirdsubCatId = thirdcatArr;
      filters.rating = [];
      context?.setSearchData([]);
    }

    filters.page = 1;

    setTimeout(() => {
      filtesData();
    }, 200);




  }, [location]);



  // const filtesData = () => {
  //   props.setIsLoading(true);

  //   //console.log(context?.searchData)

  //   if (context?.searchData?.products?.length > 0) {
  //     props.setProductsData(context?.searchData);
  //     props.setIsLoading(false);
  //     props.setTotalPages(context?.searchData?.totalPages)
  //     window.scrollTo(0, 0);
  //   } else {
  //     postData(`/api/product/filters`, filters).then((res) => {
  //       props.setProductsData(res);
  //       props.setIsLoading(false);
  //       props.setTotalPages(res?.totalPages)
  //       window.scrollTo(0, 0);
  //     })
  //   }


  // }

  const filtesData = () => {
    props.setIsLoading(true);

    // Format dates for API if they exist
    const filterData = {
      ...filters,
      startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : null,
      endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : null
    };

    if (context?.searchData?.products?.length > 0) {
      props.setProductsData(context?.searchData);
      props.setIsLoading(false);
      props.setTotalPages(context?.searchData?.totalPages)
      window.scrollTo(0, 0);
    } else {
      postData(`/api/product/filters`, filterData).then((res) => {
        props.setProductsData(res);
        props.setIsLoading(false);
        props.setTotalPages(res?.totalPages)
        window.scrollTo(0, 0);
      }).catch((error) => {
        console.error('Filter error:', error);
        props.setIsLoading(false);
      });
    }
  };



  useEffect(() => {
    filters.page = props.page;
    filtesData();
  }, [filters.catId,
    filters.subCatId,
    filters.thirdsubCatId,
    filters.minPrice,
    filters.maxPrice,
    filters.rating,
    props.page])


  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: price[0],
      maxPrice: price[1]
    }))
  }, [price]);

  useEffect(() => {
    // Only trigger filter when both dates are selected or when clearing dates
    if ((filters.startDate && filters.endDate) || (!filters.startDate && !filters.endDate)) {
      const timer = setTimeout(() => {
        filtesData();
      }, 500); // Add debounce to prevent too many API calls

      return () => clearTimeout(timer);
    }
  }, [filters.startDate, filters.endDate]);
  

  const resetFilters = () => {
    setFilters({
      catId: [],
      subCatId: [],
      thirdsubCatId: [],
      minPrice: '',
      maxPrice: '',
      rating: [],
      startDate: null,
      endDate: null,
      page: 1,
      limit: 25
    });
    setPrice([0, 60000]);
    context?.setSearchData([]);
  };


  return (
    <aside className="sidebar py-3  lg:py-5 static lg:sticky top-[130px] z-[50] pr-0 lg:pr-5">
      <div className=" min-h-[60vh]  lg:overflow-visible overflow-auto  w-full">
        <div className="box">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Shop by Category
            <Button
              className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
              onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
            >
              {isOpenCategoryFilter === true ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </h3>
          <Collapse isOpened={isOpenCategoryFilter}>
            <div className="scroll px-4 relative -left-[13px]">


              {/* {
                context?.catData?.length !== 0 && context?.catData?.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      value={item?._id}
                      control={<Checkbox />}
                      checked={filters?.catId?.includes(item?._id)}
                      label={item?.name}
                      onChange={() => handleCheckboxChange('catId', item?._id)}
                      className="w-full"
                    />
                  )
                })
              } */}
              {context?.catData?.map((item) => (
                <CategoryItem
                  key={item._id}
                  item={item}
                  level={0}
                  filters={filters}
                  handleCheckboxChange={handleCheckboxChange}
                />
              ))}


            </div>
          </Collapse>
        </div>

        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Filter By Price
          </h3>

          <RangeSlider
            value={price}
            onInput={setPrice}
            min={100}
            max={60000}
            setp={5}
          />
          <div className="flex pt-4 pb-2 priceRange">
            <span className="text-[13px]">
              From: <strong className="text-dark">Rs: {price[0]}</strong>
            </span>
            <span className="ml-auto text-[13px]">
              From: <strong className="text-dark">Rs: {price[1]}</strong>
            </span>
          </div>
        </div>

        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Filter By Rating
          </h3>

          <div className="flex items-center pl-2 lg:pl-1">
            <FormControlLabel
              value={5}
              control={<Checkbox />}
              checked={filters.rating.includes(5)}
              onChange={() => handleCheckboxChange('rating', 5)}
            />

            <Rating
              name="rating"
              value={5}
              size="small"
              readOnly
            />

          </div>



          <div className="flex items-center pl-2 lg:pl-1">
            <FormControlLabel
              value={4}
              control={<Checkbox />}
              checked={filters?.rating?.includes(4)}
              onChange={() => handleCheckboxChange('rating', 4)}
            />
            <Rating
              name="rating"
              value={4}
              size="small"
              readOnly
            />

          </div>


          <div className="flex items-center pl-2 lg:pl-1">
            <FormControlLabel
              value={3}
              control={<Checkbox />}
              checked={filters?.rating?.includes(3)}
              onChange={() => handleCheckboxChange('rating', 3)}
            />
            <Rating
              name="rating"
              value={3}
              size="small"
              readOnly
            />

          </div>


          <div className="flex items-center pl-2 lg:pl-1">
            <FormControlLabel
              value={2}
              control={<Checkbox />}
              checked={filters?.rating?.includes(2)}
              onChange={() => handleCheckboxChange('rating', 2)}
            />
            <Rating
              name="rating"
              value={2}
              size="small"
              readOnly
            />

          </div>




          <div className="flex items-center pl-2 lg:pl-1">
            <FormControlLabel
              value={1}
              control={<Checkbox />}
              checked={filters?.rating?.includes(1)}
              onChange={() => handleCheckboxChange('rating', 1)}
            />
            <Rating
              name="rating"
              value={1}
              size="small"
              readOnly
            />

          </div>

        </div>

        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Filter By Date
          </h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[13px] text-gray-600 block mb-1">Start Date:</label>
              <DatePicker
                selected={filters.startDate}
                onChange={(date) => {
                  setFilters(prev => ({ ...prev, startDate: date }));
                  // Clear search data when date changes
                  context?.setSearchData([]);
                }}
                selectsStart
                startDate={filters.startDate}
                endDate={filters.endDate}
                placeholderText="Select start date"
                className="w-full p-2 border rounded text-[13px]"
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()} // Prevent future dates
              />
            </div>
            <div>
              <label className="text-[13px] text-gray-600 block mb-1">End Date:</label>
              <DatePicker
                selected={filters.endDate}
                onChange={(date) => {
                  setFilters(prev => ({ ...prev, endDate: date }));
                  // Clear search data when date changes
                  context?.setSearchData([]);
                }}
                selectsEnd
                startDate={filters.startDate}
                endDate={filters.endDate}
                minDate={filters.startDate}
                placeholderText="Select end date"
                className="w-full p-2 border rounded text-[13px]"
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()} // Prevent future dates
              />
            </div>
            {/* Add clear dates button */}
            {(filters.startDate || filters.endDate) && (
              <Button
                className="!text-[12px] !text-red-600 !p-1"
                onClick={() => {
                  setFilters(prev => ({ ...prev, startDate: null, endDate: null }));
                  context?.setSearchData([]);
                }}
              >
                Clear Dates
              </Button>
            )}
          </div>
        </div>

        <div className="box mt-4">
          <Button
            className="btn-secondary w-full !bg-gray-200 !text-gray-700 hover:!bg-gray-300"
            onClick={resetFilters}
          >
            Reset All Filters
          </Button>
        </div>

      </div>
      <br />
      <Button className="btn-org w-full !flex lg:!hidden" onClick={() => context?.setOpenFilter(false)}><MdOutlineFilterAlt size={20} /> Filers</Button>


    </aside>
  );
};
