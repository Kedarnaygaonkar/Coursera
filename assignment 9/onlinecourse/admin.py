# onlinecourse/admin.py
from django.contrib import admin

# ── Task 2: Seven imported classes ───────────────────────────────────────────
from .models import (
    Course,
    Lesson,
    Instructor,
    Learner,
    Question,
    Choice,
    Submission,
)


# ── Inline classes ────────────────────────────────────────────────────────────

class ChoiceInline(admin.StackedInline):
    """Inline admin for Choice - displayed within QuestionAdmin."""
    model = Choice
    extra = 4


class QuestionInline(admin.StackedInline):
    """Inline admin for Question - displayed within CourseAdmin."""
    model = Question
    extra = 5


# ── Admin classes ─────────────────────────────────────────────────────────────

class LessonInline(admin.StackedInline):
    model = Lesson
    extra = 5


class CourseAdmin(admin.ModelAdmin):
    inlines = [LessonInline]
    list_display = ['name', 'pub_date']
    list_filter = ['pub_date']
    search_fields = ['name', 'description']


class LessonAdmin(admin.ModelAdmin):
    """Admin for Lesson - with QuestionInline."""
    inlines = [QuestionInline]
    list_display = ['title', 'course', 'order']
    list_filter = ['course']
    search_fields = ['title', 'content']


class QuestionAdmin(admin.ModelAdmin):
    """Admin for Question - with ChoiceInline."""
    inlines = [ChoiceInline]
    list_display = ['question_text', 'course', 'lesson', 'grade']
    list_filter = ['course']
    search_fields = ['question_text']


class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['enrollment']
    filter_horizontal = ['choices']


# ── Register models ──────────────────────────────────────────────────────────
admin.site.register(Course, CourseAdmin)
admin.site.register(Lesson, LessonAdmin)
admin.site.register(Instructor)
admin.site.register(Learner)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Choice)
admin.site.register(Submission, SubmissionAdmin)

