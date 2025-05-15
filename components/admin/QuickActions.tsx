"use client";

import { FaAngleLeft, FaCog } from "react-icons/fa";
import Button from "./ui/Button";
import { Divider } from "@heroui/react";
import quickActions from "./data/quickActions";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="p-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">عملیات سریع</h2>
        <button className="flex items-center text-primary text-sm hover:underline">
          تنظیمات
          <FaCog className="mr-1 text-xs" />
        </button>
      </div>

      <Divider />

      <div className="p-4 space-y-4">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="p-3 rounded-md border border-gray-100 hover:border-gray-200 transition"
          >
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full text-white bg-${action.color} ml-3`}
              >
                <action.icon />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-sm">{action.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <Button
                size="sm"
                color={action.color}
                className="w-full justify-between"
                endContent={<FaAngleLeft />}
              >
                {action.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
