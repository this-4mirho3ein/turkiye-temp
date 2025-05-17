import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Divider } from "@heroui/react";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import { Region } from "@/components/admin/data/regions";

type RegionFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: {
    name: string;
    slug: string;
    parentId: string;
    enName: string;
    code: string;
    phoneCode: string;
  };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  type: "countries" | "provinces" | "cities" | "areas";
  typeTitle: string;
  parentRegions: Region[];
  selectedRegion: Region | null;
  isLoading?: boolean;
};

const RegionFormModal: React.FC<RegionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  onInputChange,
  type,
  typeTitle,
  parentRegions,
  selectedRegion,
  isLoading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalContent>
      <ModalHeader>
        {selectedRegion ? `ویرایش ${typeTitle}` : `افزودن ${typeTitle} جدید`}
      </ModalHeader>
      <Divider />
      <ModalBody>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام {typeTitle} <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              placeholder={`نام ${typeTitle} را وارد کنید`}
              value={formData.name}
              onChange={onInputChange}
              aria-label={`نام ${typeTitle}`}
              tabIndex={0}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام انگلیسی <span className="text-red-500">*</span>
            </label>
            <Input
              name="enName"
              placeholder={`نام انگلیسی ${typeTitle} را وارد کنید`}
              value={formData.enName}
              onChange={onInputChange}
              aria-label="نام انگلیسی"
              tabIndex={0}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              نام انگلیسی به حروف لاتین (مانند:{" "}
              {type === "countries"
                ? "Iran"
                : type === "provinces"
                ? "East Azerbaijan"
                : type === "cities"
                ? "Tehran"
                : "Valiasr"}
              )
            </p>
          </div>

          {type === "countries" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  کد تلفن (Phone Code) <span className="text-red-500">*</span>
                </label>
                <Input
                  name="phoneCode"
                  placeholder="کد تلفن کشور را وارد کنید (مثال: 98)"
                  value={formData.phoneCode}
                  onChange={onInputChange}
                  aria-label="کد تلفن"
                  tabIndex={0}
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  کد تلفن کشور بدون + وارد شود (مثال: برای ایران 98)
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">توجه:</span> کد کشور به صورت
                  خودکار تولید می‌شود و نیازی به وارد کردن آن نیست.
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">اسلاگ:</span> اسلاگ نیز به صورت
                  خودکار از روی نام انگلیسی تولید می‌شود.
                </p>
                {selectedRegion && selectedRegion.code && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">کد فعلی:</span>{" "}
                    {selectedRegion.code}
                  </p>
                )}
              </div>
            </>
          )}

          {type !== "countries" && (
            <>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">توجه:</span> کد {typeTitle} به
                  صورت خودکار تولید می‌شود و نیازی به وارد کردن آن نیست.
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">اسلاگ:</span> اسلاگ نیز به صورت
                  خودکار از روی نام انگلیسی تولید می‌شود.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {type === "provinces"
                    ? "کشور"
                    : type === "cities"
                    ? "استان"
                    : "شهر"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={onInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
                  aria-label="انتخاب والد"
                  tabIndex={0}
                  disabled={isLoading}
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {parentRegions.map((parent) => (
                    <option
                      key={parent.id}
                      value={parent.originalId || parent.id}
                    >
                      {parent.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          variant="light"
          onPress={onClose}
          aria-label="انصراف"
          tabIndex={0}
          disabled={isLoading}
        >
          انصراف
        </Button>
        <Button
          color="primary"
          onPress={onSave}
          aria-label="ذخیره"
          tabIndex={0}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default RegionFormModal;
