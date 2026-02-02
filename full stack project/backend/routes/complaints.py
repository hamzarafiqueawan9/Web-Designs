from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from typing import Set, Tuple
from sqlalchemy.exc import OperationalError, DatabaseError

from extensions import db
from models import Complaint, ComplaintStatus, Role, log_action

complaints_bp = Blueprint("complaints", __name__, url_prefix="/api/complaints")


def _require_roles(roles: Set[str]) -> Tuple[bool, tuple]:
    if current_user.role.value not in roles:
        return False, (jsonify({"error": "Access denied"}), 403)
    return True, ()


@complaints_bp.route("", methods=["POST"])
@login_required
def create_complaint():
    allowed, resp = _require_roles({Role.ADMIN.value, Role.RESIDENT.value, Role.SECURITY.value, Role.MEDICAL.value})
    if not allowed:
        return resp

    data = request.get_json(force=True)
    title = data.get("title")
    description = data.get("description")
    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400

    try:
        complaint = Complaint(title=title, description=description, created_by=current_user.id)
        db.session.add(complaint)
        db.session.commit()
        log_action(current_user.id, "complaint", complaint.id, "create", f"Title: {title}")
        return jsonify({"complaint": complaint.to_dict()}), 201
    except (OperationalError, DatabaseError):
        db.session.rollback()
        return jsonify({"error": "Database connection failed. Please ensure MySQL is running."}), 503
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to create complaint: {str(e)}"}), 500


@complaints_bp.route("", methods=["GET"])
@login_required
def list_complaints():
    try:
        status_filter = request.args.get("status")
        query = Complaint.query
        if status_filter and status_filter in {s.value for s in ComplaintStatus}:
            query = query.filter_by(status=ComplaintStatus(status_filter))
        results = [c.to_dict() for c in query.order_by(Complaint.created_at.desc()).all()]
        return jsonify({"complaints": results})
    except (OperationalError, DatabaseError):
        return jsonify({"error": "Database connection failed. Please ensure MySQL is running."}), 503
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve complaints: {str(e)}"}), 500


@complaints_bp.route("/<int:complaint_id>", methods=["PUT"])
@login_required
def update_complaint(complaint_id: int):
    try:
        complaint = Complaint.query.get_or_404(complaint_id)
        if complaint.created_by != current_user.id and current_user.role not in {Role.ADMIN, Role.SECURITY}:
            return jsonify({"error": "Access denied"}), 403

        data = request.get_json(force=True)
        title = data.get("title") or complaint.title
        description = data.get("description") or complaint.description
        status = data.get("status") or complaint.status.value
        if status not in {s.value for s in ComplaintStatus}:
            return jsonify({"error": "Invalid status"}), 400

        complaint.title = title
        complaint.description = description
        complaint.status = ComplaintStatus(status)
        db.session.commit()
        log_action(current_user.id, "complaint", complaint.id, "update", f"Status: {status}")
        return jsonify({"complaint": complaint.to_dict()})
    except (OperationalError, DatabaseError):
        db.session.rollback()
        return jsonify({"error": "Database connection failed. Please ensure MySQL is running."}), 503
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update complaint: {str(e)}"}), 500


@complaints_bp.route("/<int:complaint_id>", methods=["DELETE"])
@login_required
def delete_complaint(complaint_id: int):
    try:
        complaint = Complaint.query.get_or_404(complaint_id)
        if complaint.created_by != current_user.id and current_user.role not in {Role.ADMIN}:
            return jsonify({"error": "Access denied"}), 403

        complaint.status = ComplaintStatus.DELETED
        db.session.commit()
        log_action(current_user.id, "complaint", complaint.id, "delete", "Soft delete")
        return jsonify({"message": "Complaint soft-deleted", "complaint": complaint.to_dict()})
    except (OperationalError, DatabaseError):
        db.session.rollback()
        return jsonify({"error": "Database connection failed. Please ensure MySQL is running."}), 503
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete complaint: {str(e)}"}), 500
