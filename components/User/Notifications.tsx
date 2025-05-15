"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { getUserNotifications } from "@/controllers/makeRequest";
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";

interface NotificationMessage {
  id: string;
  type: string;
  message: string;
  updated_date: string;
}

export default function Notifications() {
  const { state } = useAuth();
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Notifications component useEffect triggered");
    console.log("Access token available:", !!state.accessToken);

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        console.log("====== FETCHING NOTIFICATIONS ======");
        console.log(
          "Fetching notifications with token:",
          state.accessToken.substring(0, 10) + "..."
        );

        const response = await getUserNotifications(state.accessToken);
        console.log("====== NOTIFICATIONS RESPONSE RECEIVED ======");
        console.log("Raw notifications response:", response);

        if (response.status === 200 && response.data) {
          console.log("Response data type:", typeof response.data);
          console.log(
            "Response data structure:",
            JSON.stringify(response.data, null, 2)
          );

          // Try to determine the structure of the response
          if (Array.isArray(response.data)) {
            console.log(
              "SUCCESS: Data is an array with",
              response.data.length,
              "items"
            );
            setNotifications(response.data);
            console.log("Notifications state updated with array data");
          } else if (
            response.data.results &&
            Array.isArray(response.data.results)
          ) {
            console.log(
              "SUCCESS: Data is in response.data.results with",
              response.data.results.length,
              "items"
            );
            setNotifications(response.data.results);
            console.log("Notifications state updated with results array");
          } else {
            // Try to handle any object structure by checking for common properties
            const possibleDataObjects = [
              response.data.data,
              response.data.messages,
              response.data.notifications,
              response.data.items,
            ];

            let dataFound = false;
            for (const dataObj of possibleDataObjects) {
              if (dataObj && Array.isArray(dataObj)) {
                console.log(
                  "SUCCESS: Found data array in alternative property with",
                  dataObj.length,
                  "items"
                );
                setNotifications(dataObj);
                dataFound = true;
                console.log(
                  "Notifications state updated with alternative data"
                );
                break;
              }
            }

            // If we still couldn't find data, log and set empty
            if (!dataFound) {
              console.warn(
                "WARNING: Unexpected data structure:",
                response.data
              );
              console.warn("Setting empty notifications array");
              setNotifications([]);
            }
          }
          setError(null);
        } else {
          console.error("ERROR: Invalid response:", response);
          throw new Error(
            `Failed to fetch notifications: Status ${response.status}`
          );
        }
      } catch (err: any) {
        console.error("ERROR: Error in fetchNotifications:", err);
        setError(err?.message || "Failed to fetch notifications");
        setNotifications([]);
      } finally {
        setIsLoading(false);
        console.log("====== NOTIFICATIONS FETCH COMPLETED ======");
        console.log("Current notifications state:", notifications);
      }
    };

    if (state.accessToken) {
      console.log("Access token found, calling fetchNotifications");
      fetchNotifications();
    } else {
      console.warn("No access token available, skipping notifications fetch");
      setIsLoading(false); // Set loading to false if not fetching
    }
  }, [state.accessToken]);

  // Helper function to get the appropriate icon and color based on message type
  const getNotificationStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case "error":
        return {
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: <FiAlertTriangle className="h-5 w-5 text-red-500" />,
        };
      case "success":
        return {
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          borderColor: "border-green-200",
          icon: <FiCheckCircle className="h-5 w-5 text-green-500" />,
        };
      case "warning":
        return {
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200",
          icon: <FiAlertTriangle className="h-5 w-5 text-yellow-500" />,
        };
      default:
        return {
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          icon: <FiInfo className="h-5 w-5 text-blue-500" />,
        };
    }
  };

  if (isLoading) {
    return (
      <div className="col-span-12 lg:col-span-9 bg-white rounded-2xl shadow-md">
        <div className="p-4">
          <div className="flex w-full h-64 items-center justify-center">
            <Spinner size="lg" color="primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-12 lg:col-span-9 bg-white rounded-2xl shadow-md">
        <div className="p-4">
          <div className="flex w-full h-64 items-center justify-center text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 lg:col-span-9 bg-white rounded-2xl shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-x-2">
            <div className="h-10 w-10 rounded-full bg-primary-light/20 flex items-center justify-center">
              <IoIosNotificationsOutline size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                پیام‌های سیستم
              </h2>
              <p className="text-xs text-gray-500">
                آخرین اعلان‌ها و پیام‌های سیستم
              </p>
            </div>
          </div>
          {notifications.length > 0 && (
            <span className="px-3 py-1 bg-primary-light/10 rounded-full text-sm font-medium text-primary">
              {notifications.length} پیام
            </span>
          )}
        </div>

        <Card>
          <CardBody>
            {notifications && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const style = getNotificationStyle(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${style.bgColor} ${style.borderColor} relative`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5 ml-3">
                          {style.icon}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${style.textColor}`}
                          >
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {notification.updated_date}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                شما هیچ اعلانی ندارید
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
