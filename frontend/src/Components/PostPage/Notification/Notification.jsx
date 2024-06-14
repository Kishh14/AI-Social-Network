import React, { useEffect, useState } from "react";
import { MdOutlineCircleNotifications } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import "./Notification.css"; // Import your CSS file for styles

const Notification = ({ socket }) => {
  const isValidJson = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (typeof data === "object" && data !== null) {
        return data;
      }
    } catch (error) {
      console.error("Invalid JSON in sessionStorage");
    }
    return null;
  };
  const [notifications, setNotifications] = useState(
    isValidJson(sessionStorage.getItem("notifications")) || []
  );

  useEffect(() => {
    const handleMessageResponse = (message) => {
      const updatedNotifications = [...notifications, message];
      setNotifications(updatedNotifications);
      sessionStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    };

    socket.on("messageResponse", handleMessageResponse);

    return () => {
      socket.off("messageResponse", handleMessageResponse);
    };
  }, [notifications, socket]);

  const deleteNotification = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
    sessionStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
    sessionStorage.removeItem("notifications");
  };

  return (
    <div className="p-2 mb-3 ml-4">
      <div className="flex items-center mb-3 cursor-pointer ml-4">
        <MdOutlineCircleNotifications className="text-white mr-2 sticky top-0" size={26} />
        <p className="text-white" style={{ fontSize: "20px" }}>
          Notifications
        </p>
        {notifications.length > 0 && (
          <button
            className="ml-auto text-white px-2 py-1 rounded"
            onClick={deleteAllNotifications}
          >
            <IoMdClose className="text-red-300" />
          </button>
        )}
      </div>
      {notifications.length > 0 ? (
        <>
          <div className="relative bottom-[55px] left-[170px] bg-blue-500 w-10 h-10 p-2 text-center rounded-full">
            <p className="text-white">{notifications.length}</p>
          </div>
          <div className="ml-5 text-white mb-2">
            {notifications.map((notification, i) => (
              <div
                key={i}
                className="bg-yellow-300 text-black rounded-md p-2 mt-2 flex justify-between items-center"
              >
                <p>
                  A new message from <strong>{notification.name}</strong>: {notification.text}
                </p>
                <button
                  className=" text-white px-2 py-1 rounded"
                  onClick={() => deleteNotification(i)}
                >
                  <IoMdClose className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="ml-5 text-white mb-2">No new notifications</p>
      )}
    </div>
  );
};

export default Notification;
