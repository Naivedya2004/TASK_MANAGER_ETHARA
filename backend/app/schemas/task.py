from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    project_id: int
    assigned_to: int
    due_date: Optional[datetime] = None