"""
Question loading and management for Horse Race Plotter.
"""
import yaml
import random
from pathlib import Path
from typing import List, Dict, Optional


class Question:
    """Represents a survey question with multiple choice answers."""
    
    def __init__(self, text: str, answers: List[str], correct: int, category: str = "general"):
        self.text = text
        self.answers = answers
        self.correct_index = correct
        self.category = category
    
    def is_correct(self, answer_index: int) -> bool:
        """Check if the given answer index is correct."""
        return answer_index == self.correct_index
    
    def __repr__(self) -> str:
        return f"Question(text='{self.text[:30]}...', category='{self.category}')"


class QuestionManager:
    """Manages loading and selecting questions for the game."""
    
    def __init__(self, questions_file: Path):
        self.questions_file = questions_file
        self.all_questions: List[Question] = []
        self.used_questions: List[Question] = []
        self.available_questions: List[Question] = []
        self._load_questions()
    
    def _load_questions(self) -> None:
        """Load questions from the YAML file."""
        try:
            with open(self.questions_file, 'r') as f:
                data = yaml.safe_load(f)
            
            for q_data in data.get('questions', []):
                question = Question(
                    text=q_data['text'],
                    answers=q_data['answers'],
                    correct=q_data['correct'],
                    category=q_data.get('category', 'general')
                )
                self.all_questions.append(question)
            
            # Initialize available questions
            self.available_questions = self.all_questions.copy()
            random.shuffle(self.available_questions)
            
        except FileNotFoundError:
            raise FileNotFoundError(f"Questions file not found: {self.questions_file}")
        except yaml.YAMLError as e:
            raise ValueError(f"Error parsing questions file: {e}")
    
    def get_next_question(self) -> Optional[Question]:
        """Get the next available question."""
        if not self.available_questions:
            # Reshuffle if we've used all questions
            if self.all_questions:
                self.available_questions = self.all_questions.copy()
                random.shuffle(self.available_questions)
                self.used_questions = []
            else:
                return None
        
        question = self.available_questions.pop(0)
        self.used_questions.append(question)
        return question
    
    def reset(self) -> None:
        """Reset the question manager for a new game."""
        self.used_questions = []
        self.available_questions = self.all_questions.copy()
        random.shuffle(self.available_questions)
    
    def get_question_count(self) -> int:
        """Get the total number of questions available."""
        return len(self.all_questions)
