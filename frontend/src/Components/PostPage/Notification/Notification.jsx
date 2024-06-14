import { MdNotificationsNone } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import "./Notification.css"; // Import your CSS file for styles

const Notification = ({ socket }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleMessageResponse = (message) => {
      setNotifications((prevNotifications) => [...prevNotifications, message]);
    };

    socket.on("messageResponse", handleMessageResponse);

    return () => {
      socket.off("messageResponse", handleMessageResponse);
    };
  }, [socket]);

  const deleteNotification = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="pb-2 mb-3 relative">
      <div
        className={`flex pr-3 pt-3 z-20 pl-6 sticky top-0 ${
          notifications.length > 4 ? "bg-gray-900" : ""
        } items-center mb-3 pb-3 cursor-pointer`}
      >
        <div className="rounded-circle border-2 mr-4">
          {notifications.length > 0 ? (
            <span className="badge" style={{ fontSize: "13px" }}>
              {notifications.length}
            </span>
          ) : (
            <MdNotificationsNone className="text-white" size={24} />
          )}
        </div>
        <p className="text-white" style={{ fontSize: "20px" }}>
          Notifications
        </p>
        {notifications.length > 0 && (
          <button
            className="ml-auto text-white px-2 py-1 rounded"
            onClick={deleteAllNotifications}
          >
            <IoMdClose className="text-white" />
          </button>
        )}
      </div>
      {notifications.length > 0 ? (
        <>
          <div className="text-white mb-2 mx-3">
            {notifications.map((notification, i) => (
              <div
                key={i}
                className="noti-glass-effect rounded-md p-2 mt-2 flex justify-between items-center"
              >
                <p className="overflow-x-scroll no-scrollbar mr-3">
                  A new message from{" "}
                  <strong className="text-blue-300">{notification.name}</strong>
                  : {notification.text}
                </p>
                <button
                  className="text-white px-2 py-1 rounded"
                  onClick={() => deleteNotification(i)}
                >
                  <IoMdClose className="text-red-100" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="ml-5 text-white mb-2 text-center mt-5">
          No new notifications
        </p>
      )}
    </div>
  );
};

export default Notification;
