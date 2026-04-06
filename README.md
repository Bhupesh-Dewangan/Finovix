# Finovix

A dynamic and responsive financial tracking and analytics dashboard built with modern web technologies.

## Project Preview
<img width="1906" height="907" alt="image" src="https://github.com/user-attachments/assets/e073f9e1-3966-4a65-92cb-eb7e9cbb01a6" />
<img width="1898" height="912" alt="image" src="https://github.com/user-attachments/assets/10f9eb6f-2c5a-44a2-9bbe-0fef1eb55421" />
<img width="1902" height="916" alt="image" src="https://github.com/user-attachments/assets/fe4b606d-be92-446c-b985-5d7848bb53a8" />




## Features

- **Financial Summary:** View key metrics and summaries of your financial data.
- **Interactive Charts:** Visualize data trends and insights using Recharts.
- **Responsive Design:** A beautiful, responsive user interface built using Tailwind CSS.
- **Modern Architecture:** Fast and optimized development experience using React and Vite.

## Tech Stack

- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts:** [Recharts](https://recharts.org/)

## Getting Started

### Prerequisites

You will need [Node.js](https://nodejs.org/) installed on your system.

### Installation

1. Navigate to the project directory:
   ```bash
   cd Finovix
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the URL provided in your terminal) to view the application in action.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The production-ready assets will be generated in the `dist` folder.

## Project Structure

- `src/components/` - Reusable UI components including `NavBar`, `MainContent`, and `SummarySection`.
- `src/App.jsx` - The root component that sets up the main application layout.

## Technical Decisions and Trade-offs

### Framework Choice: React with Vite
- **Decision:** Built the application using React, with Vite as the build tool.
- **Reasoning:** React provides a component-based architecture which is ideal for a dashboard where UI elements (like Navbar, Sidebar, Summary Cards, Charts) are highly reusable. Vite offers a rapid development experience with instant hot module replacement (HMR) and optimized production builds compared to traditional bundlers.
- **Trade-offs:** While full-stack React frameworks like Next.js offer Server-Side Rendering (SSR) out of the box, Vite was chosen because Finovix is primarily a client-side dashboard application that doesn't immediately require heavy SEO optimization or SSR, keeping the initial setup simple and lightweight.

### Styling Approach: Tailwind CSS
- **Decision:** Utilized Tailwind CSS for styling the application.
- **Reasoning:** Tailwind's utility-first approach allows for rapid UI development without the context switching of writing separate CSS files. It naturally enforces a design system through its configuration and makes it easy to ensure consistent spacing, colors, and typography.
- **Trade-offs:** The HTML markup can become slightly cluttered with many utility classes. However, extracting common patterns into reusable React components mitigates this issue and keeps the codebase maintainable.

### State Management Strategy
- **Decision:** Relied on React's built-in hooks (`useState`, `useEffect`) and standard prop drilling for state management.
- **Reasoning:** For the current scope of the application, incorporating a robust external state management library like Redux or Zustand would introduce unnecessary boilerplate and complexity. React core components are capable of handling localized UI state and straightforward global interactions effectively at this scale.
- **Trade-offs:** If the application scales significantly with deep component trees and complex shared interactions, the current approach might lead to excessive prop drilling. We considered this but prioritized a lighter, straightforward approach for the initial build, leaving the door open to easily implement Zustand or Context API if state requirements grow.


## Additional Notes

### Known Limitations
- The current implementation may use mock data or static props for some metrics, meaning a robust API layer is needed for live data.
- Complex chart visualizations may require further optimization for very small mobile screens.

### Areas for Improvement
- **Global State Management:** Moving towards Context API or Zustand as features expand and prop drilling becomes cumbersome.
- **Backend Integration:** Connecting the frontend to a real database/API to fetch persistent user data.
- **Testing:** Introducing unit tests (Vitest) and End-to-End tests (Cypress/Playwright) to verify dashboard features.
- **Dark Mode:** Enhancing the Tailwind setup to support a toggleable dark mode feature for better user experience.

### Context About My Approach
The primary objective was to quickly stand up a functional, aesthetically pleasing UI that feels snappy. We focused heavily on component structure and layout first. By ensuring components like `SummarySection` and `NavBar` were cleanly separated and modular, it guarantees that adding complex data fetching and state logic in the future will be simple and contained without having to rewrite the presentation layer.


