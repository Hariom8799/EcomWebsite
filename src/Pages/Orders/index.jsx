// //user side code
// import React, { useEffect, useState } from "react";
// import AccountSidebar from "../../components/AccountSidebar";
// import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
// import { FaAngleDown, FaAngleUp, FaTrash } from "react-icons/fa6";
// import Badge from "../../components/Badge";
// import { fetchDataFromApi } from "../../utils/api";
// import Pagination from "@mui/material/Pagination";
// const apiUrl = import.meta.env.VITE_API_URL;

// const Orders = () => {
//   const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [page, setPage] = useState(1);

//   // Modal control
//   const [fileModalOpen, setFileModalOpen] = useState(false);
//   const [selectedOrderForFiles, setSelectedOrderForFiles] = useState(null);
//   const [userFiles, setUserFiles] = useState([]);
//   const [adminFiles, setAdminFiles] = useState([]);
//   const [filesToUpload, setFilesToUpload] = useState([]); // new files selected by user
//   const [loading, setLoading] = useState(false);

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
//         setOrders(res);
//       }
//     });
//   }, [page]);

//   // Open modal and set files for a given order
//   const openFileModal = (order) => {
//     setSelectedOrderForFiles(order);
//     setUserFiles(order.userFiles || []);
//     setAdminFiles(order.adminFiles || []);
//     setFilesToUpload([]);
//     setFileModalOpen(true);
//   };

//   const closeFileModal = () => {
//     setFileModalOpen(false);
//     setSelectedOrderForFiles(null);
//     setUserFiles([]);
//     setAdminFiles([]);
//     setFilesToUpload([]);
//   };

//   // Handle new file selection
//   const onFilesSelected = (e) => {
//     setFilesToUpload(Array.from(e.target.files));
//   };

//   // Upload new files to backend
//   const uploadFiles = async () => {
//     if (!selectedOrderForFiles || filesToUpload.length === 0) return;

//     setLoading(true);
//     const formData = new FormData();
//     filesToUpload.forEach(file => formData.append("files", file));
//     formData.append("orderId", selectedOrderForFiles._id);
//     formData.append("uploaderType", "user");

//     try {
//       const res = await fetch(`${apiUrl}/api/order/upload-order-files`, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       if (data.success) {
//         // Update local state with new files
//         setUserFiles(data.order.userFiles || []);
//         // Optionally update main orders list as well
//         setOrders(prevOrders => {
//           const newData = prevOrders.data.map(o => o._id === selectedOrderForFiles._id ? data.order : o);
//           return { ...prevOrders, data: newData };
//         });
//         setFilesToUpload([]);
//       } else {
//         alert("Upload failed: " + data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed, see console.");
//     }
//     setLoading(false);
//   };

//   // Delete file handler
//   const deleteFile = async (fileUrl, fileType) => {
//     if (context?.userData?.role !== "ADMIN") {
//       context.alertBox("error", "Only admin can delete files");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to delete this file?")) return;

//     try {
//       context.setProgress(50);
//       const res = await fetch(`${apiUrl}/api/order/delete-file`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           fileUrl,
//           fileType,
//           orderId: selectedOrderForFiles?._id,
//         }),
//       });

//       const result = await res.json();

//       if (result.success) {
//         context.alertBox("success", "File deleted successfully");

//         // Update local file states
//         if (fileType === "admin") {
//           setAdminFiles(prev => prev.filter(f => f.fileUrl !== fileUrl));
//         } else {
//           setUserFiles(prev => prev.filter(f => f.fileUrl !== fileUrl));
//         }

//         // Update ordersData
//         setOrdersData(prev =>
//           prev.map(order =>
//             order._id === selectedOrderForFiles._id
//               ? {
//                 ...order,
//                 [`${fileType}Files`]: order[`${fileType}Files`].filter(f => f.fileUrl !== fileUrl),
//               }
//               : order
//           )
//         );

