Great — you're in a solid position to move forward with a clear frontend structure. Let's break this down step-by-step to help manage the complexity:

---

### ✅ Recommended React Project Structure

Inside your `src/` folder:

```
src/
│
├── assets/               # Images, logos, etc.
├── components/           # Reusable UI components (Buttons, Navbar, Sidebar, etc.)
│   ├── layout/           # Layout components (Header, Footer)
│   └── ui/               # Small reusable UI elements
│
├── constants/            # Roles, endpoints, colors, reusable config values
│   └── roles.js          # Role constants
│
├── sections/             # Sections for the Landing Page
│   ├── HeroSection.jsx
│   └── ServicesSection.jsx
│
├── pages/                # All routes (Landing, Login, Dashboards, etc.)
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── dashboards/
│   │   ├── SuperAdminDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── ManagementLeadDashboard.jsx
│   │   └── GrantOfficerDashboard.jsx
│
├── routes/               # ProtectedRoute & AppRouter logic
│   ├── ProtectedRoute.jsx
│   └── AppRoutes.jsx
│
├── services/             # API calls (e.g., userService, grantService)
│   ├── api.js            # Axios instance with token interceptors
│   └── authService.js
│
├── context/              # AuthContext to store user + role info
│   └── AuthProvider.jsx
│
├── App.jsx
└── main.jsx              # ReactDOM entry point
```

---

### 🔐 Role-Based Access Control (RBAC) Setup

#### 1. **Constants for Roles**

`src/constants/roles.js`

```js
export const Roles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGEMENT_LEAD: 'management_lead',
  GRANT_OFFICER: 'grant_officer',
};
```

---

#### 2. **AuthContext to Store User Info**

You’ll fetch user details (including the role) after login.

`src/context/AuthProvider.jsx`

```jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role, token }

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (data) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

#### 3. **ProtectedRoute Component**

`src/routes/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
```

---

#### 4. **AppRoutes Setup**

`src/routes/AppRoutes.jsx`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import SuperAdminDashboard from '../pages/dashboards/SuperAdminDashboard';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import { Roles } from '../constants/roles';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard/super"
          element={
            <ProtectedRoute allowedRoles={[Roles.SUPER_ADMIN]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={[Roles.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Add other dashboards here similarly */}
      </Routes>
    </BrowserRouter>
  );
}
```

---

### 📦 Tailwind Setup Tips

