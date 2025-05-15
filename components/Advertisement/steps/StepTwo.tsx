"use client";

import { FormData } from "../PostAdForm";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getFeatureRelatedFields,
  createAdvertisementStep2,
} from "@/controllers/makeRequest";

type Props = {
  formData: FormData;
  updateDynamicField: (key: string, value: any) => void;
  next: () => void;
  back: () => void;
};

export default function StepTwo({
  formData,
  updateDynamicField,
  next,
  back,
}: Props) {
  const [fields, setFields] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const user = useAuth();

  useEffect(() => {
    const fetchFields = async () => {
      user.dispatch({ type: "LOADING", value: true });
      setError(null);
      try {
        const data = await getFeatureRelatedFields(formData.propertyType.slug);
        console.log("Fetched fields data:", data);
        setFields(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e.message || "خطا در دریافت فیلدها");
      } finally {
        user.dispatch({ type: "LOADING", value: false });
      }
    };
    if (formData.propertyType.slug) {
      fetchFields();
    }
  }, [formData.propertyType.slug]);

  console.log(
    "fields:",
    fields,
    "loading:",
    user.state.loading,
    "error:",
    error
  );

  const handleNext = async () => {
    setError(null);
    user.dispatch({ type: "LOADING", value: true });
    try {
      const payload = Object.fromEntries(
        Object.entries(formData.dynamicFields).map(([key, val]) => {
          if (Array.isArray(val)) {
            // For checkbox/multiselect: array of { value, slug } or just values
            return [
              key,
              val.map((item: any) =>
                "slug" in item && item.slug ? item.slug : item.value ?? item
              ),
            ];
          } else if (val && typeof val === "object") {
            // For single select/radio: { value, slug } or just value
            return [
              key,
              "slug" in val && val.slug ? val.slug : val.value ?? val,
            ];
          } else {
            // Fallback (raw value)
            return [key, val];
          }
        })
      );
      payload.elan = formData.id;
      const token = user.state.accessToken;
      const res = await createAdvertisementStep2(payload, token);
      if (res.status >= 200 && res.status < 300) {
        next();
      } else {
        setError(res.message || "خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید.");
      }
    } catch (e: any) {
      setError(e.message || "خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید.");
    } finally {
      user.dispatch({ type: "LOADING", value: false });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg  border border-gray-100 rtl space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-right text-indigo-700">
        جزئیات ملک
      </h1>
      {user.state.loading && (
        <div className="text-center">در حال بارگذاری...</div>
      )}
      {error && <div className="text-center text-red-600">{error}</div>}
      {!user.state.loading && !error && fields.length > 0 && (
        <div className="space-y-4">
          {fields.map((field) => {
            const fieldState = formData.dynamicFields[field.slug] || {};
            const selectedValue = fieldState.value || "";
            const selectedArray = Array.isArray(fieldState) ? fieldState : [];
            const selectedValues = selectedArray.map((item: any) => item.value);
            switch (field.typeFeature?.title) {
              case "select":
                return (
                  <div key={field.slug}>
                    <label className="block text-sm font-medium mb-2 text-right text-gray-700">
                      {field.title}
                    </label>
                    <Select
                      selectedKeys={selectedValue ? [selectedValue] : []}
                      onChange={(e) => {
                        const selected = field.values.find(
                          (v: any) => v.value_title === e.target.value
                        );
                        updateDynamicField(field.slug, {
                          value: selected.value_title,
                          slug: selected.slug,
                        });
                      }}
                      className="text-right"
                    >
                      {field.values.map((v: any) => (
                        <SelectItem key={v.value_title}>
                          {v.value_title}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                );
              case "radio":
                return (
                  <div key={field.slug}>
                    <label className="block text-sm font-medium mb-2 text-right text-gray-700">
                      {field.title}
                    </label>
                    <RadioGroup
                      value={selectedValue}
                      onChange={(e) => {
                        const selected = field.values.find(
                          (v: any) => v.value_title === e.target.value
                        );
                        updateDynamicField(field.slug, {
                          value: selected.value_title,
                          slug: selected.slug,
                        });
                      }}
                      className="text-right"
                    >
                      {field.values.map((v: any) => (
                        <Radio key={v.value_title} value={v.value_title}>
                          {v.value_title}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </div>
                );
              case "checkbox":
                return (
                  <div key={field.slug}>
                    <label className="block text-sm font-medium mb-2 text-right text-gray-700">
                      {field.title}
                    </label>
                    <CheckboxGroup
                      value={selectedValues}
                      onChange={(vals: string[]) => {
                        const valueSlugArray = field.values
                          .filter((v: any) => vals.includes(v.value_title))
                          .map((v: any) => ({
                            value: v.value_title,
                            slug: v.slug,
                          }));
                        updateDynamicField(field.slug, valueSlugArray);
                      }}
                      className="text-right"
                    >
                      {field.values.map((v: any) => (
                        <Checkbox key={v.value_title} value={v.value_title}>
                          {v.value_title}
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  </div>
                );
              case "multiSelect":
                return (
                  <div key={field.slug}>
                    <label className="block text-sm font-medium mb-2 text-right text-gray-700">
                      {field.title}
                    </label>
                    <Select
                      selectionMode="multiple"
                      selectedKeys={
                        Array.isArray(selectedValue)
                          ? selectedValue.filter(
                              (v: any) => typeof v === "string"
                            )
                          : []
                      }
                      onSelectionChange={(keys) => {
                        const slugs = Array.from(keys)
                          .filter((k): k is string => typeof k === "string")
                          .map((k) => {
                            const selected = field.values.find(
                              (v: any) => v.value_title === k
                            );
                            return selected
                              ? { value: k, slug: selected.slug }
                              : null;
                          })
                          .filter(
                            (s): s is { value: string; slug: string } =>
                              s !== null
                          );
                        updateDynamicField(field.slug, slugs);
                      }}
                      className="text-right"
                    >
                      {field.values.map((v: any) => (
                        <SelectItem key={v.value_title}>
                          {v.value_title}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                );
              case "range":
                return (
                  <div key={field.slug}>
                    <label className="block text-sm font-medium mb-2 text-right text-gray-700">
                      {field.title}
                    </label>
                    <Input
                      type="number"
                      value={selectedValue}
                      min={field.min || undefined}
                      max={field.max || undefined}
                      onChange={(e) => {
                        const selected = field.values.find(
                          (v: any) => v.value_title === e.target.value
                        );
                        updateDynamicField(field.slug, {
                          value: e.target.value,
                          slug: selected ? selected.slug : null,
                        });
                      }}
                      className="text-right"
                      placeholder={field.title}
                    />
                  </div>
                );
              default:
                return (
                  <div key={field.slug}>
                    <label className="block text-sm font-medium mb-2 text-right text-gray-700">
                      {field.title}
                    </label>
                    <Input
                      value={selectedValue}
                      onChange={(e) => {
                        const selected = field.values.find(
                          (v: any) => v.value_title === e.target.value
                        );
                        updateDynamicField(field.slug, {
                          value: e.target.value,
                          slug: selected ? selected.slug : null,
                        });
                      }}
                      className="text-right"
                      placeholder={field.title}
                    />
                  </div>
                );
            }
          })}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button
          onPress={back}
          variant="bordered"
          className="text-gray-700 border-gray-300 hover:bg-gray-50 px-6 py-2"
        >
          بازگشت
        </Button>
        <Button
          onPress={handleNext}
          color="primary"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2"
          isLoading={user.state.loading}
        >
          ادامه
        </Button>
      </div>
      <div
        dir="ltr"
        className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-sm font-mono"
      >
        <h3 className="font-bold mb-2">Dynamic Fields:</h3>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(formData.dynamicFields, null, 2)}
        </pre>
      </div>
    </div>
  );
}