//         // Optionally re-fetch for consistency
//         fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
//           if (res?.error === false) {
//             setOrdersData(res?.data);
//           }
//         });
//       } else {
//         context.alertBox("error", result.message || "File deletion failed");
//       }
//     } catch (error) {
//       context.alertBox("error", "Failed to delete file: " + error.message);
//     } finally {
//       context.setProgress(100);
//     }
//   };
  

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
//                 There are <span className="font-bold text-primary">{orders?.data?.length}</span> orders
//               </p>

//               <div className="relative overflow-x-auto mt-5">
//                 <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//                   <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                     <tr>
//                       <th scope="col" className="px-6 py-3">&nbsp;</th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Order Id</th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Payment Id</th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Name</th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Phone Number</th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Address</th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Pincode</th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Total Amount</th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Email</th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">User Id</th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Order Status</th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Date</th>
//                       <th scope="col" className="px-6 py-3 whitespace-nowrap">User Files</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders?.data?.length !== 0 && orders?.data?.map((order, index) => (
//                       <React.Fragment key={order._id}>
//                         <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//                           <td className="px-6 py-4 font-[500]">
//                             <Button
//                               className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
//                               onClick={() => isShowOrderdProduct(index)}
//                             >
//                               {isOpenOrderdProduct === index
//                                 ? <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" />
//                                 : <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />}
//                             </Button>
//                           </td>
//                           <td className="px-6 py-4 font-[500]">
//                             <span className="text-primary">{order?._id}</span>
//                           </td>
//                           <td className="px-6 py-4 font-[500]">
//                             <span className="text-primary whitespace-nowrap text-[13px]">{order?.paymentId || 'CASH ON DELIVERY'}</span>
//                           </td>
//                           <td className="px-6 py-4 font-[500] whitespace-nowrap">{order?.userId?.name}</td>
//                           <td className="px-6 py-4 font-[500]">{order?.delivery_address?.mobile}</td>
//                           <td className="px-6 py-4 font-[500]">
//                             <span className='inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md'>{order?.delivery_address?.addressType}</span>
//                             <span className="block w-[400px]">
//                               {order?.delivery_address?.address_line1 + " " + order?.delivery_address?.city + " " + order?.delivery_address?.landmark + " " + order?.delivery_address?.state + " " + order?.delivery_address?.country}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 font-[500]">{order?.delivery_address?.pincode}</td>
//                           <td className="px-6 py-4 font-[500]">{order?.totalAmt}</td>
//                           <td className="px-6 py-4 font-[500]">{order?.userId?.email}</td>
//                           <td className="px-6 py-4 font-[500]">
//                             <span className="text-primary">{order?.userId?._id}</span>
//                           </td>
//                           <td className="px-6 py-4 font-[500]">
//                             <Badge status={order?.order_status} />
//                           </td>
//                           <td className="px-6 py-4 font-[500] whitespace-nowrap">{order?.createdAt?.split("T")[0]}</td>
//                           <td className="px-6 py-4 font-[500]">
//                             {/* Upload/Edit button */}
//                             <Button
//                               variant="outlined"
//                               size="small"
//                               onClick={() => openFileModal(order)}
//                             >
//                               {order.userFiles?.length > 0 ? "Edit Files" : "Upload Files"}
//                             </Button>
//                           </td>
//                         </tr>

