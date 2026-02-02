import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-me")
    SESSION_COOKIE_NAME = "nexuscare_session"
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "mysql+pymysql://nexuscare:nexuscare@localhost:3306/nexuscare",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_PROTECTION = "strong"
    REMEMBER_COOKIE_DURATION = 86400  # seconds
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173")
    LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
