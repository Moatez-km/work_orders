import { readWorkOrders } from '../../lib/work-orders';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const workOrders = readWorkOrders();
  const workOrder = workOrders.find((wo) => wo.id === id);

  if (!workOrder) {
    notFound();
    return null;
  }

  // Helper for Priority styling
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Low
          </span>
        );
    }
  };

  // Helper for Status styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return (
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 dark:bg-teal-500/10 dark:text-teal-400">
            Done
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-500/10 dark:text-blue-400">
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
            Open
          </span>
        );
    }
  };

  // Helper to format date
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
        timeStyle: 'medium',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans pb-12">
      <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/work-orders"
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            ← Back to Directory
          </Link>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-xl border border-slate-100 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Top colored strip or status-colored header */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex flex-wrap gap-3 items-center justify-between">
            <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
              ID: {workOrder.id}
            </span>
            <div className="flex gap-2">
              {getPriorityBadge(workOrder.priority)}
              {getStatusBadge(workOrder.status)}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {workOrder.title}
              </h1>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Description
              </h2>
              <p className="text-slate-700 dark:text-zinc-300 leading-relaxed text-base bg-slate-50 dark:bg-zinc-950 p-4 rounded-lg border border-slate-100 dark:border-zinc-800">
                {workOrder.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Priority level
                </span>
                <span className="mt-1 block text-sm font-semibold capitalize text-slate-900 dark:text-white">
                  {workOrder.priority}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Current Status
                </span>
                <span className="mt-1 block text-sm font-semibold capitalize text-slate-900 dark:text-white">
                  {workOrder.status}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Last Updated
                </span>
                <span className="mt-1 block text-sm font-semibold text-slate-900 dark:text-white">
                  {formatDate(workOrder.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
