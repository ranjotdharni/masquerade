from django.urls import path

from .views import CreateSurvey, RetrieveSurvey, SubmitSurvey

urlpatterns = [
    path('create/', CreateSurvey.as_view(), name="create_survey"),
    path('retrieve/', RetrieveSurvey.as_view(), name="retrieve_survey"),
    path('submit/', SubmitSurvey.as_view(), name="submit_survey"),
]
