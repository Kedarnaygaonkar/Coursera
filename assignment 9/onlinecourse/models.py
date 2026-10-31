# onlinecourse/models.py
from django.db import models
from django.contrib.auth.models import User


COURSE_LEVELS = [
    ('beginner', 'Beginner'),
    ('intermediate', 'Intermediate'),
    ('advanced', 'Advanced'),
]


class Instructor(models.Model):
    """Instructor model - a user who teaches courses."""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    full_time = models.BooleanField(default=True)
    total_learners = models.IntegerField(default=0)

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name


class Learner(models.Model):
    """Learner model - a user who enrols in courses."""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    STUDENT = 'student'
    DEVELOPER = 'developer'
    DATA_SCIENTIST = 'data_scientist'
    DATABASE_ADMIN = 'dba'
    OCCUPATION_CHOICES = [
        (STUDENT, 'Student'),
        (DEVELOPER, 'Developer'),
        (DATA_SCIENTIST, 'Data Scientist'),
        (DATABASE_ADMIN, 'Database Admin'),
    ]
    occupation = models.CharField(
        null=False,
        max_length=20,
        choices=OCCUPATION_CHOICES,
        default=STUDENT,
    )
    social_link = models.URLField(max_length=200)

    def __str__(self):
        return self.user.username + ", " + \
               self.occupation


class Course(models.Model):
    """Course model."""
    name = models.CharField(null=False, max_length=100, default='online course')
    image = models.ImageField(upload_to='course_images/')
    description = models.CharField(max_length=1000)
    pub_date = models.DateField(null=True)
    instructors = models.ManyToManyField(Instructor)
    users = models.ManyToManyField(User, through='Enrollment')
    total_enrollment = models.IntegerField(default=0)
    is_enrolled = False

    def __str__(self):
        return "Course: " + self.name + "," + str(self.total_enrollment)


class Lesson(models.Model):
    """Lesson model - a lesson belongs to a course."""
    title = models.CharField(max_length=200, default="title")
    order = models.IntegerField(default=0)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    content = models.TextField()

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    """Enrollment model - tracks which user is enrolled in which course."""
    AUDIT = 'audit'
    HONOR = 'honor'
    BETA = 'BETA'
    COURSE_MODES = [
        (AUDIT, 'Audit'),
        (HONOR, 'Honor'),
        (BETA, 'BETA'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date_enrolled = models.DateField(auto_now=True)
    mode = models.CharField(max_length=5, choices=COURSE_MODES, default=AUDIT)
    rating = models.FloatField(default=5.0)


# ── Task 1: New Assessment Models ────────────────────────────────────────────

class Question(models.Model):
    """Question model - a question belongs to a lesson and has a point value."""
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    question_text = models.CharField(max_length=1000)
    # Points for this question
    grade = models.IntegerField(default=50)

    def is_get_score(self, selected_ids):
        """Return True if ALL correct choices are in selected_ids and
        no incorrect choices are selected."""
        all_answers = self.choice_set.filter(is_correct=True).count()
        selected_correct = self.choice_set.filter(
            is_correct=True, id__in=selected_ids
        ).count()
        return all_answers == selected_correct

    def __str__(self):
        return self.question_text


class Choice(models.Model):
    """Choice model - a choice belongs to a question."""
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.choice_text


class Submission(models.Model):
    """Submission model - records a learner's exam submission."""
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE)
    choices = models.ManyToManyField(Choice)

    def __str__(self):
        return f"Submission by {self.enrollment.user.username} " \
               f"for {self.enrollment.course.name}"

