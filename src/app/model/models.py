from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

draft_player_relational_table = db.Table(
    "draft_player",
    db.Column("player_id", db.ForeignKey("player.id")),
    db.Column("draft_id", db.ForeignKey("draft.id")),
    db.UniqueConstraint("draft_id", "player_id"),
)


class DraftEntity(db.Model):
    __tablename__ = "draft"
    id = db.Column(db.String, primary_key=True)
    tournament = db.Column(db.String, nullable=False)
    players = db.relationship(
        "PlayerEntity",
        secondary=draft_player_relational_table,
        back_populates="drafts",
        cascade="all",
        lazy="subquery"
    )


class PlayerEntity(db.Model):
    __tablename__ = "player"
    id = db.Column(db.String, primary_key=True)
    first = db.Column(db.String, nullable=False)
    last = db.Column(db.String, nullable=False)
    team = db.Column(db.String, nullable=False)
    position = db.Column(db.String, nullable=False)
    drafts = db.relationship(
        "DraftEntity",
        secondary=draft_player_relational_table,
        back_populates="players",
        cascade="all",
        lazy="subquery"
    )

    @property
    def serialize_lazy(self):
        return {
            "id": self.id,
            "first": self.first,
            "last": self.last,
            "team": self.team,
            "position": self.position,
        }

    @property
    def serialize_eager(self):
        lazy = self.serialize_lazy()
        lazy["drafts"] = [d.serialize for d in self.drafts]