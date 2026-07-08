'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmModal from './ConfirmModal';

interface DeleteWorkOrderButtonProps {
  workOrderId: string;
  workOrderTitle: string;
  redirectOnDelete?: boolean;
}

export default function DeleteWorkOrderButton({
  workOrderId,
  workOrderTitle,
  redirectOnDelete = false,
}: DeleteWorkOrderButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/work-orders/${workOrderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsModalOpen(false);
        router.push('/work-orders?success=deleted');
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete work order.');
        setIsDeleting(false);
      }
    } catch (error) {
      alert('A network error occurred. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDeleteClick}
        disabled={isDeleting}
        title="Delete Work Order"
        aria-label={`Delete work order ${workOrderTitle}`}
        className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Work Order"
        message={`Are you sure you want to delete the work order "${workOrderTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}

