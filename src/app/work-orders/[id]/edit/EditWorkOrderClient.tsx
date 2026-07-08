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
        router.push(`/work-orders/${workOrder.id}?success=updated`);
        router.refresh();
      }
    } catch {
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
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1"
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
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-sm font-semibold text-rose-800 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5 flex-shrink-0 text-rose-600 dark:text-rose-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
                </svg>
                <div className="flex-1">{apiError}</div>
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
