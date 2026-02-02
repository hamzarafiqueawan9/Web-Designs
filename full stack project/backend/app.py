import logging
from logging.handlers import RotatingFileHandler
import os

from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import db, login_manager
from routes.auth import auth_bp
from routes.complaints import complaints_bp


def create_app(config_class=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, supports_credentials=True, origins=app.config.get("CORS_ORIGINS"))

    db.init_app(app)
    login_manager.init_app(app)

    register_logging(app)
    register_blueprints(app)
    register_error_handlers(app)

    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            app.logger.warning(f"Database initialization failed: {e}. Tables may not be created.")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    return app


def register_blueprints(app: Flask) -> None:
    app.register_blueprint(auth_bp)
    app.register_blueprint(complaints_bp)


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(401)
    def unauthorized(_):
        return jsonify({"error": "Unauthorized"}), 401

    @app.errorhandler(403)
    def forbidden(_):
        return jsonify({"error": "Forbidden"}), 403

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        app.logger.exception("Server error: %s", error)
        return jsonify({"error": "Internal server error"}), 500


def register_logging(app: Flask) -> None:
    log_dir = os.path.join(app.instance_path, "logs")
    os.makedirs(log_dir, exist_ok=True)
    file_handler = RotatingFileHandler(
        os.path.join(log_dir, "app.log"), maxBytes=1024 * 1024 * 5, backupCount=5
    )
    file_handler.setLevel(app.config.get("LOG_LEVEL", "INFO"))
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")
    file_handler.setFormatter(formatter)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(app.config.get("LOG_LEVEL", "INFO"))


if __name__ == "__main__":
    flask_app = create_app()
    flask_app.run(host="0.0.0.0", port=5000, debug=True)
