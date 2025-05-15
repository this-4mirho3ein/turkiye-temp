"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Select,
  SelectItem,
  Slider,
} from "@heroui/react"; // Hero UI Select
import { RadioGroup, Radio } from "@heroui/react"; // Hero UI Radio Group
import { Checkbox } from "@heroui/react"; // Hero UI Checkbox
import { DynamicFiltersProps, Filter } from "@/types/interfaces";
import BaseFilter from "./BaseFilters";
import { HeroUiColors } from "@/types/enums";

const FilterComponent: React.FC<{
  filter: Filter;
  selectedFilters: any;
  onChange: any;
  isMobileView: boolean;
}> = ({ filter, selectedFilters, onChange, isMobileView }) => {
  switch (filter.typeFeature.title) {
    case "radio":
      return (
        <RadioGroup
          value={(selectedFilters[filter.slug] as string) || ""}
          onValueChange={(value) => onChange(filter.slug, value, isMobileView)}
        >
          {filter.values.map((option) => (
            <Radio
              key={option.slug}
              value={option.slug as string}
              className="z-0"
            >
              {option.value_title}
            </Radio>
          ))}
        </RadioGroup>
      );
    case "select":
      return (
        <Select
          color={HeroUiColors.Primary}
          selectedKeys={[selectedFilters[filter.slug] as string]}
          onChange={(e) => onChange(filter.slug, e.target.value, isMobileView)}
        >
          {filter.values.map((option) => (
            <SelectItem key={option.value_title}>
              {option.value_title}
            </SelectItem>
          ))}
        </Select>
      );
    case "multiSelect":
      return (
        <Select
          selectedKeys={(selectedFilters[filter.slug] as string) || []}
          onChange={(e) => {
            const value = e.target.value.split(",");
            const isEmptyArray = value.length === 1 && value[0] === "";
            onChange(filter.slug, isEmptyArray ? [] : value, isMobileView);
          }}
          color={HeroUiColors.Primary}
          selectionMode="multiple"
        >
          {filter.values.map((option) => (
            <SelectItem key={option.value_title}>
              {option.value_title}
            </SelectItem>
          ))}
        </Select>
      );
    case "range":
      return (
        <div
          className="flex flex-col gap-2 w-full h-full max-w-md items-start justify-center"
          dir="ltr"
        >
          <Slider
            className="max-w-md"
            maxValue={filter.max}
            minValue={filter.min}
            step={1}
            value={[
              (selectedFilters[filter.slug] as number[])?.[0] ?? filter.min,
              (selectedFilters[filter.slug] as number[])?.[1] ?? filter.max,
            ]}
            onChangeEnd={(value) => onChange(filter.slug, value, isMobileView)}
          />
          <p className="text-default-500 font-medium text-small">
            {Array.isArray(selectedFilters[filter.slug])
              ? (selectedFilters[filter.slug] as number[])
                  .filter((b) => b !== undefined)
                  .map((b) => `${b}`)
                  .join(" – ")
              : filter.min + "-" + filter.max}
          </p>
        </div>
      );
    case "checkbox":
      return (
        <div className="space-y-2">
          {filter.values.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                isSelected={
                  (selectedFilters[filter.slug] as string[])?.includes(
                    option.value_title
                  ) || false
                }
                onValueChange={(checked) => {
                  const currentValues =
                    (selectedFilters[filter.slug] as string[]) || [];
                  onChange(
                    filter.slug,
                    checked
                      ? [...currentValues, option.value_title]
                      : currentValues.filter((v) => v !== option.value_title),
                    isMobileView
                  );
                }}
              />
              <label className="text-sm">{option.value_title}</label>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const DynamicFilters: React.FC<DynamicFiltersProps> = ({
  filters,
  selectedFilters,
  onChange,
  onResetFilterClick,
  isMobileView = false,
}) => {
  return (
    <>
      {!isMobileView ? (
        <div className="col-span-3 row-span-3 hidden md:block xl:col-span-2">
          <div className="top-32 mb-4 overflow-hidden bg-white shadow-base">
            <div
              dir="ltr"
              className="flex flex-col overflow-y-auto overflow-x-hidden px-1 py-3"
            >
              <div dir="rtl">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="xl:text-lg font-bold text-primary">
                    فیلتر ها
                  </h3>
                  <Button
                    className="mt-2 md:mt-0 px-1 py-1 bg-secondary hover:opacity-90 text-white rounded-lg shadow-md"
                    onPress={onResetFilterClick}
                  >
                    حذف همه
                  </Button>
                </div>
                <div className="space-y-4">
                  <BaseFilter isMobileView={isMobileView} />
                  {filters?.map((filter) => (
                    <div key={filter.slug} className="p-1 border rounded-lg">
                      <Accordion>
                        <AccordionItem
                          key="1"
                          aria-label={filter.title}
                          title={filter.title}
                        >
                          <FilterComponent
                            filter={filter}
                            selectedFilters={selectedFilters}
                            onChange={onChange}
                            isMobileView={isMobileView}
                          />
                        </AccordionItem>
                      </Accordion>{" "}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full pb-auto">
          <ul className="h-full space-y-6 overflow-y-auto p-4">
            <li>
              <div className="space-y-4">
                <BaseFilter isMobileView={isMobileView} />
                {filters.map((filter) => (
                  <div key={filter.id} className="px-1 py-2 border rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {filter.title}
                    </h3>
                    <FilterComponent
                      filter={filter}
                      selectedFilters={selectedFilters}
                      onChange={onChange}
                      isMobileView={isMobileView}
                    />
                  </div>
                ))}
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default DynamicFilters;
