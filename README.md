# Restaurant Online Ordering and Reservation System (ROORS)

## 📝 Overview

ROORS addresses the evolving needs of the modern dining industry by providing a complete online solution that enhances customer experience while streamlining restaurant operations. The platform enables customers to browse dynamic menus, place orders with real-time tracking, and make table reservations with availability checking, while empowering restaurant staff with powerful management tools and analytics.

## 🌐 Deployments

### Live Site

View the latest deployment here: [ROORS Live Site](https://roors-web.vercel.app/)

### Deployment Workflow

- The site is automatically redeployed via **Vercel** whenever changes are pushed or a pull request is merged into the `main` branch.
- No manual steps needed—just commit and push to `main` (or open/merge a PR) to trigger a new deployment.

## 📦 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** package manager
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/ken-nguyen-2605/roors.git
cd roors
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code analysis

## 🌿 Git Workflow & Branch Naming

### Git Workflow

1. **Create a new branch (use the naming conventions below)**
  ```bash
  git checkout -b feature/your-branch-name
  ```

2. **Work on your changes, then stage and commit**
  ```bash
  git add .
  git commit -m "A brief, meaningful commit message"
  ```

3. **Push your branch to GitHub**
  ```bash
  git push -u origin feature/your-branch-name
  ```

4. **Open a Pull Request** on GitHub when your work is ready for review.

### Branch Naming Convention
Use prefixes to categorize your work:

- **`feature/`** - New features
  ```bash
  feature/user-authentication
  feature/scam-detection-api
  feature/dashboard-ui
  ```

- **`fix/`** or **`bug/`** - Bug fixes
  ```bash
  fix/login-validation
  bug/database-connection
  fix/responsive-layout
  ```

- **`chore/`** - Maintenance tasks
  ```bash
  chore/update-dependencies
  chore/refactor-config
  chore/improve-documentation
  ```
