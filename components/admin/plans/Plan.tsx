import React, { useState, useCallback } from "react";
import { PlanType } from "./PlanActionModal";
import { FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import Button from "../ui/Button";
import { setLoading } from "@/context/AuthContext";
import { deletePlan, restorePlan } from "@/controllers/makeRequest";
import { useToast } from "../ui/ToastProvider";

/**
 * Represents a single plan item in the list.
 */
export interface PlanListItem {
    _id: string;
    name: string;
    description: string;
    type: PlanType;
    adCount: number;
    price: number;
    durationDays: number;
    isDeleted: boolean;
}

interface Props {
    plan: PlanListItem;
    handleOpenUpdate: (plan: PlanListItem) => void;
    handleLoading: (state: boolean) => void;
    refetch: () => void;
}

export default function Plan({
    plan,
    handleOpenUpdate,
    handleLoading,
    refetch,
}: Props) {
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const { showToast } = useToast();


    const toggleSubmitLoading = useCallback(() => {
        setSubmitLoading((prev) => !prev);
    }, []);

    /**
     * Handles restoring a deleted plan.
     * @param id Plan ID
     */
    const handleRestore = useCallback(async (id: string) => {
        handleLoading(false);
        toggleSubmitLoading();
        try {
            const response = await restorePlan(id);
            showToast({
                message: response.message,
                type: response.success ? "success" : "error",
            });
            await refetch();
        } catch (error: any) {
            showToast({
                message: error?.message,
                type: "error",
            });
        } finally {
            toggleSubmitLoading();
        }
    }, [handleLoading, refetch, showToast, toggleSubmitLoading]);

    /**
     * Handles deleting a plan.
     * @param id Plan ID
     */
    const handleDelete = useCallback(async (id: string) => {
        toggleSubmitLoading();
        try {
            const response = await deletePlan(id);
            showToast({
                message: response.message,
                type: response.success ? "success" : "error",
            });
            await refetch();
        } catch (error: any) {
            showToast({
                message: error?.message,
                type: "error",
            });
        } finally {
            toggleSubmitLoading();
        }
    }, [refetch, showToast, toggleSubmitLoading]);

    return (
        <div
            className={`flex flex-col p-4 gap-3 bg-white rounded-[24px] drop-shadow-sm border transition-all duration-200 ${plan.isDeleted ? " border-dashed" : ""}`}
        >
            <h1 className="text-xl font-bold mb-2">{plan.name}</h1>
            <p className="text-sm mb-2">{plan.description}</p>
            <div className="flex flex-col gap-1.5 text-xs text-gray-600 mb-4">
                <span className="w-full flex items-center  justify-between">
                    نوع پلن: <span>{plan.type}</span>
                </span>
                <span className="w-full flex items-center  justify-between">
                    تعداد آگهی: <span> {plan.adCount}</span>
                </span>
                <span className="w-full flex items-center  justify-between">
                    قیمت: <span> {plan.price.toLocaleString()} تومان</span>
                </span>
                <span className="w-full flex items-center  justify-between">
                    مدت زمان: <span> {plan.durationDays} روز</span>
                </span>
            </div>
            <div className="flex gap-2 mt-auto">
                {!plan.isDeleted && (
                    <Button
                        color="warning"
                        className="w-full !rounded-[12px]"
                        size="sm"
                        startContent={<FaEdit />}
                        onPress={() => handleOpenUpdate(plan)}
                        isDisabled={submitLoading}
                    >
                        ویرایش
                    </Button>
                )}
                {!plan.isDeleted ? (
                    <Button
                        className="w-full !rounded-[12px]"
                        color="danger"
                        size="sm"
                        startContent={<FaTrash />}
                        isLoading={submitLoading}
                        isDisabled={submitLoading}
                        onPress={() => handleDelete(plan._id)}
                    >
                        حذف
                    </Button>
                ) : (
                    <Button
                        className="w-full !rounded-[12px]"
                        color="success"
                        size="sm"
                        isLoading={submitLoading}
                        isDisabled={submitLoading}
                        startContent={<FaUndo />}
                        onPress={() => handleRestore(plan._id)}
                    >
                        بازیابی
                    </Button>
                )}
            </div>
        </div>
    );
}
