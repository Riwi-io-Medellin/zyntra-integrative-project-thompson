import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+asyncmy://root:password@localhost/zyntra")

engine = create_async_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


class BusquedaDB(Base):
    __tablename__ = "busquedas"
    id          = Column(Integer, primary_key=True, autoincrement=True)
    query       = Column(String(255))
    search_term = Column(String(255))
    intent      = Column(String(500))
    total       = Column(Integer)
    creado_en   = Column(DateTime, default=datetime.utcnow)


class ProductoDB(Base):
    __tablename__ = "productos"
    id             = Column(Integer, primary_key=True, autoincrement=True)
    busqueda_id    = Column(Integer)
    store          = Column(String(100))
    name           = Column(String(500))
    price          = Column(Float)
    original_price = Column(Float, nullable=True)
    currency       = Column(String(10), default="COP")
    url            = Column(Text)
    image_url      = Column(Text)
    brand          = Column(String(200))
    category       = Column(String(200))
    in_stock       = Column(Boolean, default=True)
    rating         = Column(Float, nullable=True)
    creado_en      = Column(DateTime, default=datetime.utcnow)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)