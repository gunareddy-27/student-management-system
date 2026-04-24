# Student Management System (Frontend)

A modern React-based frontend for a student management system, featuring **role-based access**, **rich dashboards**, **CRUD operations**, **real-time activity feeds**, **analytics**, and **interactive timetables**.

This project is designed as the UI layer for a backend API (default: `http://localhost:8080`), but it also includes a number of offline-friendly features that run entirely in the browser.

---

## 🚀 Key Features

### ✅ Access Control & Authentication
- Lightweight auth (email + role) stored in `localStorage`.
- Role switches between **Student** and **Admin** (controls UI / data privileges).
- Protected routes (Dashboard, Student Management, Professor Timetable).

### 📊 Dashboard & Live Feed
- Dynamic welcome dashboard with **activity ticker**, **live system status**, and **quick action cards**.
- Built-in **system health widget** (simulated CPU/RAM/uptime stats).
- Role-aware navigation and UI.

### 🧑‍🎓 Student Management (Admin Only)
- Create / Update / Delete student records.
- Search, sort, filter, and paginate student lists.
- Bulk delete students.
- Detailed student profile modal (attendance progress bar, contact info).
- Export student master data as **JSON**.
- Activity feed logs recent actions in the current session.

### 📘 Course Management (Admin Only)
- Create / Update / Delete course entries.
- Search, sort, filter, and paginate courses.
- Bulk delete courses.
- Export course list as **JSON**.
- Conflict detection when adding duplicate active courses.

### 📈 Analytics
- Visual dashboard with **Chart.js** (Pie, Bar, Doughnut, Line charts).
- Real-time rendering of student vs course distribution.

### 🗓 Timetable & Professor Management
- Academic timetable view with **daily class blocks**.
- Professor timetable view (attendance tracking, salary projection, audited hours).
- Admins can toggle attendance for sessions and see derived salary adjustments.

### 📢 Broadcast System (Admin Only)
- Send in-app broadcast messages to all users (stored in `localStorage`).
- Supports **emergency alerts** with special styling.
- Includes optional **image** and **video (YouTube/local)** embeds.

### 🌙 Dark Mode
- Theme toggle (light/dark) persisted across refresh via `localStorage`.

---

## 🧰 Tech Stack

- **React 19**
- **React Router v7**
- **Framer Motion** (animations)
- **Chart.js** (data visualizations)
- **Axios** (API requests)
- **Create React App** boilerplate

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Install

```bash
npm install
```

### Run

```bash
npm start
```

Then open: http://localhost:3000

> ✅ By default the frontend expects a backend API at `http://localhost:8080` with `/students` and `/courses` endpoints. If you don’t have a backend running, you can still explore the UI and client-side features.

---

## 🧭 How To Use

### 1) Sign Up / Login
- Create an account (any email + password) and choose a role (Student or Admin).
- Admin users unlock full CRUD and broadcast capabilities.

### 2) Dashboard
- Use the dashboard to navigate to **Student Management** or **Professor Timetable**.
- The top ticker shows recent activity and broadcasts.

### 3) Student Management (Admin)
- Create or edit students (name, email, phone, attendance).
- Use the search bar, sort headers, and attendance filters.
- Bulk delete students using checkboxes.
- View student profiles for progress details.

### 4) Course Management (Admin)
- Create or edit course entries (name, code, attendance threshold).
- Search, sort, and page through the course list.
- Export course data as JSON.

### 5) Broadcasts (Admin)
- Use the broadcast button on the management page.
- Configure emergency broadcasts for high-visibility alerts.
- Attach optional image/video URLs.

### 6) Timetables
- **Timetable view** shows a generic weekly schedule for students.
- **Professor timetable** shows a configurable schedule for a selected professor.
- Admins can toggle attendance and see derived salary and auditing stats.

---

## 🗂 Folder Structure (Overview)

```
src/
  App.js                # Main router + app shell
  Dashboard.js          # Landing dashboard
  Login.js / Signup.js  # Basic auth UI
  ProtectedRoute.js     # Route gate for authenticated users
  context/              # Theme provider
  components/           # Reusable UI components (tables, charts, forms)
  styles/               # Theme CSS / dark mode
```

---

## 📝 Notes

- This frontend is intentionally self-contained and uses `localStorage` for session state and broadcasts.
- If you connect it to a real backend, ensure that it provides REST endpoints:
  - `GET /students`, `POST /students`, `PUT /students/:id`, `DELETE /students/:id`
  - `GET /courses`, `POST /courses`, `PUT /courses/:id`, `DELETE /courses/:id`

---

## ✅ Next Improvements (Optional)
- Add real authentication + backend integration (JWT).
- Replace localStorage persistence with database-backed APIs.
- Add role-based access control on the server.
- Add drag-and-drop timetable scheduling.

---

## 📄 License
MIT