//                         {/* Expanded products row */}
//                         {isOpenOrderdProduct === index && (
//                           <tr>
//                             <td className="pl-20" colSpan="13">
//                               <div className="relative overflow-x-auto">
//                                 <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//                                   <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                                     <tr>
//                                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Product Id</th>
//                                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Product Title</th>
//                                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Image</th>
//                                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Quantity</th>
//                                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Price</th>
//                                       <th scope="col" className="px-6 py-3 whitespace-nowrap">Sub Total</th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     {order?.products?.map((item, i) => (
//                                       <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//                                         <td className="px-6 py-4 font-[500]"><span className="text-gray-600">{item?._id}</span></td>
//                                         <td className="px-6 py-4 font-[500]"><div className="w-[200px]">{item?.productTitle}</div></td>
//                                         <td className="px-6 py-4 font-[500]"><img src={item?.image} className="w-[40px] h-[40px] object-cover rounded-md" /></td>
//                                         <td className="px-6 py-4 font-[500] whitespace-nowrap">{item?.quantity}</td>
//                                         <td className="px-6 py-4 font-[500]">{item?.price?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>
//                                         <td className="px-6 py-4 font-[500]">{(item?.price * item?.quantity)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>
//                                       </tr>
//                                     ))}
//                                     <tr><td className="bg-[#f1f1f1]" colSpan="12"></td></tr>
//                                   </tbody>
//                                 </table>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {orders?.totalPages > 1 && (
//                 <div className="flex items-center justify-center mt-10">
//                   <Pagination
//                     showFirstButton
//                     showLastButton
//                     count={orders?.totalPages}
//                     page={page}
//                     onChange={(e, value) => setPage(value)}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal for upload/edit files */}
//       <Dialog open={fileModalOpen} onClose={closeFileModal} fullWidth maxWidth="md">
//         <DialogTitle>Upload / Edit Files for Order: {selectedOrderForFiles?._id}</DialogTitle>
//         <DialogContent dividers>
//           {/* Show admin files (read-only) */}
//           <div>
//             <h4>Admin Files (View Only):</h4>
//             {adminFiles.length === 0 && <p>No admin files uploaded.</p>}
//             <ul>
//               {adminFiles.map((file, i) => (
//                 <li key={i}>
//                   <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">{file.fileName || "File " + (i + 1)}</a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <hr className="my-4" />

//           {/* Show user files with delete option */}
//           <div>
//             <h4>Your Uploaded Files:</h4>
//             {userFiles.length === 0 && <p>No files uploaded yet.</p>}
//             <ul>
//               {userFiles.map((file, i) => (
//                 <li key={i} className="flex items-center gap-2">
//                   <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">{file.fileName || "File " + (i + 1)}</a>
//                   <IconButton size="small" onClick={() => deleteFile(file.fileUrl, "user")} color="error" title="Delete File">
//                     <FaTrash />
//                   </IconButton>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <hr className="my-4" />

//           {/* File input for new uploads */}
//           <div>
//             <input type="file" multiple onChange={onFilesSelected} />
//             {filesToUpload.length > 0 && (
//               <div>
//                 <p>Files to upload:</p>
//                 <ul>
//                   {filesToUpload.map((file, i) => <li key={i}>{file.name}</li>)}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={closeFileModal} disabled={loading}>Cancel</Button>
//           <Button onClick={uploadFiles} disabled={loading || filesToUpload.length === 0} variant="contained" color="primary">
//             {loading ? "Uploading..." : "Upload"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </section>
//   );
// };

// export default Orders;

//Enhanced user side code
import React, { useEffect, useState, useContext } from "react";
import AccountSidebar from "../../components/AccountSidebar";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  Box,
  Typography,
  Divider,
  Tab,
  Tabs
} from "@mui/material";
import {
  FaAngleDown,
  FaAngleUp,
  FaTrash,
  FaDownload,
  FaFolder,
  FaFile,
  FaPlus,
  FaEye
} from "react-icons/fa6";
import Badge from "../../components/Badge";
import { fetchDataFromApi } from "../../utils/api";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App.jsx";
import { FiDownload } from "react-icons/fi";
const apiUrl = import.meta.env.VITE_API_URL;

