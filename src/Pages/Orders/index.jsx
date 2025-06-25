// import React, { useEffect, useState } from "react";
// import AccountSidebar from "../../components/AccountSidebar";
// import { Button } from "@mui/material";
// import { FaAngleDown } from "react-icons/fa6";
// import Badge from "../../components/Badge";
// import { FaAngleUp } from "react-icons/fa6";
// import { fetchDataFromApi } from "../../utils/api";
// import Pagination from "@mui/material/Pagination";

// const Orders = () => {
//   const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
//   const [orders, setOrders] = useState([]);

//   const [page, setPage] = useState(1);

//   const isShowOrderdProduct = (index) => {
//     if (isOpenOrderdProduct === index) {
//       setIsOpenOrderdProduct(null);
//     } else {
//       setIsOpenOrderdProduct(index);
//     }

//   };


//   useEffect(() => {
//     fetchDataFromApi(`/api/order/order-list/orders?page=${page}&limit=5`).then((res) => {
//       if (res?.error === false) {
//         setOrders(res)
//       }
//     })
//   }, [page])

//   return (
//     <section className="py-5 lg:py-10 w-full">
//       <div className="container flex flex-col lg:flex-row gap-5">
//         <div className="col1 w-[20%] hidden lg:block">
//           <AccountSidebar />
//         </div>

//         <div className="col2 w-full lg:w-[80%]">
//           <div className="shadow-md rounded-md bg-white">
//             <div className="py-5 px-5 border-b border-[rgba(0,0,0,0.1)]">
//               <h2>My Orders</h2>
//               <p className="mt-0 mb-0">
//                 There are <span className="font-bold text-primary">{ orders?.data?.length}</span>{" "}
//                 orders
//               </p>

//               <div className="relative overflow-x-auto mt-5">
//                 <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//                   <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                     <tr>
//                       <th scope="col" className="px-6 py-3">
//                         &nbsp;
//                       </th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                         Order Id
//                       </th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                         Paymant Id
//                       </th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                         Name
//                       </th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                         Phone Number
//                       </th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                         Address
//                       </th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                         Pincode
//                       </th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                         Total Amount
//                       </th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                         Email
//                       </th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                         User Id
//                       </th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                         Order Status
//                       </th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">
//                         Date
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>

//                     {
//                       orders?.data?.length !== 0 && orders?.data?.map((order, index) => {
//                         return (
//                           <>
//                             <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//                               <td className="px-6 py-4 font-[500]">
//                                 <Button
//                                   className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
//                                   onClick={() => isShowOrderdProduct(index)}
//                                 >
//                                   {
//                                     isOpenOrderdProduct === index ? <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" /> : <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
//                                   }

//                                 </Button>
//                               </td>
//                               <td className="px-6 py-4 font-[500]">
//                                 <span className="text-primary">
//                                   {order?._id}
//                                 </span>
//                               </td>

//                               <td className="px-6 py-4 font-[500]">
//                                 <span className="text-primary whitespace-nowrap text-[13px]">{order?.paymentId ? order?.paymentId : 'CASH ON DELIVERY'}</span>
//                               </td>

//                               <td className="px-6 py-4 font-[500] whitespace-nowrap">
//                                 {order?.userId?.name}
//                               </td>

//                               <td className="px-6 py-4 font-[500]">{order?.delivery_address?.mobile}</td>

//                               <td className="px-6 py-4 font-[500]">
//                                <span className='inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md'>{order?.delivery_address?.addressType}</span>
//                                 <span className="block w-[400px]">
//                                   {order?.delivery_address?.
//                                     address_line1 + " " +
//                                     order?.delivery_address?.city + " " +
//                                     order?.delivery_address?.landmark + " " +
//                                     order?.delivery_address?.state + " " +
//                                     order?.delivery_address?.country
//                                   }
//                                 </span>
//                               </td>

//                               <td className="px-6 py-4 font-[500]">{order?.delivery_address?.pincode}</td>

//                               <td className="px-6 py-4 font-[500]">{order?.totalAmt}</td>

//                               <td className="px-6 py-4 font-[500]">
//                                 {order?.userId?.email}
//                               </td>

//                               <td className="px-6 py-4 font-[500]">
//                                 <span className="text-primary">
//                                   {order?.userId?._id}
//                                 </span>
//                               </td>

