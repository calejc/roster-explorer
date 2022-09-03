#!/usr/bin/env python3
from collections import Counter
from itertools import chain, combinations, groupby

from app import app
from app.model.models import *


def powerset(iterable):
    """
    Taken from itertools documentation
    https://docs.python.org/3/library/itertools.html#itertools-recipes
    """
    return chain.from_iterable(combinations(list(iterable), r) for r in range(2, 6))


def filter_combination_list(combinations, player_ids):
    filtered_combinations = []
    for k, v in groupby(
        [c for c in combinations if not meaningless(c, player_ids)], lambda x: x[1]
    ):
        filtered_combinations += extract_non_redundant_combinations_into_response_model(
            list(v), player_ids
        )
    return filtered_combinations


def meaningless(combination, player_ids):
    """
    Filter out combinations of 2 or more players that only occur once.
    """
    return (
        combination[1] < 2
        and len(combination[0]) > 2
        and not exact_combo_for_inputted_players(combination[0], player_ids)
    )


def exact_combo_for_inputted_players(combo_players, player_ids):
    return len(combo_players) == len(player_ids) and all(
        player in [p.id for p in combo_players] for player in player_ids
    )


def other_combination_contains_all_players(current_combination, other_combination):
    if other_combination == current_combination:
        return False
    else:
        return all(p in other_combination[0] for p in current_combination[0])


def extract_non_redundant_combinations_into_response_model(
    combinations_of_count, player_ids
):
    """
    Example:
      Given the following 3 combination counter objects with the same Count:
      (1) - 5 occurrences - [playerA, playerB, playerC, playerD]
      (2) - 5 occurrences - [playerA, playerB, playerD]
      (3) - 5 occurrences - [playerA, playerB, playerC]
      We should not return combinations 2 and 3, as they are redundant. Combination 1 gives us that information on its own
    """
    response_list = []
    for current_combo in combinations_of_count:
        if not any(
            other_combination_contains_all_players(current_combo, other_combo)
            for other_combo in combinations_of_count
        ) or exact_combo_for_inputted_players(current_combo[0], player_ids):
            response_list.append(current_combo)
    return [to_response_model(c) for c in response_list]


def to_response_model(c):
    return {c[1]: ["{} {}".format(p.first, p.last) for p in c[0]]}


def to_response(c):
    return {c[1]: ["{} {}".format(p.first, p.last) for p in c[0]]}


def get_exposure_combinations(player_ids, tournaments, positions):
    with app.app_context():
        if len(player_ids) > 0:
            players = (
                db.session.query(PlayerEntity)
                .filter(PlayerEntity.id.in_(player_ids))
                .all()
            )
        else:
            players = db.session.query(PlayerEntity).all()

        draftsForAllPlayers = list(
            set([d for p in players for d in p.drafts if d.tournament in tournaments])
        )
        all_players_from_all_drafts = [
            [p for p in d.players if p.position in positions or p.id in player_ids]
            for d in draftsForAllPlayers
        ]
        ctr = Counter()

        for team in all_players_from_all_drafts:
            for combo in powerset(team):
                ctr[combo] += 1

        combos_containing_inputted_players = [
            combo
            for combo in ctr.most_common()
            if all(player_id in [p.id for p in combo[0]] for player_id in player_ids)
        ]
        return filter_combination_list(combos_containing_inputted_players, player_ids)
