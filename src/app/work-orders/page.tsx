import { readWorkOrders } from '../lib/work-orders';
import Link from 'next/link';
import DeleteWorkOrderButton from '../components/DeleteWorkOrderButton';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams?: Promise<{ q?: string }>;
}

export default async function WorkOrdersPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q || '';

  const allWorkOrders = readWorkOrders();
  const workOrders = query
    ? allWorkOrders.filter((wo) =>
        wo.title.toLowerCase().includes(query.toLowerCase())
      )
    : allWorkOrders;

  // Helper for Priority styling
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
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
          <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800 dark:bg-teal-500/10 dark:text-teal-400">
            Done
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-500/10 dark:text-blue-400">
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
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
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans pb-12">
      {/* Decorative gradient header banner */}
      <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Header Section */}
        <div className="md:flex md:items-center md:justify-between mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent dark:from-white dark:to-zinc-400">
              Work Orders Directory
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
              Overview of currently registered maintenance tasks, hardware issues, and building work orders.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex-shrink-0">
            <Link
              href="/work-orders/new"
              className="inline-flex justify-center items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Work Order
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <form method="GET" action="/work-orders" className="mb-6 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-slate-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search work orders by title..."
              className="block w-full rounded-lg border border-slate-200 dark:border-zinc-800 pl-10 pr-4 py-2 text-sm bg-white dark:bg-zinc-950 text-slate-900 dark:text-white transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-all cursor-pointer"
          >
            Search
          </button>
          {query && (
            <Link
              href="/work-orders"
              className="inline-flex justify-center items-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
            >
              Clear
            </Link>
          )}
        </form>

        {/* Table Container Card */}
        <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-xl border border-slate-100 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-900/50">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">
              Active Items ({workOrders.length})
            </h2>
          </div>

          {workOrders.length === 0 ? (
            <div className="text-center py-16 px-4">
              <svg
                className="mx-auto h-12 w-12 text-slate-400 dark:text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 002-2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                {query ? 'No matching work orders' : 'No work orders'}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                {query
                  ? `Try adjusting your search query or clear it to see all items.`
                  : 'Get started by seeding or adding a work order.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800">
                <thead className="bg-slate-50/55 dark:bg-zinc-900/80">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider"
                    >
                      Priority
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider"
                    >
                      Updated At
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {workOrders.map((wo) => (
                    <tr
                      key={wo.id}
                      className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {wo.title}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                            {wo.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(wo.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(wo.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-zinc-400">
                        {formatDate(wo.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/work-orders/${wo.id}`}
                            title="View Details"
                            className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/30 transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </Link>
                          <Link
                            href={`/work-orders/${wo.id}/edit`}
                            title="Edit Work Order"
                            className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-amber-400 dark:hover:bg-amber-950/30 transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </Link>
                          <DeleteWorkOrderButton
                            workOrderId={wo.id}
                            workOrderTitle={wo.title}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
