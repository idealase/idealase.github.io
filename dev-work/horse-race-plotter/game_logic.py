"""
Core game logic for Horse Race Plotter.
Handles game state, scoring, and horse movement.
"""
import random
from typing import Dict, List, Optional
from dataclasses import dataclass, field


@dataclass
class TurnData:
    """Data for a single turn in the race."""
    turn: int
    distance_cumulative: float
    answer_time: float
    was_correct: bool
    score_for_turn: float


@dataclass
class Horse:
    """Represents a horse/team in the race."""
    name: str
    distance: float = 0.0
    is_ai: bool = True
    history: List[TurnData] = field(default_factory=list)
    
    def add_turn_data(self, turn: int, distance_gained: float, answer_time: float, was_correct: bool) -> None:
        """Add data for a turn to the horse's history."""
        self.distance += distance_gained
        turn_data = TurnData(
            turn=turn,
            distance_cumulative=self.distance,
            answer_time=answer_time,
            was_correct=was_correct,
            score_for_turn=distance_gained
        )
        self.history.append(turn_data)
    
    def get_average_time(self) -> float:
        """Get the average answer time for this horse."""
        if not self.history:
            return 0.0
        return sum(turn.answer_time for turn in self.history) / len(self.history)
    
    def get_correct_count(self) -> int:
        """Get the number of correct answers."""
        return sum(1 for turn in self.history if turn.was_correct)


class ScoringSystem:
    """Handles scoring calculations for the race."""
    
    def __init__(self, base_distance_correct: float = 10.0, 
                 base_distance_incorrect: float = 0.0,
                 speed_factor: float = 8.0,
                 max_time_bonus: float = 5.0):
        self.base_distance_correct = base_distance_correct
        self.base_distance_incorrect = base_distance_incorrect
        self.speed_factor = speed_factor
        self.max_time_bonus = max_time_bonus
    
    def calculate_distance(self, is_correct: bool, answer_time: float) -> float:
        """
        Calculate distance gained based on correctness and speed.
        
        Formula:
        - Base distance: base_distance_correct if correct, base_distance_incorrect if not
        - Time bonus: max(0, max_time_bonus * (1 - answer_time / speed_factor))
        - Total: base + time_bonus (only if correct)
        """
        if not is_correct:
            return self.base_distance_incorrect
        
        base = self.base_distance_correct
        
        # Calculate time bonus (faster answers get more bonus)
        # Bonus decreases linearly with time, capped at max_time_bonus
        time_ratio = min(answer_time / self.speed_factor, 1.0)
        time_bonus = self.max_time_bonus * (1 - time_ratio)
        time_bonus = max(0, time_bonus)
        
        return base + time_bonus


class RaceState:
    """Manages the overall race state."""
    
    def __init__(self, horse_names: List[str], player_horse_name: str,
                 finish_distance: float = 100.0, max_turns: int = 15,
                 scoring_system: Optional[ScoringSystem] = None):
        self.horses: List[Horse] = []
        self.finish_distance = finish_distance
        self.max_turns = max_turns
        self.current_turn = 0
        self.scoring_system = scoring_system or ScoringSystem()
        self.winner: Optional[Horse] = None
        
        # Create horses
        for name in horse_names:
            is_player = (name == player_horse_name)
            horse = Horse(name=name, is_ai=not is_player)
            self.horses.append(horse)
        
        # Find player horse
        self.player_horse = next((h for h in self.horses if not h.is_ai), None)
    
    def process_turn(self, horse: Horse, is_correct: bool, answer_time: float) -> float:
        """Process a turn for a horse and return distance gained."""
        self.current_turn += 1
        distance_gained = self.scoring_system.calculate_distance(is_correct, answer_time)
        horse.add_turn_data(self.current_turn, distance_gained, answer_time, is_correct)
        return distance_gained
    
    def simulate_ai_turn(self, horse: Horse) -> float:
        """Simulate an AI horse's turn."""
        # AI has a 70% chance of getting it right
        is_correct = random.random() < 0.7
        
        # AI answer time between 2 and 10 seconds, with some variation
        answer_time = random.uniform(2.0, 10.0)
        
        return self.process_turn(horse, is_correct, answer_time)
    
    def check_winner(self) -> Optional[Horse]:
        """Check if any horse has won the race."""
        for horse in self.horses:
            if horse.distance >= self.finish_distance:
                if not self.winner:
                    self.winner = horse
                return self.winner
        
        # Also check if max turns reached
        if self.current_turn >= self.max_turns:
            # Winner is the horse with the most distance
            self.winner = max(self.horses, key=lambda h: h.distance)
            return self.winner
        
        return None
    
    def is_game_over(self) -> bool:
        """Check if the game is over."""
        return self.winner is not None
    
    def get_standings(self) -> List[Horse]:
        """Get horses sorted by distance (descending)."""
        return sorted(self.horses, key=lambda h: h.distance, reverse=True)
    
    def get_race_data(self) -> Dict:
        """Get all race data for plotting."""
        data = {
            'horses': [],
            'max_turns': max(len(h.history) for h in self.horses) if self.horses else 0
        }
        
        for horse in self.horses:
            horse_data = {
                'name': horse.name,
                'is_ai': horse.is_ai,
                'final_distance': horse.distance,
                'turns': [turn.turn for turn in horse.history],
                'distances': [turn.distance_cumulative for turn in horse.history],
                'times': [turn.answer_time for turn in horse.history],
                'correct': [turn.was_correct for turn in horse.history]
            }
            data['horses'].append(horse_data)
        
        return data
