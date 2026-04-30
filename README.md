 Team Task Manager 🚀

A full-stack **Team Task Management System** built using **FastAPI, PostgreSQL, React, and Tailwind CSS**. The system allows teams to create projects, assign tasks, and track progress with role-based access control.

---

 Features

 Authentication

* User Signup & Login
* JWT-based authentication
* Role-based access (Admin / Member)

 Project Management

* Admin can create projects
* Admin automatically becomes project member
* View all projects

 Task Management

* Create tasks inside projects
* Assign tasks to users
* Update task status (Pending / Completed)
* Project-based task filtering

 Dashboard

* Total tasks count
* Completed tasks
* Pending / Overdue tasks

---

 Tech Stack

 Backend

* FastAPI (Python)
* SQLAlchemy ORM
* PostgreSQL
* JWT Authentication

 Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Router

---

 Project Structure

```
team-task-manager/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── db/
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── api/
│   └── vite.config.js
│
└── README.md
```

---

 Installation & Setup

 Clone Repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

---

 Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend:

```bash
uvicorn app.main:app --reload
```

---

 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

 Environment Variables

Create `.env` file in backend:

```
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60


 API Endpoints

 Auth

* POST `/signup`
* POST `/login`

 Projects

* POST `/projects` (Admin only)
* GET `/projects`

 Tasks

* POST `/tasks`
* GET `/tasks`
* PUT `/tasks/{id}`

 Dashboard

* GET `/dashboard`



 Key Logic Highlights

* Only admins can create projects
* Project creator is auto-added as member
* Task creation validated by project membership
* Users can update task status
