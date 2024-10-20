from sqlalchemy import Column, Integer, String, JSON, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base

"""
This module defines SQLAlchemy data models for our web application. 
It includes classes, representing users, groups, and associated data. 
Relationships between these models enable efficient data retrieval and manipulation

"""
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String, index=True, unique=True)
    data_count = Column(Integer, default=0)

    data = relationship('Data', backref='users')
    user_plots = relationship('UserPlots', backref='users')

    def __repr__(self) -> str:
        return f"<User(id={self.id}, user_id={self.user_id}, data_count={self.data_count})>"


class Group(Base):
    __tablename__ = 'groups'

    id = Column(Integer, primary_key=True)
    group_id = Column(String, index=True, unique=True)

    data = relationship('Data', backref='groups')
    group_plots = relationship('GroupPlots', backref='groups')
    

    def __repr__(self) -> str:
        return f"<Group(id={self.id}, group_id={self.group_id})>"


class Data(Base):
    __tablename__ = "data"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.user_id'), index=True)  
    group_id = Column(String, ForeignKey('groups.group_id'), index=True, nullable=True)
    rows = Column(Integer)
    balls = Column(Integer)
    probabilityLeft = Column(Float)
    probabilityRight = Column(Float)
    stats = Column(JSON)
    prog_stats = Column(JSON)


    def __repr__(self) -> str:
        return (f"<Data(id={self.id}, group_id={self.group_id}, user_id={self.user_id}, rows={self.rows}, "
                f"balls={self.balls}, probabilityLeft={self.probabilityLeft}, "
                f"probabilityRight={self.probabilityRight}, stats={self.stats}, prog_stats={self.prog_stats})>")


class UserPlots(Base):
    __tablename__ = "user_plots"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("users.user_id"), index=True)
    plot_path = Column(String)


class GroupPlots(Base):
    __tablename__ = "group_plots"

    id = Column(Integer, primary_key=True)
    group_id = Column(String, ForeignKey("groups.group_id"), index=True)
    plot_path = Column(String)


