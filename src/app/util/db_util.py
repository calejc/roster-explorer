#!/usr/bin/env python3
import csv
from app.model.models import *
from app import app

fp = 'data.csv'

def draft_contains_player(draft, playerId):
  return playerId in [p.id for p in draft.players]

def toDraftedPlayer(row):
  with app.app_context():
    existingDraft = db.session.query(DraftEntity).filter_by(id=row['Draft']).all()
    if len(existingDraft) == 0:
      playersDraft = DraftEntity(
        id = row['Draft'],
        tournament = row['Tournament Title']
      )
    elif draft_contains_player(existingDraft[0], row['Appearance']):
      return
    else:
      playersDraft = existingDraft[0]

    existingPlayer = db.session.query(PlayerEntity).filter_by(id=row['Appearance']).all()
    if len(existingPlayer) == 0:
      player = PlayerEntity(
        id = row['Appearance'],
        first = row['First Name'],
        last = row['Last Name'],
        team = row['Team'],
        position = row['Position'],
      )
    else:
      player = existingPlayer[0]
    player.drafts.append(playersDraft)
    db.session.add(player)
    db.session.commit()

def persist_new_data():
  with open(fp, 'r') as f:
    [toDraftedPlayer(p) for p in csv.DictReader(f)]

def get_players():
  return db.session.query(PlayerEntity).all()

def get_tournaments():
  return DraftEntity.query.with_entities(DraftEntity.tournament).distinct().all()