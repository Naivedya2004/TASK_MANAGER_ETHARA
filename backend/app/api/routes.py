from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import get_db
from app.api.deps import get_current_user

from app.schemas.user import UserCreate, UserLogin
from app.schemas.project import ProjectCreate
from app.schemas.task import TaskCreate

from app.services.auth_service import register_user, login_user
from app.services.project_service import create_project
from app.services.task_service import create_task

from app.models.project import Project
from app.models.task import Task
from app.models.project_member import ProjectMember

router = APIRouter()

# AUTH
@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    return register_user(db, user)

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    token = login_user(db, user)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": token}

# PROJECT
@router.post("/projects")
def create_proj(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")

    return create_project(db, project.name, current_user.id)

    return create_project(db, project.name, current_user.id)

@router.get("/projects")
def get_projects(db: Session = Depends(get_db),
                 current_user=Depends(get_current_user)):

    return db.query(Project).all()

# TASK
@router.post("/tasks")
def create_t(task: TaskCreate,
             db: Session = Depends(get_db),
             current_user=Depends(get_current_user)):

    return create_task(db, task)

@router.get("/tasks")
def get_tasks(db: Session = Depends(get_db),
              current_user=Depends(get_current_user)):

    return db.query(Task).all()

@router.put("/tasks/{task_id}")
def update_task(task_id: int,
                payload: dict,
                db: Session = Depends(get_db),
                current_user=Depends(get_current_user)):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if current_user.id != task.assigned_to:
        raise HTTPException(status_code=403, detail="Not allowed")

    task.status = payload.get("status", task.status)
    db.commit()
    db.refresh(task)

    return task

# DASHBOARD
@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db),
              current_user=Depends(get_current_user)):

    tasks = db.query(Task).all()

    total = len(tasks)
    completed = len([t for t in tasks if t.status == "completed"])
    pending = total - completed
    overdue = len([
        t for t in tasks
        if t.due_date and t.due_date < datetime.utcnow() and t.status != "completed"
    ])

    return {
        "total_tasks": total,
        "completed": completed,
        "pending": pending,
        "overdue": overdue
    }