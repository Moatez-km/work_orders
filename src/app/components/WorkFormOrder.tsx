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
  hideStatus?: boolean;
}

export default function WorkFormOrder({
  initialData,
  onSubmit,
  errors = {},
  isSubmitting = false,
  hideStatus = false,
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
          className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm bg-white dark:bg-zinc-950 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 ${
            errors.title
              ? 'border-rose-300 dark:border-rose-500/30 focus:border-rose-500 focus:ring-rose-500/30 dark:focus:ring-rose-500/30'
              : 'border-slate-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/30 dark:focus:ring-indigo-500/30'
          }`}
          placeholder="e.g. Repair lobby HVAC"
        />
        {errors.title && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
            </svg>
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
          className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm bg-white dark:bg-zinc-950 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 ${
            errors.description
              ? 'border-rose-300 dark:border-rose-500/30 focus:border-rose-500 focus:ring-rose-500/30 dark:focus:ring-rose-500/30'
              : 'border-slate-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/30 dark:focus:ring-indigo-500/30'
          }`}
          placeholder="Detailed description of the issue..."
        />
        {errors.description && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
            </svg>
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
            className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-zinc-800 px-4 py-2.5 text-sm bg-white dark:bg-zinc-950 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-500/30 focus:border-indigo-500"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
          {errors.priority && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
              <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
              </svg>
              {errors.priority.join(', ')}
            </p>
          )}
        </div>

        {/* Status */}
        {!hideStatus && (
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-zinc-800 px-4 py-2.5 text-sm bg-white dark:bg-zinc-950 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-500/30 focus:border-indigo-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
                <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
                </svg>
                {errors.status.join(', ')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-zinc-800">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            'Save Work Order'
          )}
        </button>
      </div>
    </form>
  );
}
