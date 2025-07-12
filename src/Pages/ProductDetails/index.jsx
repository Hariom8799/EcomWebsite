import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import { ProductZoom } from "../../components/ProductZoom";
import ProductsSlider from '../../components/ProductsSlider';
import { ProductDetailsComponent } from "../../components/ProductDetails";

import { fetchDataFromApi } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { Reviews } from "./reviews";

export const ProductDetails = () => {

  const [activeTab, setActiveTab] = useState(0);
  const [productData, setProductData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [relatedProductData, setRelatedProductData] = useState([]);

  const { id } = useParams();

  const reviewSec = useRef();

  // Group files by folder (empty object initially)
  const [folderOpenStates, setFolderOpenStates] = useState({});

  useEffect(() => {
    if (productData?.files?.length > 0) {
      const groupedFiles = productData.files.reduce((acc, file) => {
        const folder = file.folderName?.trim() || "Uncategorized";
        if (!acc[folder]) acc[folder] = [];
        acc[folder].push(file);
        return acc;
      }, {});
      const folderNames = Object.keys(groupedFiles);
      const initialState = folderNames.reduce((acc, name) => {
        acc[name] = true;
        return acc;
      }, {});
      setFolderOpenStates(initialState);
    }
  }, [productData?.files]);



  useEffect(() => {
    fetchDataFromApi(`/api/user/getReviews?productId=${id}`).then((res) => {
      if (res?.error === false) {
        setReviewsCount(res.reviews.length)
      }
    })

  }, [reviewsCount])

  useEffect(() => {
    setIsLoading(true);
    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      if (res?.error === false) {
        setProductData(res?.product);

        fetchDataFromApi(`/api/product/getAllProductsBySubCatId/${res?.product?.subCatId}`).then((res) => {
          if (res?.error === false) {
           const filteredData = res?.products?.filter((item) => item._id !== id);
            setRelatedProductData(filteredData)
          }
        })

        setTimeout(() => {
          setIsLoading(false);
        }, 700);
      }
    })


    window.scrollTo(0, 0)
  }, [id])


  const gotoReviews = () => {
    window.scrollTo({
      top: reviewSec?.current.offsetTop - 170,
      behavior: 'smooth',
    })

    setActiveTab(1)

  }

  return (
    <>
      <div className="py-5 hidden">
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              to="/"
              className="link transition !text-[14px]"
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              to="/"
              className="link transition !text-[14px]"
            >
              Fashion
            </Link>

            <Link
              underline="hover"
              color="inherit"
              className="link transition !text-[14px]"
            >
              Cropped Satin Bomber Jacket
            </Link>
          </Breadcrumbs>
        </div>
      </div>



      <section className="bg-white py-5">
        {
          isLoading === true ?
            <div className="flex items-center justify-center min-h-[300px]">
              <CircularProgress />
            </div>


            :


            <>
              <div className="container flex gap-8 flex-col lg:flex-row items-start lg:items-center">
                <div className="productZoomContainer w-full lg:w-[40%]">
                  <ProductZoom images={productData?.images} />
                </div>

                <div className="productContent w-full lg:w-[60%] pr-2 pl-2 lg:pr-10 lg:pl-10">
                  <ProductDetailsComponent item={productData} reviewsCount={reviewsCount} gotoReviews={gotoReviews} />
                </div>
              </div>

              <div className="container pt-10">
                <div className="flex items-center gap-8 mb-5">
                  <span
                    className={`link text-[17px] cursor-pointer font-[500] ${activeTab === 0 && "text-primary"
                      }`}
                    onClick={() => setActiveTab(0)}
                  >
                    Description
                  </span>


                  <span
                    className={`link text-[17px] cursor-pointer font-[500] ${activeTab === 1 && "text-primary"
                      }`}
                    onClick={() => setActiveTab(1)}
                    ref={reviewSec}
                  >
                    Reviews ({reviewsCount})
                  </span>
                  <span
                    className={`link text-[17px] cursor-pointer font-[500] ${activeTab === 2 && "text-primary"}`}
                    onClick={() => setActiveTab(2)}
                  >
                    Files
                  </span>

                </div>

                {activeTab === 0 && (
                  <div className="shadow-md w-full py-5 px-8 rounded-md text-[14px]">
                    {
                      productData?.description
                    }
                  </div>
                )}


                {activeTab === 1 && (
                  <div className="shadow-none lg:shadow-md w-full sm:w-[80%] py-0  lg:py-5 px-0 lg:px-8 rounded-md">
                    {
                      productData?.length !== 0 && <Reviews productId={productData?._id} setReviewsCount={setReviewsCount} />
                    }

                  </div>
                )}

                {/* {activeTab === 2 && (
                  <div className="shadow-md w-full py-5 px-8 rounded-md text-[14px]">
                    {productData?.files?.length > 0 ? (
                      Object.entries(
                        productData.files.reduce((acc, file) => {
                          const folder = file.folderName?.trim() || "Uncategorized";
                          if (!acc[folder]) acc[folder] = [];
                          acc[folder].push(file);
                          return acc;
                        }, {})
                      ).map(([folderName, files], idx) => (
                        <div key={idx} className="mb-6">
                          <h3 className="text-[16px] font-semibold mb-2 border-b pb-1">{folderName}</h3>
                          <ul className="pl-4 space-y-2">
                            {files.map((file) => (
                              <li key={file._id} className="flex items-center gap-2">
                                📄
                                <a
                                  href={file.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline hover:text-blue-800 transition-all"
                                >
                                  {file.fileName}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No files available for this product.</p>
                    )}
                  </div>
                )} */}

                {activeTab === 2 && (
                  <div className="shadow-md w-full py-5 px-8 rounded-md text-[14px]">
                    {productData?.files?.length > 0 ? (
                      Object.entries(
                        productData.files.reduce((acc, file) => {
                          const folder = file.folderName?.trim() || "Uncategorized";
                          if (!acc[folder]) acc[folder] = [];
                          acc[folder].push(file);
                          return acc;
                        }, {})
                      ).map(([folderName, files], idx) => {
                        const isOpen = folderOpenStates[folderName];

                        const toggleFolder = (name) => {
                          setFolderOpenStates((prev) => ({
                            ...prev,
                            [name]: !prev[name],
                          }));
                        };

                        return (
                          <div key={idx} className="mb-6 border border-gray-200 rounded-md">
                            {/* Folder Header */}
                            <div
                              className="cursor-pointer bg-gray-100 px-4 py-2 flex items-center justify-between"
                              onClick={() => toggleFolder(folderName)}
                            >
                              <span className="font-semibold text-[15px]">
                                📁 {folderName} ({files.length})
                              </span>
                              <span className="text-gray-600 text-sm">
                                {isOpen ? "▲ Collapse" : "▼ Expand"}
                              </span>
                            </div>

                            {/* Folder Content */}
                            {isOpen && (
                              <div className="overflow-x-auto">
                                <table className="min-w-full mt-2 text-left text-sm border-t border-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-2 border">#</th>
                                      <th className="px-4 py-2 border">File Name</th>
                                      <th className="px-4 py-2 border">Version</th>
                                      <th className="px-4 py-2 border">Uploaded By</th>
                                      <th className="px-4 py-2 border">Uploaded At</th>
                                      <th className="px-4 py-2 border">Download</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {files.map((file, fileIndex) => (
                                      <tr key={file._id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-2 border">{fileIndex + 1}</td>
                                        <td className="px-4 py-2 border">{file.fileName}</td>
                                        <td className="px-4 py-2 border">{file.fileVersion}</td>
                                        <td className="px-4 py-2 border">{file.uploadedBy || "N/A"}</td>
                                        <td className="px-4 py-2 border">
                                          {new Date(file.uploadedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 border">
                                          <a
                                            href={file.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline hover:text-blue-800"
                                          >
                                            Download
                                          </a>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">No files available for this product.</p>
                    )}
                  </div>
                )}




              </div>

              {
                relatedProductData?.length !== 0 &&
                <div className="container pt-8">
                  <h2 className="text-[20px] font-[600] pb-0">Related Products</h2>
                  <ProductsSlider items={6} data={relatedProductData}/>
                </div>
              }


            </>

        }




      </section>
    </>
  );
};
