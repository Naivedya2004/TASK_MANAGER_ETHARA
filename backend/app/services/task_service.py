from sqlalchemy.orm import Session
from app.models.task import Task
from app.models.project_member import ProjectMember
from fastapi import HTTPException


def create_task(db: Session, task):
    # Validate user is part of project
    member = db.query(ProjectMember).filter(
        ProjectMember.user_id == task.assigned_to,
        ProjectMember.project_id == task.project_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=403,
            detail="User not part of project"
        )

    new_task = Task(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task