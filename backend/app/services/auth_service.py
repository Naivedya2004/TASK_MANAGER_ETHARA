from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password, verify_password, create_token

def register_user(db: Session, user):
    db_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role="admin" if "admin" in user.email else "member"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def login_user(db, user):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        return None


    token = create_token({
        "user_id": db_user.id,
        "name": db_user.name,
        "role": db_user.role
    })

    return token