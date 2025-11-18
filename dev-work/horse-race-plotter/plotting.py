"""
Plotting functionality for Horse Race Plotter.
Generates race visualization using matplotlib.
"""
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend for server environments
import matplotlib.pyplot as plt
from pathlib import Path
from typing import Dict, Optional


class RacePlotter:
    """Handles creating visualizations of race results."""
    
    def __init__(self, output_dir: Path = Path(".")):
        self.output_dir = output_dir
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def plot_race(self, race_data: Dict, output_file: str = "race_results.png") -> Path:
        """
        Create a line chart showing each horse's progress over turns.
        
        Args:
            race_data: Dictionary containing race data from RaceState.get_race_data()
            output_file: Name of the output PNG file
        
        Returns:
            Path to the saved plot file
        """
        # Create figure and axis
        fig, ax = plt.subplots(figsize=(12, 7))
        
        # Define colors for different horses
        colors = ['#88c0d0', '#bf616a', '#a3be8c', '#ebcb8b', '#b48ead', '#d08770']
        
        # Plot each horse's progress
        for idx, horse_data in enumerate(race_data['horses']):
            color = colors[idx % len(colors)]
            
            # Use thicker line and marker for player horse
            if not horse_data['is_ai']:
                linewidth = 3
                marker = 'o'
                markersize = 8
                label = f"{horse_data['name']} (YOU)"
            else:
                linewidth = 2
                marker = 's'
                markersize = 5
                label = horse_data['name']
            
            ax.plot(
                horse_data['turns'],
                horse_data['distances'],
                marker=marker,
                linewidth=linewidth,
                markersize=markersize,
                color=color,
                label=label,
                alpha=0.8
            )
        
        # Customize the plot
        ax.set_xlabel('Turn Number', fontsize=12, fontweight='bold')
        ax.set_ylabel('Distance (units)', fontsize=12, fontweight='bold')
        ax.set_title('Horse Race Progress', fontsize=16, fontweight='bold', pad=20)
        
        # Add grid for readability
        ax.grid(True, alpha=0.3, linestyle='--')
        
        # Add legend
        ax.legend(loc='upper left', fontsize=10, framealpha=0.9)
        
        # Set background color
        ax.set_facecolor('#2e3440')
        fig.patch.set_facecolor('#1d1d1d')
        
        # Customize tick colors for dark theme
        ax.tick_params(colors='#d8dee9')
        ax.spines['bottom'].set_color('#d8dee9')
        ax.spines['left'].set_color('#d8dee9')
        ax.spines['top'].set_color('#d8dee9')
        ax.spines['right'].set_color('#d8dee9')
        ax.xaxis.label.set_color('#d8dee9')
        ax.yaxis.label.set_color('#d8dee9')
        ax.title.set_color('#d8dee9')
        
        # Tight layout to prevent label cutoff
        plt.tight_layout()
        
        # Save the plot
        output_path = self.output_dir / output_file
        plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
        plt.close()
        
        return output_path
    
    def plot_performance_comparison(self, race_data: Dict, 
                                    output_file: str = "performance_comparison.png") -> Path:
        """
        Create a bar chart comparing horses by correctness and average time.
        
        Args:
            race_data: Dictionary containing race data
            output_file: Name of the output PNG file
        
        Returns:
            Path to the saved plot file
        """
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
        
        # Prepare data
        names = []
        correct_counts = []
        avg_times = []
        colors = []
        color_palette = ['#88c0d0', '#bf616a', '#a3be8c', '#ebcb8b', '#b48ead', '#d08770']
        
        for idx, horse_data in enumerate(race_data['horses']):
            names.append(horse_data['name'])
            correct_counts.append(sum(horse_data['correct']))
            
            if horse_data['times']:
                avg_times.append(sum(horse_data['times']) / len(horse_data['times']))
            else:
                avg_times.append(0)
            
            colors.append(color_palette[idx % len(color_palette)])
        
        # Plot 1: Correct answers
        ax1.bar(names, correct_counts, color=colors, alpha=0.8)
        ax1.set_ylabel('Correct Answers', fontsize=12, fontweight='bold')
        ax1.set_title('Correct Answers by Horse', fontsize=14, fontweight='bold')
        ax1.tick_params(axis='x', rotation=45)
        ax1.grid(True, alpha=0.3, linestyle='--', axis='y')
        
        # Plot 2: Average response time
        ax2.bar(names, avg_times, color=colors, alpha=0.8)
        ax2.set_ylabel('Average Time (seconds)', fontsize=12, fontweight='bold')
        ax2.set_title('Average Response Time by Horse', fontsize=14, fontweight='bold')
        ax2.tick_params(axis='x', rotation=45)
        ax2.grid(True, alpha=0.3, linestyle='--', axis='y')
        
        # Style both plots
        for ax in [ax1, ax2]:
            ax.set_facecolor('#2e3440')
            ax.tick_params(colors='#d8dee9')
            ax.spines['bottom'].set_color('#d8dee9')
            ax.spines['left'].set_color('#d8dee9')
            ax.spines['top'].set_color('#d8dee9')
            ax.spines['right'].set_color('#d8dee9')
            ax.xaxis.label.set_color('#d8dee9')
            ax.yaxis.label.set_color('#d8dee9')
            ax.title.set_color('#d8dee9')
        
        fig.patch.set_facecolor('#1d1d1d')
        plt.tight_layout()
        
        # Save the plot
        output_path = self.output_dir / output_file
        plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
        plt.close()
        
        return output_path
