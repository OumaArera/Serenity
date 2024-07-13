import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import axios from 'axios';
import UserList from './UserList';
import { FaReply } from 'react-icons/fa'; // Import reply icon

const Chat = ({ userId, userRole }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hardcoded encrypted data for testing
        const hardcodedEncryptedData = CryptoJS.AES.encrypt(
          JSON.stringify([
            {
              message: "Hello!",
              id: "1",
              sender: "Dr. Ouma",
              senderId: "doctor1",
              senderRole: "doctor",
              dateSent: "2024-07-15T10:00:00",
              status: "read",
              recipientId: "patient1",
              replies: [
                {
                  message: "Hi, doctor!",
                  id: "2",
                  senderId: "patient1",
                  sender: "John Doe",
                  senderRole: "patient",
                  dateSent: "2024-07-15T11:00:00",
                  status: "read",
                  recipientId: "doctor1"
                }
              ]
            },
            {
              message: "Reminder for appointment.",
              id: "3",
              sender: "Dr. Ouma",
              senderId: "doctor1",
              senderRole: "doctor",
              dateSent: "2024-07-16T09:00:00",
              status: "unread",
              recipientId: "patient2",
              replies: []
            }
          ]),
          secretKey
        ).toString();

        // Simulate API response
        const response = {
          message: "Success",
          data: hardcodedEncryptedData,
          successfull: true,
          status_code: 200
        };

        if (response.successfull) {
          const decryptedData = JSON.parse(
            CryptoJS.AES.decrypt(response.data, secretKey).toString(CryptoJS.enc.Utf8)
          );
          setMessages(decryptedData);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError('Error fetching messages');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [secretKey]);

  const handleSendReply = async () => {
    if (!replyText) return;
    const newReply = {
      message: replyText,
      id: Date.now().toString(),
      senderId: userId,
      sender: "You",
      senderRole: userRole,
      dateSent: new Date().toISOString(),
      status: "unread",
      recipientId: selectedMessage.senderId
    };
    const encryptedReply = CryptoJS.AES.encrypt(JSON.stringify(newReply), secretKey).toString();
    
    try {
      await axios.put(`/users/reply/${userId}`, { data: encryptedReply }); // Ensure this endpoint is correct
      setSelectedMessage(prev => ({
        ...prev,
        replies: [...prev.replies, newReply]
      }));
      setMessages(prev => prev.map(msg => msg.id === selectedMessage.id ? {
        ...msg,
        replies: [...msg.replies, newReply]
      } : msg));
      setReplyText("");
    } catch (error) {
      setError("Error sending reply");
    }
  };

  const handleSelectUser = async (user) => {
    const newMessage = {
      message: "New conversation started.",
      id: Date.now().toString(),
      sender: "You",
      senderId: userId,
      senderRole: userRole,
      dateSent: new Date().toISOString(),
      status: "unread",
      recipientId: user.id,
      replies: []
    };
    const encryptedMessage = CryptoJS.AES.encrypt(JSON.stringify(newMessage), secretKey).toString();

    try {
      await axios.post('/users/message', { data: encryptedMessage }); // Ensure this endpoint is correct
      setMessages(prev => [newMessage, ...prev]);
      setShowUserList(false);
      setSelectedMessage(newMessage);
    } catch (error) {
      setError("Error starting new conversation");
    }
  };

  const handleStartNewConversation = () => {
    setShowUserList(true);
    setSelectedMessage(null);
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="text-center mt-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col md:flex-row max-w-4xl mx-auto p-4 bg-white text-black">
      <div className="w-full md:w-1/3 border-r-2 border-gray-200 p-2">
        <button 
          className={`w-full p-2 rounded-lg mb-4 ${showUserList ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}
          onClick={handleStartNewConversation}
        >
          Start New Conversation
        </button>
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => {
              setSelectedMessage(msg);
              setShowUserList(false);
            }}
          >
            <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center mr-2">
              {msg.sender[0]}
            </div>
            <div>
              <div className="font-semibold">{msg.sender}</div>
              <div className="text-sm text-gray-600">{msg.message}</div>
            </div>
          </div>
        ))}
      </div>
      {showUserList && (
        <div className="w-full md:w-2/3 p-2 flex flex-col">
          <UserList userId={userId} userRole={userRole} onSelectUser={handleSelectUser} />
        </div>
      )}
      {selectedMessage && !showUserList && (
        <div className="w-full md:w-2/3 p-2 flex flex-col">
          <div className="flex items-center border-b-2 border-gray-200 pb-2 mb-2">
            <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center mr-2">
              {selectedMessage.sender[0]}
            </div>
            <div>
              <div className="font-semibold">{selectedMessage.sender}</div>
              <div className="text-sm text-gray-600">{dayjs(selectedMessage.dateSent).format('MMM D, YYYY h:mm A')}</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="mb-4 bg-gray-100 p-2 rounded">
              <div>{selectedMessage.message}</div>
              <div className="text-xs text-gray-500">{dayjs(selectedMessage.dateSent).format('MMM D, YYYY h:mm A')}</div>
            </div>
            {selectedMessage.replies.map(reply => (
              <div 
                key={reply.id} 
                className={`mb-4 p-2 rounded ${reply.senderRole === 'doctor' ? 'bg-green-100 text-left' : 'bg-blue-100 text-right'}`}
              >
                <div>{reply.message}</div>
                <div className="text-xs text-gray-500">{dayjs(reply.dateSent).format('MMM D, YYYY h:mm A')}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-2 mb-2"
              placeholder="Type your reply..."
            />
            <button 
              onClick={handleSendReply} 
              className="w-full bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center"
            >
              <FaReply className="mr-2" /> Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