const Orders = () => {
  const context = useContext(MyContext);

  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);

  // Enhanced file management states
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [selectedOrderForFiles, setSelectedOrderForFiles] = useState(null);
  const [userFiles, setUserFiles] = useState([]);
  const [adminFiles, setAdminFiles] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [loading, setLoading] = useState(false);

  // New states for enhanced functionality
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 for client files, 1 for admin files
  const [availableFolders, setAvailableFolders] = useState([]);

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

  // Enhanced file modal opening function
  const openFileModal = (order) => {
    setSelectedOrderForFiles(order);
    setUserFiles(order.userFiles || []);
    setAdminFiles(order.adminFiles || []);
    setFilesToUpload([]);

    // Extract available folders from existing user files (only user can create folders for their files)
    const userFilesFolders = (order.userFiles || []).map(file => file.folderName).filter(Boolean);
    const folders = [...new Set(userFilesFolders)];
    setAvailableFolders(folders);

    setFileModalOpen(true);
  };

  const closeFileModal = () => {
    setFileModalOpen(false);
    setSelectedOrderForFiles(null);
    setUserFiles([]);
    setAdminFiles([]);
    setFilesToUpload([]);
    setSelectedFolder("");
    setNewFolderName("");
    setShowNewFolderInput(false);
    setAvailableFolders([]);
    setActiveTab(0);
  };

  const onFilesSelected = (e) => {
    setFilesToUpload(Array.from(e.target.files));
  };

  const createNewFolder = () => {
    if (newFolderName.trim()) {
      setAvailableFolders(prev => [...prev, newFolderName.trim()]);
      setSelectedFolder(newFolderName.trim());
      setNewFolderName("");
      setShowNewFolderInput(false);
    }
  };

  const uploadFiles = async () => {
    if (!selectedOrderForFiles || filesToUpload.length === 0) return;

    if (!selectedFolder && !showNewFolderInput) {
      context?.alertBox ? context.alertBox("error", "Please select a folder or create a new one") : alert("Please select a folder or create a new one");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    filesToUpload.forEach(file => formData.append("files", file));
    formData.append("orderId", selectedOrderForFiles._id);
    formData.append("uploaderType", "user");
    formData.append("folderName", selectedFolder);

    try {
      const res = await fetch(`${apiUrl}/api/order/upload-order-files`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        context?.alertBox ? context.alertBox("success", "Files uploaded successfully") : alert("Files uploaded successfully");
        setUserFiles(data.order.userFiles || []);

        // Update available folders
        const userFilesFolders = (data.order.userFiles || []).map(file => file.folderName).filter(Boolean);
        const folders = [...new Set(userFilesFolders)];
        setAvailableFolders(folders);

        setOrders(prevOrders => {
          const newData = prevOrders.data.map(o => o._id === selectedOrderForFiles._id ? data.order : o);
          return { ...prevOrders, data: newData };
        });
        setFilesToUpload([]);
        setSelectedFolder("");

        // Refetch for consistency
        fetchDataFromApi(`/api/order/order-list/orders?page=${page}&limit=5`).then((res) => {
          if (res?.error === false) {
            setOrders(res);
          }
        });
      } else {
        context?.alertBox ? context.alertBox("error", data?.message || "Upload failed") : alert("Upload failed: " + data?.message);
      }
    } catch (error) {
      context?.alertBox ? context.alertBox("error", "Upload failed: " + error.message) : alert("Upload failed: " + error.message);
    }
    setLoading(false);
  };

  const deleteFile = async (fileUrl, fileType) => {
    // Only allow users to delete their own files
    if (fileType !== "user") {
      context?.alertBox ? context.alertBox("error", "You can only delete your own files") : alert("You can only delete your own files");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      context?.setProgress ? context.setProgress(50) : null;
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
        context?.alertBox ? context.alertBox("success", "File deleted successfully") : alert("File deleted successfully");

        setUserFiles(prev => prev.filter(f => f.fileUrl !== fileUrl));

        setOrders(prev => ({
          ...prev,
          data: prev.data.map(order =>
            order._id === selectedOrderForFiles._id
              ? {
                ...order,
                userFiles: order.userFiles.filter(f => f.fileUrl !== fileUrl),
              }
              : order
          )
        }));

        fetchDataFromApi(`/api/order/order-list/orders?page=${page}&limit=5`).then((res) => {
          if (res?.error === false) {
            setOrders(res);
          }
        });
      } else {
        context?.alertBox ? context.alertBox("error", result.message || "File deletion failed") : alert("File deletion failed");
      }
    } catch (error) {
      context?.alertBox ? context.alertBox("error", "Failed to delete file: " + error.message) : alert("Failed to delete file: " + error.message);
    } finally {
      context?.setProgress ? context.setProgress(100) : null;
    }
  };

  const downloadAllProductFiles = async (productId) => {
    try {
      const response = await fetch(`${apiUrl}/api/product/download-all-files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ProductId: productId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        context.alertBox('error', errorData.message || 'Download failed');
        return;
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `product_files_${productId}.zip`;

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      context.alertBox('success', 'Files downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      context.alertBox('error', 'Download failed');
    }
  };

  const downloadAllFiles = async (fileType) => {
    try {
      const files = fileType === 'user' ? userFiles : adminFiles;
      if (files.length === 0) {
        context?.alertBox ? context.alertBox("warning", `No ${fileType} files to download`) : alert(`No ${fileType} files to download`);
        return;
      }

      context?.setProgress ? context.setProgress(50) : null;
      const response = await fetch(`${apiUrl}/api/order/download-all-files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrderForFiles._id,
          fileType: fileType
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileType}_files_${selectedOrderForFiles._id}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        context?.alertBox ? context.alertBox("success", `${fileType} files downloaded successfully`) : alert(`${fileType} files downloaded successfully`);
      } else {
        context?.alertBox ? context.alertBox("error", "Failed to download files") : alert("Failed to download files");
      }
    } catch (error) {
      context?.alertBox ? context.alertBox("error", "Download failed: " + error.message) : alert("Download failed: " + error.message);
    } finally {
      context?.setProgress ? context.setProgress(100) : null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupFilesByFolder = (files) => {
    return files.reduce((acc, file) => {
      const folder = file.folderName || 'Uncategorized';
      if (!acc[folder]) {
        acc[folder] = [];
      }
      acc[folder].push(file);
      return acc;
    }, {});
  };

  const renderFileTable = (files, fileType) => {
    const groupedFiles = groupFilesByFolder(files);
    const isUserFiles = fileType === 'user';

    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {isUserFiles ? 'Your Files' : 'Admin Files'} ({files.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<FaDownload />}
            onClick={() => downloadAllFiles(fileType)}
            disabled={files.length === 0}
            size="small"
          >
            Download All
          </Button>
        </Box>

        {Object.keys(groupedFiles).map(folderName => (
          <Box key={folderName} mb={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <FaFolder style={{ marginRight: 8, color: isUserFiles ? '#1976d2' : '#ff9800' }} />
              <Typography variant="subtitle1" fontWeight="bold">
                {folderName}
              </Typography>
              <Chip
                label={groupedFiles[folderName].length}
                size="small"
                sx={{ ml: 1 }}
                color={isUserFiles ? "primary" : "secondary"}
              />
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell>Uploaded At</TableCell>
                    <TableCell>Uploaded By</TableCell>
                    <TableCell>Version</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedFiles[folderName].map((file, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <FaFile style={{ marginRight: 8, color: '#666' }} />
                          {file.fileName || `File ${index + 1}`}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<FaEye />}
                          onClick={() => window.open(file.fileUrl, '_blank')}
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell>
                        {file.uploadedAt ? formatDate(file.uploadedAt) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={file.uploadedBy || 'Unknown'}
                          size="small"
                          color={file.uploadedBy === 'admin' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`v${file.fileVersion || 1}`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={() => window.open(file.fileUrl, '_blank')}
                          >
                            <FaDownload />
                          </IconButton>
                        </Tooltip>
                        {/* Only show delete option for user's own files */}
                        {isUserFiles && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => deleteFile(file.fileUrl, fileType)}
                            >
                              <FaTrash />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        {files.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography color="textSecondary">
              No {isUserFiles ? 'files uploaded by you' : 'admin files'} yet
            </Typography>
          </Box>
        )}
      </Box>
    );
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
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Files</th>
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
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => openFileModal(order)}
                              startIcon={<FaFile />}
                            >
                              Files ({(order.adminFiles?.length || 0) + (order.userFiles?.length || 0)})
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
                                      <th scope="col" className="px-6 py-3 whitespace-nowrap">Files</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order?.products?.map((item, i) => (
                                      <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4 font-[500]"><span className="text-gray-600">{item?.productId}</span></td>
                                        <td className="px-6 py-4 font-[500]"><div className="w-[200px]">{item?.productTitle}</div></td>
                                        <td className="px-6 py-4 font-[500]"><img src={item?.image} className="w-[40px] h-[40px] object-cover rounded-md" /></td>
                                        <td className="px-6 py-4 font-[500] whitespace-nowrap">{item?.quantity}</td>
                                        <td className="px-6 py-4 font-[500]">{item?.price?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>
                                        <td className="px-6 py-4 font-[500]">{(item?.price * item?.quantity)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>
                                        <td className="px-6 py-4 font-[500]"><Button
                                                                                className={`!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#c2c2c2] !min-w-[35px]`}
                                          onClick={() => downloadAllProductFiles(item?.productId)}
                                                                                title="Download all files"
                                                                                // disabled={!product?.files || product?.files.length === 0}
                                                                              >
                                                                                <FiDownload className=" text-gray-700 dark:text-[rgba(255,255,255,0.7)] text-[18px]" />
                                                                              </Button></td>
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

      {/* Enhanced File Management Modal */}
      <Dialog open={fileModalOpen} onClose={closeFileModal} fullWidth maxWidth="lg">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              File Management - Order: {selectedOrderForFiles?._id}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box mb={3}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label={`Your Files (${userFiles.length})`} />
              <Tab label={`Admin Files (${adminFiles.length})`} />
            </Tabs>
          </Box>

          {activeTab === 0 && renderFileTable(userFiles, 'user')}
          {activeTab === 1 && renderFileTable(adminFiles, 'admin')}

          <Divider sx={{ my: 3 }} />

          {/* File Upload Section - Only for User Files */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" mb={2}>Upload New Files</Typography>

              <Box mb={2}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Select Folder</InputLabel>
                  <Select
                    value={selectedFolder}
                    label="Select Folder"
                    onChange={(e) => setSelectedFolder(e.target.value)}
                  >
                    {availableFolders.map(folder => (
                      <MenuItem key={folder} value={folder}>
                        <Box display="flex" alignItems="center">
                          <FaFolder style={{ marginRight: 8 }} />
                          {folder}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  startIcon={<FaPlus />}
                  onClick={() => setShowNewFolderInput(true)}
                  variant="outlined"
                  size="small"
                >
                  Create New Folder
                </Button>
              </Box>

              {showNewFolderInput && (
                <Box display="flex" gap={1} mb={2}>
                  <TextField
                    size="small"
                    placeholder="Enter folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    fullWidth
                  />
                  <Button onClick={createNewFolder} variant="contained" size="small">
                    Create
                  </Button>
                  <Button onClick={() => setShowNewFolderInput(false)} size="small">
                    Cancel
                  </Button>
                </Box>
              )}

              <input
                type="file"
                multiple
                onChange={onFilesSelected}
                style={{ marginBottom: 16 }}
              />

              {filesToUpload.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" mb={1}>Files to upload:</Typography>
                  <Box>
                    {filesToUpload.map((file, i) => (
                      <Chip
                        key={i}
                        label={file.name}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Read-only message for Admin Files tab */}
          {activeTab === 1 && (
            <Box textAlign="center" py={2}>
              <Typography variant="body2" color="textSecondary">
                Admin files are read-only. You can view and download them but cannot modify or delete them.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeFileModal} disabled={loading}>
            Close
          </Button>
          {/* Only show upload button when on user files tab */}
          {activeTab === 0 && (
            <Button
              onClick={uploadFiles}
              disabled={loading || filesToUpload.length === 0 || !selectedFolder}
              variant="contained"
              color="primary"
            >
              {loading ? "Uploading..." : "Upload Files"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default Orders;