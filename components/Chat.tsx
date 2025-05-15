"use client";

import { useState, useEffect, useRef } from "react";
import { PiUserCircleFill } from "react-icons/pi";
import Image from "next/image";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useAuth } from "@/context/AuthContext";
import mainConfig from "@/configs/mainConfig";
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";

interface Contact {
  chatRoomId: string;
  lastMessage: string;
  lastMessageTime: string;
  newMessageCount: number;
  ElanImage: string;
  title: string;
  receiverProfile?: string;
  receiverName: string;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
}

const WhatsAppClone = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { state, dispatch } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [messages, setMessages] = useState<any>([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [username, setUsername] = useState("");
  const [myAvatar, setMyAvatar] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedContactRef = useRef(selectedContact);
  const socketRef = useRef<WebSocket | null>(null);

  const handleSendEvent = (data: any) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Send a custom event with the user's message
      socket.send(JSON.stringify(data));
    } else {
      console.error("WebSocket is not connected");
      setTimeout(() => handleSendEvent(data), 500);
    }
  };

  const handleUpdateLastMessage = (newMessage: any, chatRoomId: string) => {
    const newContent = {
      lastMessage: newMessage.text,
      lastMessageTime: newMessage.timestamp,
    };

    setContacts((prevList) =>
      prevList.map((item) =>
        item.chatRoomId === chatRoomId ? { ...item, ...newContent } : item
      )
    );
  };

  const handleSendMessage = () => {
    if (!newMessage) return;
    handleSendEvent({
      type: "send-message",
      chat_room_id: selectedContactRef.current?.chatRoomId,
      message: newMessage,
    });
    setNewMessage("");
  };

  const handleSeenMessage = async (newMessage: any) => {
    if (newMessage) {
      handleSendEvent({
        type: "set_message_seen",
        message_id: newMessage.id,
      });
      setMessages((prev: any) =>
        prev.map((item: any) =>
          item.id === newMessage.id ? { ...item, ...{ is_seen: true } } : item
        )
      );
    }
  };

  const markMessageAsSeen = (messageId: any) => {
    console.log("Mark Message As seen", messageId);

    setMessages((prev: any) =>
      prev.map((item: any) =>
        item.id === messageId ? { ...item, ...{ is_seen: true } } : item
      )
    );
  };

  const handleGetNewMessage = (newMessage: any, chat_room_id: string) => {
    setMessages((prevMessages: any) => [...prevMessages, newMessage]);
    if (newMessage.sender !== state.id && !newMessage.is_seen) {
      handleSeenMessage(newMessage);
    }
  };

  useEffect(() => {
    selectedContactRef.current = selectedContact;
    handleSendEvent({
      type: "retrieve-message",
      chat_room_id: selectedContactRef.current?.chatRoomId,
    });
    handleSendEvent({
      type: "is_seen",
      chat_room_id: selectedContactRef.current?.chatRoomId,
    });
  }, [selectedContact]);

  useEffect(() => {
    const ws = new WebSocket(
      `${mainConfig.webSocketServer}${state.accessToken}`
    ); // Replace with your server URL
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data); // Parse JSON data
      // Handle different custom event types
      console.log(message.type);

      switch (message.type) {
        case "chat_rooms":
          setContacts(message.data.rooms);
          setMyAvatar(message.data.userProfileImage);
          setUsername(message.data.userName);
          break;
        case "chat_message":
          handleUpdateLastMessage(message.message, message.chat_room_id);
          if (message.chat_room_id == selectedContactRef.current?.chatRoomId) {
            handleGetNewMessage(message.message, message.chat_room_id);
          }

          break;
        case "retrieve-message":
          setMessages(message.messages);
          const unseenMessages = message.messages.filter(
            (msg: any) => !msg.is_seen && msg.sender !== state.id
          );
          console.log("unseenMessages", unseenMessages);

          if (unseenMessages.length > 0) {
            unseenMessages.forEach((msg: any) => {
              handleSeenMessage(msg);
            });
          }
          break;
        case "seen-message":
          markMessageAsSeen(message.message_id);
          break;

        default:
          console.log("Unknown event:", message.event);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close(); // Close the WebSocket connection
      }
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, [messages]);

  return (
    <div className="flex max-h-[calc(100vh-5rem)] min-h-[70vh] max-w-7xl mx-auto mt-6 shadow-xl rounded-xl overflow-hidden bg-white">
      {/* Contacts List */}
      <div
        className={`w-full lg:w-1/3 md:w-2/5 flex flex-col border-r border-gray-200 ${
          selectedContactRef.current?.chatRoomId ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
          <div className="ml-3">
            {myAvatar ? (
              <Image
                src={`${mainConfig.fileServer}/images/user/${myAvatar}`}
                alt="Profile"
                width={48}
                height={48}
                className="rounded-full ring-2 ring-gray-100"
              />
            ) : (
              <PiUserCircleFill size={48} className="text-gray-400" />
            )}
          </div>
          <div className="font-semibold text-gray-800">{username}</div>
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {contacts?.map((contact, index) => (
            <div
              key={index}
              onClick={() => setSelectedContact(contact)}
              className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gray-100 border-b border-gray-200 ${
                contact.chatRoomId === selectedContactRef.current?.chatRoomId
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "border-l-4 border-transparent"
              }`}
            >
              <div className="relative">
                {contact.receiverProfile ? (
                  <Image
                    src={`${mainConfig.fileServer}/images/user/${contact.receiverProfile}`}
                    alt=""
                    width={56}
                    height={56}
                    className="w-12 h-12 rounded-full bg-gray-200 object-cover ring-2 ring-gray-100"
                  />
                ) : (
                  <PiUserCircleFill size={48} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 truncate mr-2">
                    {contact.receiverName}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {contact.lastMessageTime}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-600 truncate mr-2">
                    {contact.lastMessage}
                  </p>
                  {contact.newMessageCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-medium">
                      {contact.newMessageCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          !selectedContactRef.current?.chatRoomId ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div className="relative ml-3">
                    {selectedContact.receiverProfile ? (
                      <Image
                        src={`${mainConfig.fileServer}/images/user/${selectedContact.receiverProfile}`}
                        alt=""
                        width={56}
                        height={56}
                        className="w-12 h-12 rounded-full bg-gray-200 object-cover ring-2 ring-gray-100"
                      />
                    ) : (
                      <PiUserCircleFill size={48} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {selectedContact.receiverName}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="mr-2 p-2 rounded-full md:hidden hover:bg-gray-100 transition-colors duration-200"
                >
                  <IoMdArrowRoundBack size={24} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Advertisement Info */}
            {(selectedContact.title || selectedContact.ElanImage) && (
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 min-h-[70px]">
                <div className="flex-1 flex items-center h-full">
                  {selectedContact.title && (
                    <div className="text-gray-600 truncate">
                      {selectedContact.title}
                    </div>
                  )}
                </div>
                {selectedContact.ElanImage && (
                  <div className="flex-shrink-0 ml-4">
                    <Image
                      alt={selectedContact.title}
                      src={`${mainConfig.fileServer}/advertisement_gallery/sm/${selectedContact.ElanImage}`}
                      width={80}
                      height={80}
                      className="rounded-lg shadow-sm object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#f0f2f5]">
              {messages.map((message: any, index: number) => (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    message.sender === state.id ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg p-3 shadow-sm ${
                      message.sender === state.id
                        ? "bg-[#dcf8c6] rounded-tr-none"
                        : "bg-white rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm text-gray-800">{message.text}</p>
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span className="text-xs text-gray-500">
                        {message.timestamp}
                      </span>
                      {message.sender === state.id && (
                        <span className="text-gray-500">
                          {message.is_seen ? (
                            <IoCheckmarkDoneSharp className="text-blue-500" />
                          ) : (
                            <IoCheckmarkSharp />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex items-center px-4 py-3 bg-white border-t border-gray-200">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="متن خود را بنویسید ..."
                className="flex-1 py-2.5 px-4 rounded-full bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 h-10 w-10 flex justify-center items-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                disabled={!newMessage.trim()}
              >
                <IoMdArrowRoundBack size={24} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <PiUserCircleFill size={80} className="mx-auto text-gray-300" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                Select a chat to start messaging
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Choose from your existing conversations or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppClone;