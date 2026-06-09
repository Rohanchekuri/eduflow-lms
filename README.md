# EduFlow — Full-Stack E-Learning Platform

A complete, production-ready online course platform built with **React**, **Node.js (Express)**, **MongoDB**, **JWT Authentication**, and **Razorpay** payments.

---

## 🚀 Features

### Authentication
- User Registration & Login with JWT
- Email verification on signup
- Forgot Password & Reset via email
- Persistent sessions with localStorage

### User Dashboard
- Browse, search & filter courses
- View course details (modules, lessons, price)
- Track enrolled courses with progress bars

### Enrollment & Payment
- Razorpay payment integration (Test Mode)
- Demo mode (no Razorpay keys needed)
- Automatic enrollment after payment
- Email confirmation on enrollment

### Learning System
- Module → Lesson structure
- Video player UI
- Mark lessons complete
- Real-time progress % tracking
- Sidebar with full curriculum

### Admin Panel
- Add / Edit / Delete courses
- Seed demo course data with one click
- View all users and enrollments
- Revenue and stats dashboard

### Notifications
- Registration welcome email
- Enrollment confirmation email
- Password reset email

---

## 🛠️ Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React 18, React Router v6     |
| Backend   | Node.js, Express.js           |
| Database  | MongoDB + Mongoose            |
| Auth      | JWT + bcryptjs                |
| Payments  | Razorpay (Test Mode)          |
| Email     | Nodemailer (Gmail SMTP)       |
| Fonts     | Syne + DM Sans (Google Fonts) |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js ≥ 16
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email, optional)
- Razorpay test account (optional)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eduflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Email (Gmail SMTP — enable "App Passwords" in Google Account)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Razorpay (Test Mode keys from dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

CLIENT_URL=http://localhost:3000
```

Add to `client/.env` (create new file):
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### 3. Seed Admin User

```bash
cd server
node seed.js
```

Credentials:
- **Admin**: admin@eduflow.com / admin123
- **Demo User**: demo@eduflow.com / user123

### 4. Run the App

**Terminal 1 — Backend:**
```bash
cd server
node index.js
# Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start
# App running on http://localhost:3000
```

### 5. Seed Demo Courses

1. Login as admin (admin@eduflow.com / admin123)
2. Go to Admin Panel → Dashboard
3. Click **"Seed Demo Courses"**
4. 6 sample courses are created instantly!

---

## 📁 Project Structure

```
eduflow/
├── server/
│   ├── index.js              # Express app entry
│   ├── seed.js               # Admin/user seed script
│   ├── .env                  # Environment variables
│   ├── models/
│   │   ├── User.js           # User model + auth methods
│   │   ├── Course.js         # Course + modules + lessons
│   │   └── Enrollment.js     # Enrollment + progress
│   ├── routes/
│   │   ├── auth.js           # Register, login, verify, reset
│   │   ├── courses.js        # Public + protected course routes
│   │   ├── enrollments.js    # My courses + progress tracking
│   │   ├── payments.js       # Razorpay order + verify
│   │   ├── admin.js          # Admin CRUD + stats + seed
│   │   └── users.js          # Profile + password change
│   ├── middleware/
│   │   └── auth.js           # JWT protect + authorize
│   └── utils/
│       └── email.js          # Nodemailer email templates
│
└── client/
    └── src/
        ├── App.js            # Router + layout
        ├── index.css         # Global design system
        ├── context/
        │   └── AuthContext.js
        ├── utils/
        │   └── api.js        # Axios instance
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   └── CourseCard.js
        └── pages/
            ├── Home.js       # Landing page
            ├── About.js
            ├── Courses.js    # Browse + filter
            ├── CourseDetail.js  # Enroll + curriculum
            ├── Auth.js       # Login + Register + ForgotPw
            ├── Dashboard.js  # User's enrolled courses
            ├── LearnPage.js  # Video player + progress
            ├── AdminPanel.js # Admin CRUD dashboard
            └── Profile.js    # Account settings
```

---

## 💳 Razorpay Integration

The app runs in **Demo Mode** when Razorpay keys aren't configured — enrollment works without real payment.

For live Razorpay:
1. Create account at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Get Test Mode keys
3. Add to `server/.env` and `client/.env`
4. Add Razorpay script to `client/public/index.html`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

## 🎨 Design System

- **Colors**: Deep purple (#0a0718) background, violet (#7c3aed) accent
- **Typography**: Syne (display) + DM Sans (body)
- **Components**: Cards, badges, progress bars, modals, alerts
- **Responsive**: Mobile-first, CSS Grid layout

---

## 📧 Email Setup (Gmail)

1. Enable 2FA on your Google Account
2. Go to Security → App Passwords
3. Generate password for "Mail"
4. Use it as `EMAIL_PASS` in `.env`

---

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/verify-email/:token | — | Verify email |
| POST | /api/auth/forgot-password | — | Send reset email |
| POST | /api/auth/reset-password/:token | — | Reset password |
| GET | /api/courses | — | List courses |
| GET | /api/courses/:id | — | Course detail |
| GET | /api/courses/:id/content | User | Enrolled content |
| GET | /api/enrollments/my | User | My enrollments |
| POST | /api/enrollments/progress | User | Mark lesson done |
| POST | /api/payments/create-order | User | Create Razorpay order |
| POST | /api/payments/verify | User | Verify & enroll |
| GET | /api/admin/stats | Admin | Dashboard stats |
| POST | /api/admin/courses | Admin | Create course |
| PUT | /api/admin/courses/:id | Admin | Update course |
| DELETE | /api/admin/courses/:id | Admin | Delete course |
| GET | /api/admin/users | Admin | All users |
| GET | /api/admin/enrollments | Admin | All enrollments |
| POST | /api/admin/seed | Admin | Seed demo data |
