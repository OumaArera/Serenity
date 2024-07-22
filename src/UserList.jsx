// import React, { useState, useEffect } from 'react';
// import CryptoJS from 'crypto-js';
// import axios from 'axios';

// const UserList = ({ userId, userRole, onSelectUser }) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const secretKey = process.env.REACT_APP_SECRET_KEY;

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         // Hardcoded encrypted data for testing
//         const hardcodedEncryptedData = CryptoJS.AES.encrypt(
//           JSON.stringify([
//             { id: 'doctor1', firstName: 'John', lastName: 'Doe', role: 'doctor' },
//             { id: 'doctor2', firstName: 'Jane', lastName: 'Smith', role: 'doctor' },
//             { id: 'patient1', firstName: 'Alice', lastName: 'Johnson', role: 'patient' },
//             { id: 'patient2', firstName: 'Bob', lastName: 'Brown', role: 'patient' },
//           ]),
//           secretKey
//         ).toString();

//         // Simulate API response
//         const response = {
//           message: "Success",
//           data: hardcodedEncryptedData,
//           successfull: true,
//           status_code: 200
//         };

//         if (response.successfull) {
//           const decryptedData = JSON.parse(
//             CryptoJS.AES.decrypt(response.data, secretKey).toString(CryptoJS.enc.Utf8)
//           );
//           setUsers(decryptedData);
//         } else {
//           setError(response.message);
//         }
//       } catch (error) {
//         setError('Error fetching users');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [secretKey]);

//   if (loading) return <div className="text-center mt-4">Loading...</div>;
//   if (error) return <div className="text-center mt-4 text-red-500">Error: {error}</div>;

//   const filteredUsers = users.filter(user => user.role !== userRole);

//   return (
//     <div className="flex flex-col max-w-lg mx-auto p-4 bg-white text-black">
//       {filteredUsers.map(user => (
//         <div 
//           key={user.id} 
//           className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
//           onClick={() => onSelectUser(user)}
//         >
//           <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center mr-2">
//             {user.firstName[0]}
//           </div>
//           <div>
//             <div className="font-semibold">{user.firstName} {user.lastName}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default UserList;
