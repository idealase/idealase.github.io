# Horse Race Plotter 🐎

A survey-driven data plotting mini-game where players race horses by answering questions. The faster and more accurately you answer, the faster your horse advances.

## Overview

Horse Race Plotter is an interactive command-line game that combines trivia, timing challenges, and data visualization. Each horse represents a team, and players compete by answering survey questions. The game tracks response times and accuracy, using them to determine race progress. At the end, the game generates beautiful plots showing the race dynamics.

## Features

- **Interactive CLI gameplay** with real-time race visualization
- **Multiple horses/teams** with AI-controlled opponents
- **Survey question engine** with configurable question sets
- **Dynamic scoring** based on correctness and response speed
- **Data visualization** using matplotlib (race progress charts and performance comparisons)
- **Configurable settings** via YAML configuration file

## Requirements

- Python 3.10 or higher
- matplotlib
- pyyaml

## Installation

```bash
# Navigate to the game directory
cd dev-work/horse-race-plotter

# Install dependencies
pip install -r requirements.txt
```

## How to Play

1. Run the game:
   ```bash
   python horse_race_plotter.py
   ```

2. Select your horse/team from the available options

3. Answer survey questions as quickly and accurately as possible:
   - Correct answers move your horse forward
   - Faster answers earn bonus distance
   - Each turn advances all horses (AI opponents also play)

4. The race ends when:
   - A horse reaches the finish line, OR
   - Maximum number of turns is reached

5. View the results:
   - Final standings with statistics
   - Race plot showing progress over time
   - Performance comparison charts

## Scoring System

The scoring formula rewards both accuracy and speed:

```
Base Distance = 10 units (for correct answer), 0 (for incorrect)
Time Bonus = max(0, max_time_bonus × (1 - answer_time / speed_factor))
Total Distance = Base Distance + Time Bonus
```

- **Base distance**: Earned for correct answers only
- **Time bonus**: Decreases as you take longer to answer
- **Speed factor**: Configurable threshold for "fast" answers (default: 8 seconds)

## Configuration

Edit `config.yaml` to customize:

- **finish_distance**: Race length (default: 100 units)
- **max_turns**: Maximum number of questions (default: 15)
- **horses**: List of team names
- **scoring parameters**: Adjust difficulty and scoring weights

Example:
```yaml
finish_distance: 100
max_turns: 15
horses:
  - "Data Team"
  - "AI Team"
  - "Ops Team"
  - "Dev Team"
scoring:
  base_distance_correct: 10
  speed_factor: 8
  max_time_bonus: 5
```

## Adding Questions

Questions are stored in `questions.yaml`. Each question has:

- **text**: The question text
- **answers**: List of 4 multiple-choice options
- **correct**: Index of the correct answer (0-3)
- **category**: Question category for organization

Example:
```yaml
questions:
  - text: "What is the primary purpose of data visualization?"
    answers:
      - "To make data look pretty"
      - "To communicate insights effectively"
      - "To confuse stakeholders"
      - "To hide bad results"
    correct: 1
    category: "data"
```

## Code Structure

- **`horse_race_plotter.py`**: Main entry point and game loop
- **`game_logic.py`**: Core game mechanics, state management, and scoring
- **`questions.py`**: Question loading and management
- **`cli.py`**: Command-line interface and display functions
- **`plotting.py`**: Data visualization using matplotlib
- **`config.yaml`**: Game configuration settings
- **`questions.yaml`**: Question database

## Playing on the Web

The game can also be played in a web browser at:
`https://sandford.systems/dev-work/horse-race-plotter.html`

The web version uses Pyodide to run Python in the browser, providing the same experience without installing anything locally.

## Development

### Extending the Game

**Add new horses:**
Edit `config.yaml` and add entries to the `horses` list.

**Add new questions:**
Edit `questions.yaml` and add new question entries.

**Adjust difficulty:**
Modify the `scoring` section in `config.yaml`:
- Increase `speed_factor` for more lenient timing
- Increase `max_time_bonus` to reward speed more
- Change `finish_distance` or `max_turns` to control game length

**Customize AI behavior:**
Edit the `simulate_ai_turn` method in `game_logic.py` to adjust AI accuracy and response times.

## Plotting Output

The game generates two types of plots:

1. **Race Progress Chart** (`race_results.png`):
   - Line chart showing cumulative distance over turns
   - One line per horse
   - Player's horse highlighted

2. **Performance Comparison** (`performance_comparison.png`):
   - Bar charts comparing correct answers and average response times
   - Side-by-side comparison of all horses

Plots use a dark theme matching the website aesthetic with Nord color palette.

## License

Part of the sandford.systems project. See main repository for license information.

## Credits

Built as part of the "vibe-coded" sandford.systems project, demonstrating AI-assisted development and data visualization concepts.
