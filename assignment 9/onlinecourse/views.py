# onlinecourse/views.py
import logging
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views import generic

from .models import Course, Enrollment, Choice, Question, Submission

logger = logging.getLogger(__name__)


# ── Authentication views ──────────────────────────────────────────────────────

def registration_request(request):
    context = {}
    if request.method == 'GET':
        return render(request, 'onlinecourse/user_registration_bootstrap.html', context)
    elif request.method == 'POST':
        username = request.POST['username']
        password = request.POST['psw']
        first_name = request.POST['firstname']
        last_name = request.POST['lastname']
        user_exist = False
        try:
            User.objects.get(username=username)
            user_exist = True
        except User.DoesNotExist:
            logger.error("New user")
        if not user_exist:
            user = User.objects.create_user(
                username=username,
                first_name=first_name,
                last_name=last_name,
                password=password,
            )
            login(request, user)
            return redirect(reverse('onlinecourse:index'))
        else:
            context['message'] = "User already exists."
            return render(
                request,
                'onlinecourse/user_registration_bootstrap.html',
                context,
            )


def login_request(request):
    context = {}
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['psw']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(reverse('onlinecourse:index'))
        else:
            context['message'] = "Invalid username or password."
            return render(
                request,
                'onlinecourse/user_login_bootstrap.html',
                context,
            )
    else:
        return render(request, 'onlinecourse/user_login_bootstrap.html', context)


def logout_request(request):
    logout(request)
    return redirect(reverse('onlinecourse:index'))


# ── Course views ──────────────────────────────────────────────────────────────

def check_if_enrolled(user, course):
    is_enrolled = False
    if user.id is not None:
        num_results = Enrollment.objects.filter(user=user, course=course).count()
        if num_results > 0:
            is_enrolled = True
    return is_enrolled


class CourseListView(generic.ListView):
    template_name = 'onlinecourse/course_list_bootstrap.html'
    context_object_name = 'course_list'

    def get_queryset(self):
        user = self.request.user
        courses = Course.objects.order_by('-total_enrollment')[:10]
        for course in courses:
            if user.is_authenticated:
                course.is_enrolled = check_if_enrolled(user, course)
        return courses


class CourseDetailView(generic.DetailView):
    model = Course
    template_name = 'onlinecourse/course_details_bootstrap.html'


def enroll(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    user = request.user

    is_enrolled = check_if_enrolled(user, course)
    if not is_enrolled and user.is_authenticated:
        Enrollment.objects.create(user=user, course=course, mode='honor')
        course.total_enrollment += 1
        course.save()

    return HttpResponseRedirect(
        reverse(viewname='onlinecourse:course_details', args=(course.id,))
    )


# ── Task 5: submit and show_exam_result views ─────────────────────────────────

def submit(request, course_id):
    """
    Handle exam submission:
    1. Get the current user and enrolled course.
    2. Get or create the enrollment object.
    3. Create a Submission object.
    4. Collect selected choice IDs from POST data and add to submission.
    5. Redirect to show_exam_result.
    """
    user = request.user
    course = get_object_or_404(Course, pk=course_id)

    # Get the enrollment for this user and course
    try:
        enrollment = Enrollment.objects.get(user=user, course=course)
    except Enrollment.DoesNotExist:
        return HttpResponse("You are not enrolled in this course.", status=403)

    # Create a new Submission linked to the enrollment
    submission = Submission.objects.create(enrollment=enrollment)

    # Collect all selected choice IDs from POST form data
    submitted_answers = []
    for key, value in request.POST.items():
        if key.startswith('choice'):
            submitted_answers.append(int(value))

    # Add selected choices to the submission
    chosen_choices = Choice.objects.filter(id__in=submitted_answers)
    submission.choices.set(chosen_choices)
    submission.save()

    return HttpResponseRedirect(
        reverse(
            viewname='onlinecourse:show_exam_result',
            args=(course_id, submission.id),
        )
    )


def show_exam_result(request, course_id, submission_id):
    """
    Display exam results:
    1. Retrieve the course and submission.
    2. Get all selected choice IDs.
    3. For each question, check whether the selected answers are correct.
    4. Calculate total score.
    5. Render the exam result template.
    """
    course = get_object_or_404(Course, pk=course_id)
    submission = get_object_or_404(Submission, pk=submission_id)

    # Get all choices the user selected
    selected_ids = submission.choices.values_list('id', flat=True)

    # Get all questions for this course
    questions = Question.objects.filter(course=course)

    # Calculate total grade and earned grade
    total_grade = 0
    earned_grade = 0
    question_results = []

    for question in questions:
        total_grade += question.grade
        is_correct = question.is_get_score(selected_ids)
        if is_correct:
            earned_grade += question.grade

        # Collect choices for this question with their selected status
        choices = []
        for choice in question.choice_set.all():
            choices.append({
                'choice': choice,
                'selected': choice.id in selected_ids,
            })

        question_results.append({
            'question': question,
            'correct': is_correct,
            'choices': choices,
        })

    # Calculate percentage score
    if total_grade > 0:
        score = (earned_grade / total_grade) * 100
    else:
        score = 0

    context = {
        'course': course,
        'submission': submission,
        'question_results': question_results,
        'total_grade': total_grade,
        'earned_grade': earned_grade,
        'score': round(score, 1),
        'passed': score >= 80,
    }

    return render(request, 'onlinecourse/exam_result_bootstrap.html', context)