* Use a global layout with `Sidebar + Header` for dashboards.
* Use utility classes for consistent spacing, colors, and responsiveness.
* Consider installing [daisyUI](https://daisyui.com/) for pre-built components that match Tailwind.

---

### ✅ Next Steps

1. Implement login flow to store `user + token + role`.
2. Protect dashboard routes using the `ProtectedRoute`.
3. Use your Django JWT endpoint to decode and fetch role on login.
4. Build out API service files to handle requests.

Would you like help setting up the login page and JWT integration with your Django backend next?

Absolutely! Here's a **detailed explanation** of what each folder in your `React + Tailwind CSS` frontend project will contain, customized for your role-based NGO management system, **Compass**:

---

## 🔧 Folder-by-Folder Breakdown

### 1. `src/assets/`

**Purpose**: Store static files like images, logos, fonts.

**Examples**:

* `logo.png` — Compass logo
* `illustration.svg` — for hero section
* `backgrounds/` — gradients, patterns, etc.

---

### 2. `src/components/`

**Purpose**: Reusable components across the app.

#### ✅ Subfolders:

* `layout/` → shared UI layout (e.g., sidebar, header)
* `ui/` → basic atomic components (e.g., Button, Card, Modal)

**Examples**:

* `Sidebar.jsx` — contains navigation links, styled for Tailwind
* `Header.jsx` — displays current user, logout
* `Button.jsx` — styled buttons for reusability
* `Modal.jsx` — reusable confirmation/modal dialog

---

### 3. `src/constants/`

**Purpose**: Centralized configuration or constants.

**Examples**:

* `roles.js` — user role constants:

  ```js
  export const Roles = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MANAGEMENT_LEAD: 'management_lead',
    GRANT_OFFICER: 'grant_officer',
  };
  ```
* `endpoints.js` — all Django API URLs in one place
* `colors.js` — custom colors if needed

This improves maintainability.

---

### 4. `src/sections/`

**Purpose**: Sections of the landing page (static content).

**Examples**:

* `HeroSection.jsx` — title, intro to Compass
* `ServicesSection.jsx` — explain what Compass does
* `AboutSection.jsx` — info about the NGO or system

These are NOT full pages, just *parts* of the landing page.

---

### 5. `src/pages/`

**Purpose**: Full pages used in routing (e.g., login, dashboards).

#### ✅ Subfolders:

* `dashboards/` — different dashboard pages based on roles

**Examples**:

* `Landing.jsx` — homepage for visitors
* `Login.jsx` — form for JWT login
* `dashboards/SuperAdminDashboard.jsx` — view for super\_admin
* `dashboards/AdminDashboard.jsx`
* `dashboards/ManagementLeadDashboard.jsx`
* `dashboards/GrantOfficerDashboard.jsx`

Each dashboard will render a layout with charts, stats, and content based on user roles.

---

### 6. `src/routes/`

**Purpose**: Define your app routing and RBAC logic.

**Files**:

* `ProtectedRoute.jsx` — higher-order component to restrict route access based on roles
* `AppRoutes.jsx` — defines all `<Routes />` using React Router v6

You’ll use `useAuth()` here to check if the user is logged in and authorized for a route.

---

### 7. `src/services/`

**Purpose**: API logic layer — all network requests go through here.

**Files**:

* `api.js` — base Axios instance with JWT interceptors
* `authService.js` — login, logout, refresh token
* `grantService.js` — CRUD for grants
* `userService.js` — get user profile and role

Using services separates logic from UI and makes testing easier.

---

### 8. `src/context/`

**Purpose**: Global state using Context API (e.g., user login, token).

**Files**:

* `AuthProvider.jsx` — manages user info, JWT tokens, and login/logout
* `useAuth()` hook — convenient access to context values

You’ll store the user role here after login and use it everywhere.

---

### 9. `src/App.jsx`

**Purpose**: Root component. You wrap `AuthProvider` here and render the routes.

```jsx
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
```

---

### 10. `src/main.jsx`

**Purpose**: Entry point — bootstraps the React app with Tailwind.

```jsx
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // TailwindCSS styles

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

---

## 🧠 Example Workflow

Here's how everything connects during login and role-based dashboard access:

1. **User logs in** via `Login.jsx`
2. **`authService.js`** sends JWT request → stores user role and tokens in `AuthProvider`
3. **`AppRoutes.jsx`** uses `ProtectedRoute` to ensure only the correct role sees their dashboard
4. **Inside dashboard** → you use services (e.g. `grantService.js`) to show grants, etc.

---

## ✅ Summary Table

| Folder        | Purpose                        | Key Examples                |
| ------------- | ------------------------------ | --------------------------- |
| `assets/`     | Static images/files            | Logos, illustrations        |
| `components/` | Reusable components            | Buttons, Header, Sidebar    |
| `constants/`  | Config and static values       | Roles, endpoints            |
| `sections/`   | Landing page sections          | Hero, About, Services       |
| `pages/`      | Main routes/pages              | Login, Landing, Dashboards  |
| `routes/`     | Routing logic and RBAC         | ProtectedRoute, AppRoutes   |
| `services/`   | API request logic              | AuthService, GrantService   |
| `context/`    | Global state (Auth, user info) | AuthProvider, useAuth       |
| `App.jsx`     | Root component                 | Wrap routes in AuthProvider |
| `main.jsx`    | Entry point to render React    | Tailwind entry              |

---

Would you like me to help you scaffold the folder and files using a script or code template?

That’s a great approach — providing clear, timely **feedback to users** is key for good UX, especially in admin dashboards and role-based systems like **Compass**. Below is a breakdown of **how to implement user feedback in your React + Tailwind frontend**, including toast notifications, form validation, loading indicators, and inline messages.

---

## ✅ 1. Toast Notifications (Global Alerts)

### 🔧 Why:

Used for success, error, info messages like:

* “Login successful”
* “Grant submitted”
* “Something went wrong”

### 🛠️ How to Implement:

Use a library like [`react-hot-toast`](https://react-hot-toast.com/) (simple, Tailwind-friendly).

```bash
npm install react-hot-toast
```

### 🔌 Setup:

In `App.jsx`:

```jsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  );
}
```

### 📦 Usage:

In your services or component logic:

```js
import toast from 'react-hot-toast';

// success
toast.success("Grant updated successfully");

// error
toast.error("Something went wrong");

// loading
toast.loading("Uploading...");
```

You can also add custom styles or icons if you like.

---

## ✅ 2. Inline Form Feedback

### 🔧 Why:

Show real-time validation errors next to form fields.

### 📦 Example with Tailwind:

```jsx
<label className="block mb-1 text-sm font-medium">Email</label>
<input
  type="email"
  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
