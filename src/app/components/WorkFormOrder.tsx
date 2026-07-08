'use client';

import React, { useState } from 'react';
import { PRIORITIES, STATUSES } from '../types/work-order';

interface WorkFormOrderProps {
  initialData?: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
  };
  onSubmit: (data: {
    title: string;
    description: string;
    priority: string;
    status?: string;
  }) => Promise<void>;
  errors?: Record<string, string[]>;
  isSubmitting?: boolean;
}

export default function WorkFormOrder({
  initialData,
  onSubmit,
  errors = {},
  isSubmitting = false,
}: WorkFormOrderProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [priority, setPriority] = useState(initialData?.priority ?? 'low');
  const [status, setStatus] = useState(initialData?.status ?? 'open');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`mt-1 block w-full rounded-lg border px-4 py-2 text-sm bg-white dark:bg-zinc-950 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/25 ${
            errors.title
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/25'
              : 'border-slate-200 dark:border-zinc-800 focus:border-indigo-500'
          }`}
          placeholder="e.g. Repair lobby HVAC"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
            {errors.title.join(', ')}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={`mt-1 block w-full rounded-lg border px-4 py-2 text-sm bg-white dark:bg-zinc-950 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/25 ${
            errors.description
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/25'
              : 'border-slate-200 dark:border-zinc-800 focus:border-indigo-500'
          }`}
          placeholder="Detailed description of the issue..."
        />
        {errors.description && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
            {errors.description.join(', ')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-zinc-800 px-4 py-2 text-sm bg-white dark:bg-zinc-950 text-slate-900 dark:text-white transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
          {errors.priority && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.priority.join(', ')}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-zinc-800 px-4 py-2 text-sm bg-white dark:bg-zinc-950 text-slate-900 dark:text-white transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.status.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-zinc-800">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isSubmitting ? 'Submitting...' : 'Save Work Order'}
        </button>
      </div>
    </form>
  );
}
