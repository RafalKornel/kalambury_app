from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from . import db, login_manager
from werkzeug.security import check_password_hash, generate_password_hash


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)
    _password_hash = db.Column(db.String(200), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey("groups.id"))
    words = db.relationship("Word", backref="user")

    @property
    def password(self):
        return AttributeError("Attribute not accessible.")

    @password.setter
    def password(self, password):
        self._password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f"<User {self.name}>"


class Group(db.Model):
    __tablename__ = "groups"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True)
    key = db.Column(db.String(30), unique=True)
    users = db.relationship("User", backref="group")

    def __repr__(self):
        return f"<Group {self.name}>"


class Word(db.Model):
    __tablename__ = "words"
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(30), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    group = db.Column(db.String(30))

    def format(self):
        return {"word": self.word,
                "user": self.user.name }

    def __repr__(self):
        return f"<Word {self.word}>"