"""
Web-adapted command-line interface for Horse Race Plotter.
Handles display and input for browser-based execution.
"""
import time
import asyncio
from typing import List
from game_logic import Horse, RaceState
from questions import Question


class WebGameCLI:
    """Handles the web-based interface for the game."""
    
    def __init__(self, race_state):
        self.race = race_state
        self.start_time = None
    
    def print(self, text=''):
        """Print to web terminal."""
        try:
            # Try to use web_print if available (set by JavaScript)
            import js
            js.web_print(text)
        except:
            print(text)
    
    async def input_async(self, prompt=''):
        """Get input asynchronously from web terminal."""
        try:
            import js
            result = await js.web_input(prompt)
            return str(result)
        except:
            return input(prompt)
    
    def display_title(self):
        """Display the game title."""
        self.print("=" * 60)
        self.print(" " * 15 + "🐎 HORSE RACE PLOTTER 🐎")
        self.print("=" * 60)
        self.print()
    
    def display_instructions(self):
        """Display game instructions."""
        self.print("Welcome to Horse Race Plotter!")
        self.print()
        self.print("HOW TO PLAY:")
        self.print("• Answer survey questions as quickly and accurately as possible")
        self.print("• Correct answers move your horse forward")
        self.print("• Faster answers earn bonus distance")
        self.print("• First horse to cross the finish line wins!")
        self.print()
        self.print(f"Race distance: {self.race.finish_distance if self.race else 100} units")
        self.print(f"Maximum turns: {self.race.max_turns if self.race else 15}")
        self.print()
    
    async def display_horse_selection(self, horses: List[str]) -> str:
        """Display horse selection menu and get player choice."""
        self.print("Available horses/teams:")
        self.print()
        for i, name in enumerate(horses, 1):
            self.print(f"  {i}. {name}")
        self.print()
        
        while True:
            choice = await self.input_async("Select your horse (1-{}): ".format(len(horses)))
            try:
                choice_num = int(choice)
                if 1 <= choice_num <= len(horses):
                    return horses[choice_num - 1]
                else:
                    self.print(f"Please enter a number between 1 and {len(horses)}")
            except ValueError:
                self.print("Please enter a valid number")
    
    def display_race_view(self):
        """Display the current state of the race."""
        self.print("")
        self.print("=" * 60)
        self.print(f"Turn {self.race.current_turn}")
        self.print("-" * 60)
        
        for horse in self.race.get_standings():
            # Calculate track position
            track_length = 40
            horse_position = int((horse.distance / self.race.finish_distance) * track_length)
            horse_position = min(horse_position, track_length)
            
            # Build track
            track = "🐎" + "-" * horse_position + "|" + " " * (track_length - horse_position)
            
            marker = "►" if not horse.is_ai else " "
            
            self.print(f"{marker} {horse.name:15s}: {track} {horse.distance:5.1f}")
        
        self.print("-" * 60)
        self.print(f"Finish line at: {self.race.finish_distance} units")
        self.print("=" * 60)
        self.print()
    
    def display_question(self, question: Question, question_num: int, total_questions: int):
        """Display a question with its answers."""
        self.print(f"\n📝 Question {question_num}/{total_questions}")
        self.print(f"Category: {question.category.upper()}")
        self.print()
        self.print(question.text)
        self.print()
        
        for i, answer in enumerate(question.answers, 1):
            self.print(f"  {i}. {answer}")
        self.print()
    
    async def get_answer(self, num_answers: int) -> tuple:
        """
        Get player's answer and measure response time.
        Returns (answer_index, time_taken_seconds).
        """
        start_time = time.time()
        
        while True:
            choice = await self.input_async("Your answer (1-{}): ".format(num_answers))
            try:
                answer_num = int(choice)
                if 1 <= answer_num <= num_answers:
                    end_time = time.time()
                    time_taken = end_time - start_time
                    return answer_num - 1, time_taken
                else:
                    self.print(f"Please enter a number between 1 and {num_answers}")
            except ValueError:
                self.print("Please enter a valid number")
    
    def display_answer_feedback(self, is_correct: bool, correct_index: int, 
                                time_taken: float, distance_gained: float):
        """Display feedback about the player's answer."""
        self.print()
        if is_correct:
            self.print("✅ Correct!")
        else:
            self.print(f"❌ Incorrect. The correct answer was #{correct_index + 1}")
        
        self.print(f"⏱️  Response time: {time_taken:.2f} seconds")
        self.print(f"📏 Distance gained: {distance_gained:.1f} units")
        self.print()
    
    def display_winner(self):
        """Display the winner and final standings."""
        self.print("")
        self.print("=" * 60)
        self.print(" " * 22 + "🏆 RACE COMPLETE! 🏆")
        self.print("=" * 60)
        self.print()
        
        if self.race.winner:
            winner_marker = "👑" if not self.race.winner.is_ai else "🤖"
            self.print(f"{winner_marker} WINNER: {self.race.winner.name} with {self.race.winner.distance:.1f} units!")
        self.print()
        
        self.print("Final Standings:")
        self.print("-" * 60)
        
        for rank, horse in enumerate(self.race.get_standings(), 1):
            pct_complete = (horse.distance / self.race.finish_distance) * 100
            avg_time = horse.get_average_time()
            correct_count = horse.get_correct_count()
            total_turns = len(horse.history)
            
            marker = "►" if not horse.is_ai else " "
            
            self.print(f"{rank}. {marker} {horse.name:15s}")
            self.print(f"   Distance: {horse.distance:6.1f} ({pct_complete:5.1f}% complete)")
            self.print(f"   Correct: {correct_count}/{total_turns}  |  Avg time: {avg_time:.2f}s")
            self.print()
        
        self.print("=" * 60)
