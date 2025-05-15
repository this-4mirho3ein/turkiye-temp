'use client';

import { addToast } from '@heroui/react';

export const successMessage = (message: string) => {
  addToast({
    title: 'موفق', // Success
    description: message,
    color: 'success',
    radius: 'md',
    variant: 'solid',
    timeout: 3000,
  });
};

export const copyMessage = (message: string) => {
  addToast({
    title: 'کپی شد', // Copied
    description: message,
    color: 'secondary',
    radius: 'md',
    variant: 'solid',
    timeout: 1500,
  });
};

export const successStoreMessage = () => {
  addToast({
    title: 'موفق', // Success
    description: 'با موفقیت ثبت شد',
    color: 'success',
    radius: 'md',
    variant: 'solid',
    timeout: 3000,
  });
};

export const loginSuccessMessage = (message: string) => {
  addToast({
    title: 'ورود موفق', // Login Success
    description: message,
    color: 'success',
    radius: 'md',
    variant: 'solid',
    timeout: 4000,
  });
};

export const errorMessage = (message: string) => {
  addToast({
    title: 'خطا', // Error
    description: message,
    color: 'danger',
    radius: 'md',
    variant: 'solid',
    timeout: 4000,
  });
};

export const validateMessage = (message: string) => {
  addToast({
    title: 'اطلاع', // Info
    description: message,
    color: 'primary',
    radius: 'md',
    variant: 'solid',
    timeout: 3000,
  });
};

export const catchMessage = () => {
  addToast({
    title: 'خطا', // Error
    description: 'خطایی رخ داده است',
    color: 'danger',
    radius: 'md',
    variant: 'solid',
    timeout: 4000,
  });
};

export const dataErrorsMessage = (dataErrors: string) => {
  addToast({
    title: 'خطای داده', // Data Error
    description: dataErrors,
    color: 'danger',
    radius: 'md',
    variant: 'solid',
    timeout: 4000,
  });
};

// Confirm and Delete Messages - Not Needed for Toast (Handled in UI Instead)