//                               <td className="px-6 py-4 font-[500]">
//                                 <Badge status={order?.order_status} />
//                               </td>
//                               <td className="px-6 py-4 font-[500] whitespace-nowrap">
//                                 {order?.createdAt?.split("T")[0]}
//                               </td>
//                             </tr>

//                             {isOpenOrderdProduct === index && (
//                               <tr>
//                                 <td className="pl-20" colSpan="6">
//                                   <div className="relative overflow-x-auto">
//                                     <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//                                       <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                                         <tr>
//                                           <th
//                                             scope="col"
//                                             className="px-6 py-3 whitespace-nowrap"
//                                           >
//                                             Product Id
//                                           </th>
//                                           <th
//                                             scope="col"
//                                             className="px-6 py-3 whitespace-nowrap"
//                                           >
//                                             Product Title
//                                           </th>
//                                           <th
//                                             scope="col"
//                                             className="px-6 py-3 whitespace-nowrap"
//                                           >
//                                             Image
//                                           </th>
//                                           <th
//                                             scope="col"
//                                             className="px-6 py-3 whitespace-nowrap"
//                                           >
//                                             Quantity
//                                           </th>
//                                           <th
//                                             scope="col"
//                                             className="px-6 py-3 whitespace-nowrap"
//                                           >
//                                             Price
//                                           </th>
//                                           <th
//                                             scope="col"
//                                             className="px-6 py-3 whitespace-nowrap"
//                                           >
//                                             Sub Total
//                                           </th>
//                                         </tr>
//                                       </thead>
//                                       <tbody>
//                                         {
//                                           order?.products?.map((item, index) => {
//                                             return (
//                                               <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//                                                 <td className="px-6 py-4 font-[500]">
//                                                   <span className="text-gray-600">
//                                                     {item?._id}
//                                                   </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 font-[500]">
//                                                   <div className="w-[200px]">
//                                                     {item?.productTitle}
//                                                   </div>
//                                                 </td>

//                                                 <td className="px-6 py-4 font-[500]">
//                                                   <img
//                                                     src={item?.image}
//                                                     className="w-[40px] h-[40px] object-cover rounded-md"
//                                                   />
//                                                 </td>

//                                                 <td className="px-6 py-4 font-[500] whitespace-nowrap">
//                                                   {item?.quantity}
//                                                 </td>

//                                                 <td className="px-6 py-4 font-[500]">{item?.price?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>

//                                                 <td className="px-6 py-4 font-[500]">{(item?.price * item?.quantity)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>
//                                               </tr>
//                                             )
//                                           })
//                                         }


//                                         <tr>
//                                           <td
//                                             className="bg-[#f1f1f1]"
//                                             colSpan="12"
//                                           ></td>
//                                         </tr>
//                                       </tbody>
//                                     </table>
//                                   </div>
//                                 </td>
//                               </tr>
//                             )}
//                           </>
//                         )
//                       })

//                     }






//                   </tbody>
//                 </table>
//               </div>


//               {
//                 orders?.totalPages > 1 &&
//                 <div className="flex items-center justify-center mt-10">
//                   <Pagination
//                     showFirstButton showLastButton
//                     count={orders?.totalPages}
//                     page={page}
//                     onChange={(e, value) => setPage(value)}
//                   />
//                 </div>
//               }
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Orders;

//user side code
import React, { useEffect, useState } from "react";
import AccountSidebar from "../../components/AccountSidebar";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import { FaAngleDown, FaAngleUp, FaTrash } from "react-icons/fa6";
import Badge from "../../components/Badge";
import { fetchDataFromApi } from "../../utils/api";
import Pagination from "@mui/material/Pagination";
const apiUrl = import.meta.env.VITE_API_URL;

