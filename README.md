# CourseNest Server ⚙️

> Backend API for CourseNest — An EdTech SaaS Platform

REST API built with Express.js and TypeScript powering the CourseNest platform.

---

## 🌐 Links

| Service | URL |
|---|---|
| 🖥️ Live API | https://coursenest-server.vercel.app |
| 📁 Client Repository | https://github.com/Tariqul-stack/coursenest-client |
| 📁 Server Repository | https://github.com/Tariqul-stack/coursenest-server |

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---|---|---|
| Express.js | 5 | Backend framework |
| TypeScript | 5+ | Type safety |
| MongoDB + Mongoose | 9 | Database + ODM |
| JSON Web Token | 9 | Authentication |
| Bcryptjs | 3 | Password hashing |
| UUID | latest | Certificate ID generation |
| tsx | latest | TypeScript execution |
| Nodemon | latest | Development auto-restart |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### 1. Clone & Install
```bash
git clone https://github.com/Tariqul-stack/coursenest-server.git
cd coursenest-server
npm install
```

### 2. Environment Variables
Create `.env` file in root:
```
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/courseNest-db
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

### 3. Seed Database
```bash
npx tsx src/seed.ts
```

### 4. Start Development Server
```bash
npm run dev
```

Server runs on: `http://localhost:8000`

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@coursenest.com | admin123 |
| Teacher | teacher@coursenest.com | admin123 |
| Student | student@coursenest.com | admin123 |

---

## 📁 Project Structure

```
coursenest-server/
└── src/
    ├── controllers/
    │   ├── admin.controller.ts
    │   ├── auth.controller.ts
    │   ├── course.controller.ts
    │   ├── enrollment.controller.ts
    │   ├── qa.controller.ts
    │   └── review.controller.ts
    ├── middleware/
    │   └── auth.middleware.ts
    ├── models/
    │   ├── Course.ts
    │   ├── Enrollment.ts
    │   ├── QAPost.ts
    │   ├── Review.ts
    │   └── User.ts
    ├── routes/
    │   ├── admin.routes.ts
    │   ├── auth.routes.ts
    │   ├── course.routes.ts
    │   ├── enrollment.routes.ts
    │   ├── qa.routes.ts
    │   └── review.routes.ts
    ├── lib/
    │   └── db.ts
    ├── seed.ts
    └── index.ts
```

---

## 🔗 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /register | Public | Register new user |
| POST | /login | Public | Login, returns JWT |
| GET | /me | Auth | Get current user |

### Courses — `/api/courses`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | / | Public | Get all published courses |
| GET | /:id | Public | Get single course |
| POST | / | Teacher | Create course |
| PUT | /:id | Teacher | Update course |
| DELETE | /:id | Teacher/Admin | Delete course |
| PATCH | /:id/status | Teacher/Admin | Toggle draft/published |
| GET | /my-courses | Teacher | Get own courses |

### Enrollments — `/api/enrollments`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | / | Student | Enroll free course |
| POST | /paid | Student | Enroll paid course |
| GET | /my | Student | Get my enrollments |
| PATCH | /:id/progress | Student | Update lesson progress |
| GET | /certificate/:id | Public | Get certificate |
| GET | /course/:courseId | Teacher/Admin | Get course enrollments |

### Reviews — `/api/reviews`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | / | Enrolled Student | Post review |
| GET | /course/:id | Public | Get course reviews |
| GET | /my | Student | Get my reviews |
| PUT | /:id | Author | Edit review |
| DELETE | /:id | Author/Admin | Delete review |

### Community Q&A — `/api/qa`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | / | Public | Get all posts |
| POST | / | Auth | Post question |
| GET | /:id | Public | Get post with answers |
| DELETE | /:id | Author/Admin | Delete post |
| POST | /:id/answers | Auth | Post answer |
| PATCH | /:id/answers/:aid/accept | Post Author | Accept answer |
| DELETE | /:id/answers/:aid | Author/Admin | Delete answer |

### Admin — `/api/admin`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /users | Admin | Get all users |
| PATCH | /users/:id/role | Admin | Change user role |
| DELETE | /users/:id | Admin | Delete user |

---

## 🌍 Deployment

Deployed on **Vercel** with **MongoDB Atlas** as cloud database.

### Environment Variables (Production)
Set these in Vercel dashboard:
```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-client-url.vercel.app
```