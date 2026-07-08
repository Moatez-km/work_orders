'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WorkFormOrder from '../../../components/WorkFormOrder';
import { WorkOrder } from '../../../types/work-order';

interface EditWorkOrderClientProps {
  workOrder: WorkOrder;
}

export default function EditWorkOrderClient({ workOrder }: EditWorkOrderClientProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    priority: string;
    status?: string;
  }) => {
    setIsSubmitting(true);
    setErrors({});
    setApiError(null);

    try {
      const response = await fetch(`/api/work-orders/${workOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setApiError(result.error || 'Failed to update work order.');
        }
      } else {
        router.push(`/work-orders/${workOrder.id}`);
        router.refresh();
      }
    } catch (err) {
      setApiError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans pb-12">
      <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mb-6">
          <Link
            href={`/work-orders/${workOrder.id}`}
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            ← Cancel & Back to Details
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-xl border border-slate-100 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
            <h1 className="text-xl font-bold text-slate-800 dark:text-zinc-200">
              Edit Work Order
            </h1>
          </div>

          <div className="p-6 sm:p-8">
            {apiError && (
              <div className="mb-6 p-4 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-sm font-medium text-rose-800 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20">
                {apiError}
              </div>
            )}

            <WorkFormOrder
              initialData={{
                title: workOrder.title,
                description: workOrder.description,
                priority: workOrder.priority,
                status: workOrder.status,
              }}
              onSubmit={handleSubmit}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
