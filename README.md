# Technician Work Orders

A small production-minded **Full-Stack Next.js** application for managing technician work orders.

This project was built as part of a Full-Stack Developer technical assessment using **Next.js App Router**, **TypeScript**, and **file-based JSON persistence**.

---

## Features

* ✅ List all work orders
* ✅ Create a new work order
* ✅ View work order details
* ✅ Edit existing work orders
* ✅ Delete work orders
* ✅ Search work orders by title
* ✅ Server-side validation using Zod
* ✅ File-based JSON persistence
* ✅ Responsive UI built with Tailwind CSS
* ✅ Unit tests with Vitest and Testing Library

---

## Tech Stack

### Frontend

* Next.js 15 (App Router)
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js Route Handlers
* Node.js File System (`fs/promises`)
* Zod

### Testing

* Vitest
* React Testing Library

---

# Project Structure

```
app/
├── api/
│   └── work-orders/
│       ├── route.ts              # GET / POST
│       └── [id]/
│           └── route.ts          # PUT / DELETE
│
├── work-orders/
│   ├── page.tsx                  # List page
│   ├── new/
│   │   └── page.tsx              # Create page
│   └── [id]/
│       ├── page.tsx              # Detail page
│       └── edit/
│           └── page.tsx          # Edit page
│
├── components/
│   ├── WorkOrderForm.tsx
│   ├── WorkOrderTable.tsx
│   └── SearchBar.tsx
│
├── lib/
│   ├── work-orders.ts            # JSON persistence
│   └── validation.ts             # Zod schemas
│
├── types/
│   └── work-order.ts
│
├── data/
│   └── work-orders.json
│
├── scripts/
│   └── seed.ts
│
└── tests/
```

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

---

# Running the Application

Start the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# Seed Sample Data

Generate sample work orders

```bash
npm run seed
```

This command recreates the `data/work-orders.json` file with sample data.

---

# Running Tests

Execute all tests

```bash
npm test
```

or

```bash
npm run test
```

---

# API Endpoints

## Get all work orders

```
GET /api/work-orders
```

Optional query parameter

```
?q=printer
```

Returns work orders whose titles match the search text.

---

## Create a work order

```
POST /api/work-orders
```

Example body

```json
{
  "title": "Replace Router",
  "description": "Router in Office B is offline.",
  "priority": "High"
}
```

Status is automatically initialized as **Open**.

---

## Update a work order

```
PUT /api/work-orders/:id
```

---

## Delete a work order

```
DELETE /api/work-orders/:id
```

---

# Data Persistence

This project intentionally uses a **JSON file** instead of a database to keep the implementation lightweight and focused on the assessment requirements.

The persistence layer is implemented in:

```
lib/work-orders.ts
```

It exposes helper functions to:

* Read work orders
* Write work orders
* Update data safely

---

# Validation

Server-side validation is implemented using **Zod**.

Validation rules include:

* Title: 2–80 characters
* Description: maximum 2000 characters
* Priority:

  * Low
  * Medium
  * High
* Status:

  * Open
  * In Progress
  * Done

Validation occurs inside the API routes before any data is written to disk.

---

# Rendering Safety

Descriptions are rendered as plain text.

The application intentionally avoids using:

```tsx
dangerouslySetInnerHTML
```

to reduce the risk of Cross-Site Scripting (XSS).

---

# Search Decision

To keep the project within the requested **4–8 hour** timebox, **title search** was implemented instead of a status filter.

Users can quickly find work orders by typing part of the title.

---

# Caching Strategy

The application uses dynamic data fetching (`cache: 'no-store'` / dynamic rendering where appropriate) because work orders change frequently.

This ensures that newly created, updated, or deleted work orders are immediately reflected without requiring manual cache invalidation.

---

# Testing

The project includes unit/component tests covering core functionality, such as:

* Rendering work order components
* Creating a new work order
* Displaying the updated work order list

The testing setup uses:

* Vitest
* React Testing Library

---

# Design Decisions

To stay within the assessment's time constraints, the project focuses on:

* Clean architecture
* Strong TypeScript typing
* Reusable components
* Clear server/client boundaries
* Simple and maintainable code
* Production-minded validation

The following were intentionally excluded because they were outside the project scope:

* Database integration
* Authentication
* Authorization
* File uploads
* Real-time updates
* Internationalization
* Analytics

---

# Future Improvements

Potential enhancements include:

* Status filtering
* Pagination
* Sorting
* Optimistic UI updates
* Playwright end-to-end tests
* SQLite or PostgreSQL persistence
* Authentication and user management
* Docker support
* CI/CD pipeline

---

# Author

Developed by **Moatez Kamoun** as part of a Full-Stack Developer technical assessment.
