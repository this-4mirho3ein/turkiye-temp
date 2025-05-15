"use client";

import { useEffect, useState } from "react";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type TransactionType = {
  value: string;
  slug: "sale" | "rent";
};

type PropertyType = {
  value: string;
  slug: string;
};

type Category = {
  value: string;
  slug: string;
};

export type FormData = {
  // step one
  id: string;
  elan_id?: string;
  dealType: TransactionType;
  propertyType: PropertyType;
  category: Category;
  title: string;
  description: string;
  price: string;

  // step two
  dynamicFields: { [key: string]: any };

  // step three
  country: string;
  province: string;
  city: string;
  area: string;
  address: string;
  latitude: string;
  longitude: string;

  // step four
  images: File[];
  videos: string[];
  // Legal
  termsAccepted: boolean;
};

export default function PostAdForm() {
  const [step, setStep] = useState(1);
  const { state } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    // step one
    id: "",
    elan_id: "",
    dealType: { value: "فروش", slug: "sale" },
    propertyType: { value: "", slug: "" },
    category: { value: "", slug: "" },
    title: "",
    price: "",
    description: "",

    // step two
    dynamicFields: {},

    // step three
    country: "",
    province: "",
    city: "",
    area: "",
    address: "",
    latitude: "",
    longitude: "",

    // step four
    images: [],
    videos: [],
    termsAccepted: false,
  });

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateDynamicField = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      dynamicFields: { ...prev.dynamicFields, [key]: value },
    }));
  };

  if (!state.authenticated) {
    // If not authenticated, redirect
    if (typeof window !== "undefined") {
      router.push("/auth/login");
    }
    return null; // Don't render the form
  }

  return (
    <div className=" max-w-4xl container mx-auto my-8 rounded-lg p-4 bg-white shadow-md">
      <div className="">
        {step === 1 && (
          <StepOne
            formData={formData}
            updateField={updateField}
            next={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepTwo
            formData={formData}
            updateDynamicField={updateDynamicField}
            next={() => setStep(3)}
            back={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepThree
            formData={formData}
            updateField={updateField}
            next={() => setStep(4)}
            back={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <StepFour
            formData={formData}
            updateField={updateField}
            back={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
}
