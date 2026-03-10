from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    app_env: str = Field(default='dev', alias='APP_ENV')
    jwt_secret: str = Field(default='change-this-secret', alias='JWT_SECRET')
    jwt_alg: str = Field(default='HS256', alias='JWT_ALG')
    jwt_expire_min: int = Field(default=60 * 24 * 7, alias='JWT_EXPIRE_MIN')
    database_url: str = Field(default='sqlite:///./missionz.db', alias='DATABASE_URL')
    google_client_id: Optional[str] = Field(default=None, alias='GOOGLE_CLIENT_ID')
    emergent_llm_key: Optional[str] = Field(default=None, alias='EMERGENT_LLM_KEY')
    gemini_api_key: Optional[str] = Field(default=None, alias='GEMINI_API_KEY')
    cors_origins: str = Field(default='http://localhost:3000,http://localhost:8081,http://localhost:5173', alias='CORS_ORIGINS')


settings = Settings()
