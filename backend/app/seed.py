from sqlalchemy.orm import Session
from .models import Mission


SAMPLE_MISSIONS = [
    {'title': 'Clean Your Toys', 'description': 'Upload a photo of a tidy toy area.', 'age_group': '5-8', 'category': 'responsibility', 'difficulty': 'easy', 'xp_reward': 50, 'coins_reward': 10, 'verification_prompt': 'Check if toys are organized.'},
    {'title': 'Read a Story', 'description': 'Upload a short reading video.', 'age_group': '5-8', 'category': 'learning', 'difficulty': 'easy', 'xp_reward': 60, 'coins_reward': 12, 'verification_prompt': 'Check if child is reading a storybook.'},
    {'title': 'Help at Home', 'description': 'Upload proof of helping with chores.', 'age_group': '5-8', 'category': 'responsibility', 'difficulty': 'easy', 'xp_reward': 55, 'coins_reward': 11, 'verification_prompt': 'Check if child is helping in home activity.'},
    {'title': 'Homework Sprint', 'description': 'Upload photo of completed homework.', 'age_group': '9-12', 'category': 'learning', 'difficulty': 'medium', 'xp_reward': 80, 'coins_reward': 16, 'verification_prompt': 'Check if homework appears complete.'},
    {'title': 'Creative Art', 'description': 'Upload your drawing or craft.', 'age_group': '9-12', 'category': 'creativity', 'difficulty': 'medium', 'xp_reward': 75, 'coins_reward': 14, 'verification_prompt': 'Check if artwork is visible.'},
    {'title': 'Outdoor Play', 'description': 'Upload short outdoor activity clip.', 'age_group': '9-12', 'category': 'fitness', 'difficulty': 'medium', 'xp_reward': 78, 'coins_reward': 15, 'verification_prompt': 'Check if outdoor movement activity exists.'},
    {'title': 'Fitness Challenge', 'description': 'Upload exercise video.', 'age_group': '13-17', 'category': 'fitness', 'difficulty': 'hard', 'xp_reward': 110, 'coins_reward': 22, 'verification_prompt': 'Check if challenge exercise was attempted.'},
    {'title': 'Learn and Explain', 'description': 'Upload video explaining what you learned.', 'age_group': '13-17', 'category': 'learning', 'difficulty': 'hard', 'xp_reward': 120, 'coins_reward': 25, 'verification_prompt': 'Check if explanation of learning appears.'},
    {'title': 'Community Help', 'description': 'Upload proof of helping your community.', 'age_group': '13-17', 'category': 'responsibility', 'difficulty': 'hard', 'xp_reward': 115, 'coins_reward': 23, 'verification_prompt': 'Check if helpful community action appears.'},
    {'title': 'Skill Builder', 'description': 'Upload progress on a practical skill.', 'age_group': '18-22', 'category': 'career', 'difficulty': 'expert', 'xp_reward': 150, 'coins_reward': 30, 'verification_prompt': 'Check if professional skill activity is shown.'},
    {'title': 'Productivity Sprint', 'description': 'Upload completed task board.', 'age_group': '18-22', 'category': 'productivity', 'difficulty': 'expert', 'xp_reward': 145, 'coins_reward': 29, 'verification_prompt': 'Check if tasks are completed.'},
    {'title': 'Lead and Teach', 'description': 'Upload clip of leading/teaching someone.', 'age_group': '18-22', 'category': 'leadership', 'difficulty': 'expert', 'xp_reward': 160, 'coins_reward': 32, 'verification_prompt': 'Check if leadership/teaching is visible.'},
]


def seed_missions(db: Session) -> None:
    if db.query(Mission).count() > 0:
        return
    db.add_all([Mission(**m) for m in SAMPLE_MISSIONS])
    db.commit()