/>
<p className="text-red-500 text-sm mt-1">Invalid email address</p>
```

For better form handling, you can use:

* `react-hook-form` (recommended for simple forms)
* `Formik + Yup` (for complex schema-based validation)

---

## ✅ 3. Modals and Confirmations

### 🔧 Why:

Confirm destructive actions like “Are you sure you want to delete this grant?”

### 🛠️ How:

Create a `Modal` component inside `components/ui/Modal.jsx`

Then control modal visibility via state:

```jsx
{showModal && (
  <Modal
    title="Confirm Delete"
    onConfirm={handleDelete}
    onCancel={() => setShowModal(false)}
  />
)}
```

---

## ✅ 4. Loading Indicators

### 🔧 Why:

Show users that something is happening during API calls.

### 📦 Examples:

#### Inline spinner:

```jsx
{isLoading && (
  <span className="text-blue-500 text-sm">Loading...</span>
)}
```

#### Full-screen spinner:

```jsx
<div className="flex items-center justify-center h-screen">
  <div className="loader" />
</div>
```

Or use a spinner from a library like `react-loader-spinner`.

---

## ✅ 5. Status Alerts / Callouts

### 🔧 Why:

Show contextual alerts on a page (e.g., “No grants available”).

### 📦 Example:

```jsx
<div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
  No grants found for this user.
</div>
```

Can also be used for success messages or errors on data fetch.

---

## ✅ 6. Role-Based Feedback

For unauthorized pages, you can show this in `ProtectedRoute`:

```jsx
return (
  <div className="text-center text-red-600 mt-10">
    You do not have permission to access this dashboard.
  </div>
);
```

---

## ✅ Folder Placement for Feedback Utilities

Here’s how to organize it:

```
src/
│
├── components/
│   └── ui/
│       ├── Modal.jsx
│       ├── AlertBox.jsx
│       ├── Spinner.jsx
│
├── utils/
│   └── toastUtils.js  ← common toast wrappers if you want
```

---

## ✅ Want This Pre-Built?

I can generate starter `Modal`, `Toast`, and `Spinner` components with Tailwind for you, so you can plug them into your UI directly. Would you like that?

Implementing **Light Mode & Dark Mode** in a React + Tailwind CSS project is straightforward and gives users a better experience. Here's a **complete guide** using Tailwind’s built-in dark mode feature (`class` strategy), local storage for persistence, and a toggle button.

---

## 🔧 Step-by-Step Guide

### ✅ 1. **Enable Dark Mode in `tailwind.config.js`**

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // 👈 enables manual control via class
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

### ✅ 2. **Create a `ThemeProvider` Component (handles logic + persistence)**

```jsx
// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // default to system theme
    const stored = localStorage.getItem('theme');
    return stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

---

### ✅ 3. **Wrap Your App in `ThemeProvider`**

```jsx
// src/main.jsx or App.jsx
import { ThemeProvider } from './context/ThemeContext';

const App = () => (
  <ThemeProvider>
    <YourAppRoutes />
  </ThemeProvider>
);

export default App;
```

---

### ✅ 4. **Add a Toggle Button**

```jsx
// src/components/ui/ThemeToggle.jsx
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:ring"
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

---

### ✅ 5. **Style Components with `dark:` Variants**

Tailwind lets you define dark mode styles using `dark:` like this:

```jsx
<div className="bg-white text-black dark:bg-gray-900 dark:text-white p-4 rounded">
  This supports dark mode!
</div>
```

---

### ✅ 6. **Customize Theme (optional)**

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#4f46e5',
      darkBg: '#1f2937',
      lightBg: '#f9fafb',
    },
  },
}
```

Use:

```jsx
<div className="bg-lightBg dark:bg-darkBg text-primary">
```

---

## 📁 Suggested Folder Structure

```
src/
├── context/
│   └── ThemeContext.jsx
├── components/
│   └── ui/
│       └── ThemeToggle.jsx
```

---

## ✅ Final Touch

Add the `<ThemeToggle />` button in your header, sidebar, or navbar so users can switch modes easily.

---

## 🚀 Want me to generate the full ThemeContext and Toggle component code for copy-paste use?

Let me know and I’ll prep that instantly.

Here’s how to **implement a complete login flow in React** using Tailwind CSS, where you:

* Authenticate with your **Django backend**
* Store the **access token**, **refresh token**, and **user info (incl. role)**
* Protect dashboards based on role (super\_admin, admin, etc.)

---

## 🧠 Overview

### What we’ll cover:

1. **Login form**
2. **API call to backend**
3. **Store user data + token in localStorage**
4. **Context to manage authentication globally**
5. **Redirect + role-based dashboard access**

---

## 📁 Suggested Folder Structure

