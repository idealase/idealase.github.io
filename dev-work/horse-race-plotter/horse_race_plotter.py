#!/usr/bin/env python3
"""
Horse Race Plotter - A survey-driven data plotting mini-game.

Players race horses by answering survey questions. The faster and more
accurately you answer, the faster your horse advances. The game generates
a plot of the race at the end.
"""
import sys
import yaml
from pathlib import Path
from game_logic import RaceState, ScoringSystem
from questions import QuestionManager
from cli import GameCLI
from plotting import RacePlotter


def load_config(config_file: Path) -> dict:
    """Load configuration from YAML file."""
    try:
        with open(config_file, 'r') as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        print(f"Error: Config file not found: {config_file}")
        sys.exit(1)
    except yaml.YAMLError as e:
        print(f"Error: Invalid config file: {e}")
        sys.exit(1)


def main():
    """Main game loop."""
    # Get the directory where this script is located
    script_dir = Path(__file__).parent
    
    # Load configuration
    config_file = script_dir / "config.yaml"
    config = load_config(config_file)
    
    # Load questions
    questions_file = script_dir / config['questions_file']
    question_manager = QuestionManager(questions_file)
    
    if question_manager.get_question_count() == 0:
        print("Error: No questions loaded!")
        sys.exit(1)
    
    print(f"Loaded {question_manager.get_question_count()} questions.")
    
    # Game loop
    play_again = True
    
    while play_again:
        # Setup
        question_manager.reset()
        
        # Create scoring system from config
        scoring_config = config.get('scoring', {})
        scoring_system = ScoringSystem(
            base_distance_correct=scoring_config.get('base_distance_correct', 10.0),
            base_distance_incorrect=scoring_config.get('base_distance_incorrect', 0.0),
            speed_factor=scoring_config.get('speed_factor', 8.0),
            max_time_bonus=scoring_config.get('max_time_bonus', 5.0)
        )
        
        # Create CLI for initial interaction
        temp_cli = GameCLI(None)  # We'll set the race state later
        
        # Display title and instructions
        temp_cli.display_title()
        temp_cli.display_instructions()
        
        # Horse selection
        available_horses = config['horses']
        player_horse_name = temp_cli.display_horse_selection(available_horses)
        
        # Create race state
        race = RaceState(
            horse_names=available_horses,
            player_horse_name=player_horse_name,
            finish_distance=config['finish_distance'],
            max_turns=config['max_turns'],
            scoring_system=scoring_system
        )
        
        # Create CLI with race state
        cli = GameCLI(race)
        
        print(f"\n🎮 You are racing as: {player_horse_name}")
        print("The race is about to begin!\n")
        input("Press Enter to start...")
        
        # Initial race view
        cli.display_race_view()
        
        # Main game loop
        questions_asked = 0
        max_questions = min(config['max_turns'], question_manager.get_question_count())
        
        while not race.is_game_over() and questions_asked < max_questions:
            questions_asked += 1
            
            # Get next question
            question = question_manager.get_next_question()
            if not question:
                print("No more questions available!")
                break
            
            # Display question
            cli.display_question(question, questions_asked, max_questions)
            
            # Get player's answer
            answer_index, time_taken = cli.get_answer(len(question.answers))
            is_correct = question.is_correct(answer_index)
            
            # Process player's turn
            distance_gained = race.process_turn(race.player_horse, is_correct, time_taken)
            
            # Display feedback
            cli.display_answer_feedback(is_correct, question.correct_index, time_taken, distance_gained)
            
            # Simulate AI horses
            for horse in race.horses:
                if horse.is_ai:
                    race.simulate_ai_turn(horse)
            
            # Display updated race view
            cli.display_race_view()
            
            # Check for winner
            winner = race.check_winner()
            if winner:
                break
        
        # End of race
        if not race.winner:
            # If no winner yet, determine by distance
            race.check_winner()
        
        # Display results
        cli.display_winner()
        
        # Generate plots
        print("\n📊 Generating race plots...")
        plotter = RacePlotter(output_dir=script_dir)
        
        try:
            race_data = race.get_race_data()
            
            # Main race plot
            plot_path = plotter.plot_race(race_data)
            print(f"✅ Race plot saved to: {plot_path}")
            
            # Performance comparison plot
            perf_path = plotter.plot_performance_comparison(race_data)
            print(f"✅ Performance comparison saved to: {perf_path}")
            
        except Exception as e:
            print(f"❌ Error generating plots: {e}")
            print("(This is normal if matplotlib is not available in web environments)")
        
        # Ask to play again
        play_again = cli.ask_play_again()
    
    # Goodbye
    cli.display_goodbye()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nGame interrupted. Goodbye!")
        sys.exit(0)
