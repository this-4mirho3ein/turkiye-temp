"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    FaMoneyBill,
    FaPlus,
    FaEye,
} from "react-icons/fa";
import Button from "../ui/Button";

import { getPlans } from "@/controllers/makeRequest";
import PlanActionModal, { PlanType } from "./PlanActionModal";
import Plan, { PlanListItem } from "./Plan";

// Create plan pay`load
export interface CreatePlanPayload {
    name: string;
    description: string;
    type: PlanType;
    adCount: number;
    price: number;
    durationDays: number;
}

// Update plan payload
export interface UpdatePlanPayload {
    name: string;
    description: string;
    type: PlanType;
    adCount: number;
    price: number;
    durationDays: number;
}


export default function PlansList() {
    // State management
    const [plans, setPlans] = useState<PlanListItem[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"create" | "update">("create");
    const [selectedPlan, setSelectedPlan] = useState<PlanListItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch plans from API
    const fetchPlans = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPlans(showDeleted);
            setPlans(data);
        } catch (err) {
            setError("خطا در دریافت پلن‌ها. لطفا دوباره تلاش کنید.");
        } finally {
            setLoading(false);
        }
    }, [showDeleted]);

    // Fetch plans on mount and when showDeleted changes
    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // Handlers
    const handleOpenCreate = useCallback(() => {
        setModalType("create");
        setSelectedPlan(null);
        setModalOpen(true);
    }, []);

    const handleOpenUpdate = useCallback((plan: PlanListItem) => {
        setModalType("update");
        setSelectedPlan(plan);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
        setSelectedPlan(null);
    }, []);

    const handleToggleShowDeleted = useCallback(() => {
        setShowDeleted((prev) => !prev);
    }, []);

    // Render
    return (
        <div className="flex flex-col space-y-6">
            {/* Header with title, create, and show deleted toggle */}
            <div className="space-y-6 w-full col-span-full">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg shadow-sm gap-4">
                        <div className="flex items-center gap-2">
                            <FaMoneyBill className="text-primary ml-3 text-xl" />
                            <h1 className="text-xl md:text-2xl font-bold">پلن ها </h1>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
                            <Button
                                color="primary"
                                startContent={<FaPlus />}
                                onPress={handleOpenCreate}
                                className="min-w-[120px] rounded-[12px]"
                            >
                                ایجاد پلن
                            </Button>
                            <Button
                                color={showDeleted ? "danger" : "default"}
                                variant={showDeleted ? "solid" : "bordered"}
                                startContent={<FaEye />}
                                onPress={handleToggleShowDeleted}
                                className="min-w-fit rounded-[12px]"
                            >
                                {showDeleted ? "نمایش فعال" : "نمایش حذف شده ها"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Plans grid */}
            <div className="grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {loading ? (
                    <div className="col-span-full text-center text-gray-400 py-8">
                        در حال بارگذاری...
                    </div>
                ) : error ? (
                    <div className="col-span-full text-center text-red-500 py-8">
                        {error}
                    </div>
                ) : plans?.length === 0 ? (
                    <div className="col-span-full text-center text-gray-400 py-8">
                        پلنی یافت نشد.
                    </div>
                ) : (
                    plans?.map((plan) => (
                        <Plan
                            refetch={fetchPlans}
                            handleOpenUpdate={handleOpenUpdate}
                            handleLoading={setLoading}
                            key={plan._id}
                            plan={plan}
                        />
                    ))
                )}
            </div>
            {/* Modal for create/update plan */}
            <PlanActionModal
                handleClose={handleCloseModal}
                handleLoading={setLoading}
                loading={loading}
                open={modalOpen}
                type={modalType}
                refetch={fetchPlans}
                selectedPlan={selectedPlan}
            />
        </div>
    );
}