```
src/
├── auth/
│   ├── AuthContext.jsx
│   └── useAuth.js
├── pages/
│   └── Login.jsx
├── utils/
│   └── api.js
```

---

## ✅ 1. Create `AuthContext.jsx`

```jsx
// src/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();

      // Decode JWT or fetch user details
      const userRes = await fetch('http://localhost:8000/api/users/me/', {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      const userData = await userRes.json();

      setToken(data.access);
      setUser(userData);

      localStorage.setItem('token', data.access);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## ✅ 2. Login Page

```jsx
// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded border dark:bg-gray-700"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded border dark:bg-gray-700"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
```

---

## ✅ 3. Protect Routes with Roles

```jsx
// src/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
}
```

---

## ✅ 4. Usage in Routes

```jsx
// src/App.jsx or routes.jsx
import ProtectedRoute from './auth/ProtectedRoute';

<Route path="/dashboard" element={
  <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## ✅ 5. API Utility (Optional)

```js
// src/utils/api.js
export const getToken = () => localStorage.getItem('token');

export const fetchWithAuth = (url, options = {}) => {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
```

---

## 🧠 JWT Notes

* `access` token is sent with each request (`Authorization: Bearer <access>`).
* `refresh` token can be used to regenerate the access token (use `/token/refresh/`).
* You can store both in localStorage, but for more security, you can use `httpOnly` cookies (needs backend change).

---

Would you like me to help implement **refresh token rotation** or **auto logout** after expiry too?

To **protect your dashboard routes** in React based on user **roles**, you’ll use a custom `ProtectedRoute` component. Here’s how to **secure the frontend routes** using `React Router`, your `AuthContext`, and role-based access control (RBAC).

---

## ✅ Step-by-Step: Protect Dashboard Routes

---

### 1. ✅ Create `ProtectedRoute.jsx`

```jsx
// src/auth/ProtectedRoute.jsx
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
```

---

### 2. ✅ Create an `Unauthorized` Page (Optional but recommended)

```jsx
// src/pages/Unauthorized.jsx
export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-xl text-red-600">403 - Unauthorized</h1>
    </div>
  );
}
```

---

### 3. ✅ Apply to Routes

Assuming you have routes defined in your `App.jsx` or a `routes.jsx` file using `react-router-dom`:

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ManagementLeadDashboard from './pages/dashboards/ManagementLeadDashboard';
import GrantOfficerDashboard from './pages/dashboards/GrantOfficerDashboard';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Super Admin */}
        <Route
          path="/super-admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Management Lead */}
        <Route
          path="/lead-dashboard"
          element={
            <ProtectedRoute allowedRoles={['management_lead']}>
              <ManagementLeadDashboard />
            </ProtectedRoute>
          }
        />

        {/* Grant Officer */}
        <Route
          path="/officer-dashboard"
          element={
            <ProtectedRoute allowedRoles={['grant_officer']}>
              <GrantOfficerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
```

---

## 🧪 How It Works

* On each route, the `ProtectedRoute` checks:

  1. If the user is **logged in**
  2. If the user’s **role is allowed** for that route

* If not:

  * Redirect to `/login` if not authenticated
  * Redirect to `/unauthorized` if role is invalid

---

## 🔐 Bonus Tips

* You can add a **`loading` spinner** to handle initial auth check (use `useEffect` + `useState`).
* Use `Navigate` from `react-router-dom` for all redirections.
* Add `fallback UI` in dashboards to handle invalid states gracefully.

---

Would you like me to scaffold one of the dashboards or auto-redirect the user to their role-based dashboard after login?

To **decode your JWT** and **fetch the user role on login**, you’ll implement this flow in your **React frontend** after the login request is made to your Django backend.

---

## ✅ Goal

1. **Send login credentials** to `/api/token/`
2. **Receive access and refresh tokens**
3. **Decode the access token** to extract the `role`
4. **Store the user, token, and role** in context + localStorage

---

## ✅ Assumptions

* You’re using **Django Simple JWT**.
* Your access token payload includes a custom claim like `"role": "admin"` (you’ve added it in your `TokenObtainPairSerializer`).
* You have the following fields in the token: `user_id`, `username`, `email`, `role`

---

## 🧱 1. Install `jwt-decode`

```bash
npm install jwt-decode
```

---

## 🧠 2. Example Login Function

```jsx
// src/auth/useLogin.js
import jwt_decode from "jwt-decode";

export const loginUser = async (username, password) => {
  try {
    const response = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json(); // { access, refresh }
    const decoded = jwt_decode(data.access); // decode access token

    // Example decoded token structure
    // {
    //   user_id: 1,
    //   username: "john",
    //   email: "john@example.com",
    //   role: "admin",
    //   exp: 1234567890
    // }

    const user = {
      id: decoded.user_id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
    };

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    return { user, access: data.access, refresh: data.refresh };
  } catch (error) {
    throw error;
  }
};
```

---

## 🔁 3. Update Your `AuthContext`

Make sure your `AuthContext` reads from `localStorage` and sets user/role info globally.

```jsx
// src/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setAccessToken(token);
    }
  }, []);

  const login = ({ user, access }) => {
    setUser(user);
    setAccessToken(access);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## 🧪 4. In Your Login Page

```jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { loginUser } from "../auth/useLogin";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const { user, access } = await loginUser(username, password);
      login({ user, access });

      // Redirect based on role
      switch (user.role) {
        case "super_admin":
          navigate("/super-admin-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "management_lead":
          navigate("/lead-dashboard");
          break;
        case "grant_officer":
          navigate("/officer-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## ✅ Result

* 🔐 Authenticated users have their `token` and `role` stored
* 🔄 Redirected to the right dashboard
* 🧠 Role is now available globally through `useAuth()`
* 🔒 You can now use `ProtectedRoute` with `allowedRoles`

---

Would you like to implement **token refresh logic** or **logout with role reset** next?


Great! Let’s now **build a clean and scalable API service layer** in your React frontend to manage all HTTP requests to your Django backend (using `fetch`). This improves **code organization**, **reusability**, and makes **token refresh and error handling** centralized.

---

## 🧱 Project Structure

Inside your `src` folder:

```
src/
├── api/
│   ├── axiosInstance.js (if you use axios) OR fetchClient.js
│   ├── auth.js
│   ├── grants.js
│   ├── documents.js
│   └── divisions.js
```

---

## ✅ Step 1: Create `fetchClient.js`

This will:

* Automatically attach the access token
* (Optional) Refresh token if access expires

```js
// src/api/fetchClient.js
const BASE_URL = "http://localhost:8000/api"; // your Django API base

export const fetchClient = async (endpoint, { method = "GET", body, token } = {}) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config);

  // Optional: Add refresh token logic if res.status === 401

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Request failed");
  }

  return res.json();
};
```

---

## ✅ Step 2: Auth API – `src/api/auth.js`

```js
import { fetchClient } from "./fetchClient";

