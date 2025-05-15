"use client";

import { Button } from "@heroui/react";
import { useState } from "react";

export default function TestButtonPage() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("Button clicked!");
    setCount(count + 1);
    alert("Button clicked!");
  };

  return (
    <div className="p-10 flex flex-col gap-4 items-center">
      <h1 className="text-2xl font-bold">Button Test Page</h1>
      <p>Count: {count}</p>

      <div className="flex flex-col gap-4 w-64">
        <Button color="primary" onClick={handleClick}>
          Test onClick
        </Button>

        <Button
          color="secondary"
          onClick={() => {
            console.log("Inline callback clicked!");
            alert("Inline callback clicked!");
          }}
        >
          Test inline callback
        </Button>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClick}
        >
          Regular HTML button
        </button>
      </div>
    </div>
  );
}
