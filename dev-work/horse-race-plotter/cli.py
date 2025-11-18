"""
Command-line interface for Horse Race Plotter.
Handles display, input, and game flow.
"""
import time
from typing import List, Optional
from game_logic import Horse, RaceState
from questions import Question


class GameCLI:
    """Handles the command-line interface for the game."""
    
    def __init__(self, race_state: RaceState):
        self.race = race_state
    
    def clear_screen(self) -> None:
        """Clear the terminal screen (simple version for cross-platform)."""
        print("\n" * 2)
    
    def display_title(self) -> None:
        """Display the game title."""
        print("=" * 60)
        print(" " * 15 + "🐎 HORSE RACE PLOTTER 🐎")
        print("=" * 60)
        print()
    
    def display_instructions(self) -> None:
        """Display game instructions."""
        print("Welcome to Horse Race Plotter!")
        print()
        print("HOW TO PLAY:")
        print("• Answer survey questions as quickly and accurately as possible")
        print("• Correct answers move your horse forward")
        print("• Faster answers earn bonus distance")
        print("• First horse to cross the finish line wins!")
        print()
        print(f"Race distance: {self.race.finish_distance} units")
        print(f"Maximum turns: {self.race.max_turns}")
        print()
    
    def display_horse_selection(self, horses: List[str]) -> str:
        """Display horse selection menu and get player choice."""
        print("Available horses/teams:")
        print()
        for i, name in enumerate(horses, 1):
            print(f"  {i}. {name}")
        print()
        
        while True:
            try:
                choice = input("Select your horse (1-{}): ".format(len(horses)))
                choice_num = int(choice)
                if 1 <= choice_num <= len(horses):
                    return horses[choice_num - 1]
                else:
                    print(f"Please enter a number between 1 and {len(horses)}")
            except ValueError:
                print("Please enter a valid number")
            except (KeyboardInterrupt, EOFError):
                print("\nGame cancelled.")
                exit(0)
    
    def display_race_view(self) -> None:
        """Display the current state of the race."""
        print("\n" + "=" * 60)
        print(f"Turn {self.race.current_turn}")
        print("-" * 60)
        
        for horse in self.race.get_standings():
            # Calculate how many characters for the track
            track_length = 40
            horse_position = int((horse.distance / self.race.finish_distance) * track_length)
            horse_position = min(horse_position, track_length)
            
            # Build the track visualization
            track = "🐎" + "-" * horse_position + "|" + " " * (track_length - horse_position)
            
            # Player's horse is highlighted
            marker = "►" if not horse.is_ai else " "
            
            print(f"{marker} {horse.name:15s}: {track} {horse.distance:5.1f}")
        
        print("-" * 60)
        print(f"Finish line at: {self.race.finish_distance} units")
        print("=" * 60 + "\n")
    
    def display_question(self, question: Question, question_num: int, total_questions: int) -> None:
        """Display a question with its answers."""
        print(f"\n📝 Question {question_num}/{total_questions}")
        print(f"Category: {question.category.upper()}")
        print()
        print(question.text)
        print()
        
        for i, answer in enumerate(question.answers, 1):
            print(f"  {i}. {answer}")
        print()
    
    def get_answer(self, num_answers: int) -> tuple[int, float]:
        """
        Get player's answer and measure response time.
        Returns (answer_index, time_taken_seconds).
        """
        start_time = time.time()
        
        while True:
            try:
                choice = input("Your answer (1-{}): ".format(num_answers))
                answer_num = int(choice)
                if 1 <= answer_num <= num_answers:
                    end_time = time.time()
                    time_taken = end_time - start_time
                    return answer_num - 1, time_taken  # Convert to 0-indexed
                else:
                    print(f"Please enter a number between 1 and {num_answers}")
            except ValueError:
                print("Please enter a valid number")
            except (KeyboardInterrupt, EOFError):
                print("\nGame cancelled.")
                exit(0)
    
    def display_answer_feedback(self, is_correct: bool, correct_index: int, 
                                time_taken: float, distance_gained: float) -> None:
        """Display feedback about the player's answer."""
        print()
        if is_correct:
            print("✅ Correct!")
        else:
            print(f"❌ Incorrect. The correct answer was #{correct_index + 1}")
        
        print(f"⏱️  Response time: {time_taken:.2f} seconds")
        print(f"📏 Distance gained: {distance_gained:.1f} units")
        print()
        
        # Pause briefly so player can read feedback
        time.sleep(1.5)
    
    def display_winner(self) -> None:
        """Display the winner and final standings."""
        print("\n" + "=" * 60)
        print(" " * 22 + "🏆 RACE COMPLETE! 🏆")
        print("=" * 60)
        print()
        
        if self.race.winner:
            winner_marker = "👑" if not self.race.winner.is_ai else "🤖"
            print(f"{winner_marker} WINNER: {self.race.winner.name} with {self.race.winner.distance:.1f} units!")
        print()
        
        print("Final Standings:")
        print("-" * 60)
        
        for rank, horse in enumerate(self.race.get_standings(), 1):
            pct_complete = (horse.distance / self.race.finish_distance) * 100
            avg_time = horse.get_average_time()
            correct_count = horse.get_correct_count()
            total_turns = len(horse.history)
            
            marker = "►" if not horse.is_ai else " "
            
            print(f"{rank}. {marker} {horse.name:15s}")
            print(f"   Distance: {horse.distance:6.1f} ({pct_complete:5.1f}% complete)")
            print(f"   Correct: {correct_count}/{total_turns}  |  Avg time: {avg_time:.2f}s")
            print()
        
        print("=" * 60)
    
    def ask_play_again(self) -> bool:
        """Ask if the player wants to play again."""
        print()
        while True:
            try:
                choice = input("Play again? (y/n): ").lower().strip()
                if choice in ('y', 'yes'):
                    return True
                elif choice in ('n', 'no'):
                    return False
                else:
                    print("Please enter 'y' or 'n'")
            except (KeyboardInterrupt, EOFError):
                return False
    
    def display_goodbye(self) -> None:
        """Display goodbye message."""
        print()
        print("Thanks for playing Horse Race Plotter!")
        print("Check out the race plot for a visual summary of the race.")
        print()