const Orders = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);

  // Modal control
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [selectedOrderForFiles, setSelectedOrderForFiles] = useState(null);
  const [userFiles, setUserFiles] = useState([]);
  const [adminFiles, setAdminFiles] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]); // new files selected by user
  const [loading, setLoading] = useState(false);

  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };

  useEffect(() => {
    fetchDataFromApi(`/api/order/order-list/orders?page=${page}&limit=5`).then((res) => {
      if (res?.error === false) {
        setOrders(res);
      }
    });
  }, [page]);

  // Open modal and set files for a given order
  const openFileModal = (order) => {
    setSelectedOrderForFiles(order);
    setUserFiles(order.userFiles || []);
    setAdminFiles(order.adminFiles || []);
    setFilesToUpload([]);
    setFileModalOpen(true);
  };

  const closeFileModal = () => {
    setFileModalOpen(false);
    setSelectedOrderForFiles(null);
    setUserFiles([]);
    setAdminFiles([]);
    setFilesToUpload([]);
  };

  // Handle new file selection
  const onFilesSelected = (e) => {
    setFilesToUpload(Array.from(e.target.files));
  };

  // Upload new files to backend
  const uploadFiles = async () => {
    if (!selectedOrderForFiles || filesToUpload.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    filesToUpload.forEach(file => formData.append("files", file));
    formData.append("orderId", selectedOrderForFiles._id);
    formData.append("uploaderType", "user");

    try {
      const res = await fetch(`${apiUrl}/api/order/upload-order-files`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        // Update local state with new files
        setUserFiles(data.order.userFiles || []);
        // Optionally update main orders list as well
        setOrders(prevOrders => {
          const newData = prevOrders.data.map(o => o._id === selectedOrderForFiles._id ? data.order : o);
          return { ...prevOrders, data: newData };
        });
        setFilesToUpload([]);
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed, see console.");
    }
    setLoading(false);
  };

  // Delete file handler
  const deleteFile = async (fileUrl, fileType) => {
    if (context?.userData?.role !== "ADMIN") {
      context.alertBox("error", "Only admin can delete files");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      context.setProgress(50);
      const res = await fetch(`${apiUrl}/api/order/delete-file`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl,
          fileType,
          orderId: selectedOrderForFiles?._id,
        }),
      });

      const result = await res.json();

      if (result.success) {
        context.alertBox("success", "File deleted successfully");

        // Update local file states
        if (fileType === "admin") {
          setAdminFiles(prev => prev.filter(f => f.fileUrl !== fileUrl));
        } else {
          setUserFiles(prev => prev.filter(f => f.fileUrl !== fileUrl));
        }

        // Update ordersData
        setOrdersData(prev =>
          prev.map(order =>
            order._id === selectedOrderForFiles._id
              ? {
                ...order,
                [`${fileType}Files`]: order[`${fileType}Files`].filter(f => f.fileUrl !== fileUrl),
              }
              : order
          )
        );

        // Optionally re-fetch for consistency
        fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
          if (res?.error === false) {
            setOrdersData(res?.data);
          }
        });
      } else {
        context.alertBox("error", result.message || "File deletion failed");
      }
    } catch (error) {
      context.alertBox("error", "Failed to delete file: " + error.message);
    } finally {
      context.setProgress(100);
    }
  };
  

  return (
    <section className="py-5 lg:py-10 w-full">
      <div className="container flex flex-col lg:flex-row gap-5">
        <div className="col1 w-[20%] hidden lg:block">
          <AccountSidebar />
        </div>

        <div className="col2 w-full lg:w-[80%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="py-5 px-5 border-b border-[rgba(0,0,0,0.1)]">
              <h2>My Orders</h2>
              <p className="mt-0 mb-0">
                There are <span className="font-bold text-primary">{orders?.data?.length}</span> orders
              </p>

              <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">&nbsp;</th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Order Id</th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Payment Id</th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Name</th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Phone Number</th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Address</th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Pincode</th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Total Amount</th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Email</th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">User Id</th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Order Status</th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Date</th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">User Files</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.data?.length !== 0 && orders?.data?.map((order, index) => (
                      <React.Fragment key={order._id}>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-6 py-4 font-[500]">
                            <Button
                              className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
                              onClick={() => isShowOrderdProduct(index)}
                            >
                              {isOpenOrderdProduct === index
                                ? <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                                : <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />}
                            </Button>
                          </td>
                          <td className="px-6 py-4 font-[500]">
                            <span className="text-primary">{order?._id}</span>
                          </td>
                          <td className="px-6 py-4 font-[500]">
                            <span className="text-primary whitespace-nowrap text-[13px]">{order?.paymentId || 'CASH ON DELIVERY'}</span>
                          </td>
                          <td className="px-6 py-4 font-[500] whitespace-nowrap">{order?.userId?.name}</td>
                          <td className="px-6 py-4 font-[500]">{order?.delivery_address?.mobile}</td>
                          <td className="px-6 py-4 font-[500]">
                            <span className='inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md'>{order?.delivery_address?.addressType}</span>
                            <span className="block w-[400px]">
                              {order?.delivery_address?.address_line1 + " " + order?.delivery_address?.city + " " + order?.delivery_address?.landmark + " " + order?.delivery_address?.state + " " + order?.delivery_address?.country}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-[500]">{order?.delivery_address?.pincode}</td>
                          <td className="px-6 py-4 font-[500]">{order?.totalAmt}</td>
                          <td className="px-6 py-4 font-[500]">{order?.userId?.email}</td>
                          <td className="px-6 py-4 font-[500]">
                            <span className="text-primary">{order?.userId?._id}</span>
                          </td>
                          <td className="px-6 py-4 font-[500]">
                            <Badge status={order?.order_status} />
                          </td>
                          <td className="px-6 py-4 font-[500] whitespace-nowrap">{order?.createdAt?.split("T")[0]}</td>
                          <td className="px-6 py-4 font-[500]">
                            {/* Upload/Edit button */}
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => openFileModal(order)}
                            >
                              {order.userFiles?.length > 0 ? "Edit Files" : "Upload Files"}
                            </Button>
                          </td>
                        </tr>

                        {/* Expanded products row */}
                        {isOpenOrderdProduct === index && (
                          <tr>
                            <td className="pl-20" colSpan="13">
                              <div className="relative overflow-x-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Product Id</th>
                                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Product Title</th>
                                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Image</th>
                                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Quantity</th>
                                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Price</th>
                                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Sub Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order?.products?.map((item, i) => (
                                      <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4 font-[500]"><span className="text-gray-600">{item?._id}</span></td>
                                        <td className="px-6 py-4 font-[500]"><div className="w-[200px]">{item?.productTitle}</div></td>
                                        <td className="px-6 py-4 font-[500]"><img src={item?.image} className="w-[40px] h-[40px] object-cover rounded-md" /></td>
                                        <td className="px-6 py-4 font-[500] whitespace-nowrap">{item?.quantity}</td>
                                        <td className="px-6 py-4 font-[500]">{item?.price?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>
                                        <td className="px-6 py-4 font-[500]">{(item?.price * item?.quantity)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>
                                      </tr>
                                    ))}
                                    <tr><td className="bg-[#f1f1f1]" colSpan="12"></td></tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {orders?.totalPages > 1 && (
                <div className="flex items-center justify-center mt-10">
                  <Pagination
                    showFirstButton
                    showLastButton
                    count={orders?.totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for upload/edit files */}
      <Dialog open={fileModalOpen} onClose={closeFileModal} fullWidth maxWidth="md">
        <DialogTitle>Upload / Edit Files for Order: {selectedOrderForFiles?._id}</DialogTitle>
        <DialogContent dividers>
          {/* Show admin files (read-only) */}
          <div>
            <h4>Admin Files (View Only):</h4>
            {adminFiles.length === 0 && <p>No admin files uploaded.</p>}
            <ul>
              {adminFiles.map((file, i) => (
                <li key={i}>
                  <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">{file.fileName || "File " + (i + 1)}</a>
                </li>
              ))}
            </ul>
          </div>

          <hr className="my-4" />

          {/* Show user files with delete option */}
          <div>
            <h4>Your Uploaded Files:</h4>
            {userFiles.length === 0 && <p>No files uploaded yet.</p>}
            <ul>
              {userFiles.map((file, i) => (
                <li key={i} className="flex items-center gap-2">
                  <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">{file.fileName || "File " + (i + 1)}</a>
                  <IconButton size="small" onClick={() => deleteFile(file.fileUrl, "user")} color="error" title="Delete File">
                    <FaTrash />
                  </IconButton>
                </li>
              ))}
            </ul>
          </div>

          <hr className="my-4" />

          {/* File input for new uploads */}
          <div>
            <input type="file" multiple onChange={onFilesSelected} />
            {filesToUpload.length > 0 && (
              <div>
                <p>Files to upload:</p>
                <ul>
                  {filesToUpload.map((file, i) => <li key={i}>{file.name}</li>)}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFileModal} disabled={loading}>Cancel</Button>
          <Button onClick={uploadFiles} disabled={loading || filesToUpload.length === 0} variant="contained" color="primary">
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default Orders;
