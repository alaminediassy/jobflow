# 🚀 JobFlow

**JobFlow** is a premium, high-performance Job Application Tracker designed to help candidates dominate their job search. Built with a "Deep Black" aesthetic and a focus on speed and intuition, it replaces messy spreadsheets with a powerful recruitment dashboard.

## ✨ Key Features

- **Centralized Tracking**: Manage all your job applications in one dedicated space.
- **Deep Black Theme**: An immersive, high-contrast dark mode designed for focus and modern aesthetics.
- **Smart Analytics**: Visualize your progress with real-time KPI cards (Total applications, active offers, etc.).
- **Follow-up Reminders**: Never miss a beat with a dedicated priority follow-up system.
- **Responsive Design**: Seamless experience from desktop to mobile with a collapsible, optimized sidebar.
- **Secure Authentication**: Built with Firebase Auth for a fast and secure login/registration flow.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management & Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Auth)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Date Handling**: [date-fns](https://date-fns.org/)

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- A Firebase project (Firestore and Authentication enabled)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
```

## 📄 License

&copy; {new Date().getFullYear()} Mamadou Lamine DIASSY - All rights reserved.
