# Finovix

A dynamic and responsive financial tracking and analytics dashboard built with modern web technologies.

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
