import React, { useEffect, useState, useCallback, useMemo } from "react";
import Modal, {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { createPlan, updatePlan } from "@/controllers/makeRequest";
import { PlanListItem } from "./Plan";
import { useToast } from "../ui/ToastProvider";

interface Props {
    open: boolean;
    handleClose: () => void;
    type: "create" | "update";
    handleLoading: (state: boolean) => void;
    selectedPlan: PlanListItem | null;
    refetch: () => void;
    loading: boolean;
}
export type PlanType = "free" | "premium" | "business" | "enterprise";

interface PlanForm {
    name: string;
    description: string;
    adCount: string;
    price: string;
    durationDays: string;
    type: PlanType;
}

const initialFormState: PlanForm = {
    name: "",
    description: "",
    adCount: "",
    price: "",
    durationDays: "",
    type: "free",
};

// Helper to validate form fields
const validateForm = (form: PlanForm) => {
    return (
        form.name.trim() !== "" &&
        form.description.trim() !== "" &&
        !isNaN(Number(form.adCount)) &&
        !isNaN(Number(form.price)) &&
        !isNaN(Number(form.durationDays)) &&
        Number(form.adCount) >= 0 &&
        Number(form.price) >= 0 &&
        Number(form.durationDays) > 0
    );
};

export default function PlanActionModal({
    handleClose,
    open,
    type,
    handleLoading,
    selectedPlan,
    refetch,
    loading,
}: Props) {
    const [form, setForm] = useState<PlanForm>(initialFormState);
    const { showToast } = useToast();
    const [formError, setFormError] = useState<string | null>(null);

    // Memoized form validity
    const isFormValid = useMemo(() => validateForm(form), [form]);

    // Handle form field changes
    const handleFormChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setForm((prev) => ({ ...prev, [name]: value }));
        },
        []
    );

    // Reset or populate form on modal open/selectedPlan change
    useEffect(() => {
        if (selectedPlan) {
            setForm({
                name: selectedPlan.name,
                description: selectedPlan.description,
                adCount: String(selectedPlan.adCount),
                price: String(selectedPlan.price),
                durationDays: String(selectedPlan.durationDays),
                type: selectedPlan.type,
            });
        } else {
            setForm(initialFormState);
        }
        setFormError(null);
    }, [selectedPlan, open]);

    // Handle form submission
    const handleSubmit = useCallback(async () => {
        if (!isFormValid) {
            setFormError("لطفا تمام فیلدها را به درستی پر کنید.");
            return;
        }
        handleLoading(true);
        try {
            let response;
            if (type === "create") {
                response = await createPlan({
                    name: form.name,
                    description: form.description,
                    adCount: Number(form.adCount),
                    price: Number(form.price),
                    durationDays: Number(form.durationDays),
                    type: form.type as PlanType,
                });
            } else if (type === "update" && selectedPlan) {
                response = await updatePlan(selectedPlan._id, {
                    name: form.name,
                    description: form.description,
                    adCount: Number(form.adCount),
                    price: Number(form.price),
                    durationDays: Number(form.durationDays),
                    type: form.type as PlanType,
                });
            }
            if (response) {
                showToast({
                    message: response.message,
                    type: response.success ? "success" : "error",
                });
            }
            await refetch();
            handleClose();
        } catch (err) {
            showToast({
                message: "خطا در انجام عملیات. لطفا دوباره تلاش کنید.",
                type: "error",
            });
        } finally {
            handleLoading(false);
            setForm(initialFormState);
        }
    }, [form, type, selectedPlan, handleLoading, showToast, refetch, handleClose, isFormValid]);


    return (
        <Modal isOpen={open} onOpenChange={handleClose} size="md" aria-modal="true" aria-labelledby="plan-modal-title">
            <ModalContent>
                <ModalHeader id="plan-modal-title">
                    {type === "create" ? "ایجاد پلن جدید" : "ویرایش پلن"}
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="عنوان"
                            placeholder="عنوان پلن"
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
                            aria-label="عنوان پلن"
                            required
                        />
                        <Input
                            label="توضیحات"
                            placeholder="توضیحات"
                            name="description"
                            value={form.description}
                            onChange={handleFormChange}
                            aria-label="توضیحات پلن"
                            required
                        />
                        <Input
                            label="تعداد آگهی"
                            type="number"
                            placeholder="تعداد آگهی"
                            name="adCount"
                            value={form.adCount}
                            onChange={handleFormChange}
                            aria-label="تعداد آگهی"
                            min={0}
                            required
                        />
                        <Input
                            label="قیمت (تومان)"
                            type="number"
                            placeholder="قیمت"
                            name="price"
                            value={form.price}
                            onChange={handleFormChange}
                            aria-label="قیمت پلن"
                            min={0}
                            required
                        />
                        <Input
                            label="مدت زمان (روز)"
                            type="number"
                            placeholder="مدت زمان"
                            name="durationDays"
                            value={form.durationDays}
                            onChange={handleFormChange}
                            aria-label="مدت زمان پلن"
                            min={1}
                            required
                        />
                        <div>
                            <label className="block text-xs mb-1" htmlFor="plan-type-select">نوع پلن</label>
                            <select
                                id="plan-type-select"
                                name="type"
                                value={form.type}
                                onChange={handleFormChange}
                                className="w-full border rounded-md px-3 py-2 text-sm"
                                aria-label="نوع پلن"
                            >
                                <option value="free">رایگان</option>
                                <option value="premium">پریمیوم</option>
                                <option value="business">بیزینس</option>
                                <option value="enterprise">اینترپرایز</option>
                            </select>
                        </div>
                    </div>
                    {formError && (
                        <div className="text-red-500 text-xs mt-2" role="alert">
                            {formError}
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="default" variant="bordered" onPress={handleClose} disabled={loading}>
                        انصراف
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleSubmit}
                        isLoading={loading}
                        disabled={!isFormValid || loading}
                        aria-disabled={!isFormValid || loading}
                    >
                        {type === "create" ? "ایجاد" : "ذخیره تغییرات"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
