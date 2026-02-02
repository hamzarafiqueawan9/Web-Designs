from flask import Blueprint, request, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from typing import Tuple
from sqlalchemy.exc import OperationalError, DatabaseError

from extensions import db
from models import User, Role

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

ALLOWED_ROLES = {role.value for role in Role}


def _validate_registration(payload: dict) -> Tuple[bool, str]:
    required = {"username", "email", "password", "role"}
    if not required.issubset(payload.keys()):
        return False, "Missing required fields"
    if payload.get("role") not in ALLOWED_ROLES:
        return False, "Invalid role"
    return True, ""


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(force=True)
    ok, msg = _validate_registration(data)
    if not ok:
        return jsonify({"error": msg}), 400

    try:
        if User.query.filter((User.username == data["username"]) | (User.email == data["email"])).first():
            return jsonify({"error": "Username or email already exists"}), 409

        user = User(
            username=data["username"],
            email=data["email"],
            role=Role(data["role"]),
        )
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()
        return jsonify({"user": user.to_safe_dict()}), 201
    except (OperationalError, DatabaseError) as e:
        db.session.rollback()
        return jsonify({"error": "Database connection failed. Please ensure MySQL is running."}), 503
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        user = User.query.filter_by(username=username).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid credentials"}), 401

        login_user(user, remember=True)
        return jsonify({"message": "Logged in", "user": user.to_safe_dict()})
    except (OperationalError, DatabaseError):
        return jsonify({"error": "Database connection failed. Please ensure MySQL is running."}), 503
    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"})


@auth_bp.route("/me", methods=["GET"])
def me():
    if not current_user.is_authenticated:
        return jsonify({"authenticated": False}), 200
    return jsonify({"authenticated": True, "user": current_user.to_safe_dict()})
