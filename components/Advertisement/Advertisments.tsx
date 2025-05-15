"use client";
import { Dispatch, SetStateAction, useState } from "react";
import Drawer from "../Drawer";
import { SortOrder } from "@/types/enums";
import { Button, Divider, Tab, Tabs } from "@heroui/react";
import {
  FaDollarSign,
  FaFilter,
  FaMoneyBillWave,
  FaSortAlphaDown,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";

const sortData = [
  {
    title: "جدیدترین",
    value: SortOrder.Newest,
    icon: <FaSortAmountDown className="text-lg inline" />,
  },
  {
    title: "قدیمی ترین",
    value: SortOrder.Oldest,
    icon: <FaSortAmountUp className="text-lg inline" />,
  },
  {
    title: "گران ترین",
    value: SortOrder.MostExpensive,
    icon: <FaMoneyBillWave className="text-lg text-red-500 inline" />,
  },
  {
    title: "ارزان ترین",
    value: SortOrder.Chepeast,
    icon: <FaDollarSign className="text-lg text-green-500 inline" />,
  },
];
const AdverismentsComponent = ({
  mainChildren,
  filtersChildren,
  mobileFiltersChildren,
  onFilterClick,
  sort,
  setSort,
  onResetFilterClick,
}: {
  mainChildren: React.ReactNode;
  filtersChildren: React.ReactNode;
  mobileFiltersChildren: React.ReactNode;
  onFilterClick: () => void;
  onResetFilterClick: () => void;
  sort: SortOrder;
  setSort: Dispatch<SetStateAction<SortOrder>>;
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col px-0 md:px-0">
      <main className="flex-grow pb-14">
        <div className=" relative">
          <div className="mb-0 md:mb-6 flex items-center justify-center gap-x-4 md:hidden sticky top-0 shadow-sm z-40 bg-white">
            <Button
              onPress={() => {
                setIsFilterOpen(true);
                setIsSortOpen(false);
              }}
              className="w-full"
              variant="light"
              color="default"
              size="lg"
            >
              <div>
                <FaFilter className="inline" /> فیلتر{" "}
              </div>
            </Button>
            <Divider orientation="vertical" className="h-8 w-px bg-gray-300" />{" "}
            {/* Added height and width */}
            <Button
              onPress={() => {
                setIsSortOpen(true);
                setIsFilterOpen(false);
              }}
              className="w-full"
              variant="light"
              size="lg"
              color="danger"
            >
              <div>
                <FaSortAlphaDown className="inline" /> مرتب سازی{" "}
              </div>
            </Button>
          </div>

          <div className="grid grid-cols-12 grid-rows-[60px_min(500px,_1fr)] gap-4">
            {filtersChildren}

            <div className="col-span-12 md:col-span-9 space-y-4  xl:col-span-10">
              <div className="hidden md:block">
                <div className="flex h-14 items-center gap-x-2 bg-white px-2 text-text/90 shadow-base lg:px-4">
                  <FaSortAlphaDown />{" "}
                  <Tabs
                    className="flex flex-wrap justify-center p-1"
                    color="primary"
                    selectedKey={sort}
                    onSelectionChange={(key) => setSort(key as SortOrder)}
                    classNames={{
                      tabList: "bg-transparent",
                    }}
                  >
                    {sortData.map((sortItem) => (
                      <Tab
                        key={sortItem.value}
                        title={sortItem.title}
                        className="w-full md:w-auto"
                      ></Tab>
                    ))}
                  </Tabs>
                </div>
              </div>

              {mainChildren}
            </div>
          </div>
        </div>
      </main>
      <Drawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="فیلتر ها"
        component={
          <Button
            onPress={onResetFilterClick}
            size="sm"
            variant="light"
            color="primary"
            // className="inline-flex items-center rounded-lg text-text hover:bg-zinc-100"
          >
            <span>حذف همه</span>
          </Button>
        }
        actionBottonClick={onFilterClick}
        actionButtonTitle="اعمال فیلتر"
      >
        <div className="space-y-4 p-4">{mobileFiltersChildren}</div>
      </Drawer>

      <Drawer
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        title="مرتب سازی"
      >
        <div className="space-y-2 p-4">
          {sortData.map((sortItem, index) => (
            <Button
              key={index}
              onPress={() => {
                setSort(sortItem.value);
                setIsSortOpen(false);
              }}
              color="primary"
              className="w-full"
            >
              <div>
                {sortItem.icon} {sortItem.title}
              </div>
            </Button>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default AdverismentsComponent;
