from sqlalchemy.orm import Session
from app.models.project import Project
from app.models.project_member import ProjectMember


def create_project(db: Session, name: str, owner_id: int):
    project = Project(name=name, owner_id=owner_id)
    db.add(project)
    db.commit()
    db.refresh(project)

    # ✅ FIX 1: Auto add owner as member
    member = ProjectMember(
        user_id=owner_id,
        project_id=project.id
    )

    db.add(member)
    db.commit()

    return project