export const loginAPI = async (username, password) => {
  const res = await fetch("http://localhost:8000/api/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json(); // { access, refresh }
};

export const refreshTokenAPI = async (refresh) => {
  const res = await fetch("http://localhost:8000/api/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) throw new Error("Token refresh failed");
  return res.json(); // { access }
};
```

---

## ✅ Step 3: Grants API – `src/api/grants.js`

```js
import { fetchClient } from "./fetchClient";

export const getAllGrants = async (token) => {
  return fetchClient("/grants/", {
    method: "GET",
    token,
  });
};

export const createGrant = async (grantData, token) => {
  return fetchClient("/grants/", {
    method: "POST",
    body: grantData,
    token,
  });
};

export const getGrantById = async (id, token) => {
  return fetchClient(`/grants/${id}/`, {
    method: "GET",
    token,
  });
};
```

---

## ✅ Step 4: Documents API – `src/api/documents.js`

```js
import { fetchClient } from "./fetchClient";

export const getDocuments = async (token) => {
  return fetchClient("/documents/", {
    method: "GET",
    token,
  });
};
```

---

## ✅ Step 5: Divisions API – `src/api/divisions.js`

```js
import { fetchClient } from "./fetchClient";

export const getDivisions = async (token) => {
  return fetchClient("/divisions/", {
    method: "GET",
    token,
  });
};

export const getPrograms = async (token) => {
  return fetchClient("/programs/", {
    method: "GET",
    token,
  });
};
```

---

## 🧪 How to Use It in Components

```js
import { useEffect } from "react";
import { getAllGrants } from "../api/grants";
import { useAuth } from "../auth/AuthContext";

const Dashboard = () => {
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const data = await getAllGrants(accessToken);
        console.log("Grants:", data);
      } catch (error) {
        console.error("Error fetching grants:", error.message);
      }
    };

    fetchGrants();
  }, [accessToken]);

  return <div>Dashboard</div>;
};
```

---

## 🧠 Bonus (Optional): Axios Version

If you prefer `axios` over `fetch`, I can help you build:

* An `axiosInstance` with interceptors for auto-refreshing tokens
* A service-based architecture using Axios

---

Would you like to include:

* ✅ File upload support for documents?
* ✅ Auto token refresh on 401 errors?

Let me know what to implement next!
