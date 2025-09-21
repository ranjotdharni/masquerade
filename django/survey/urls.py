from django.urls import path

from .views import CreateSurvey, RetrieveSurvey

urlpatterns = [
    path('create/', CreateSurvey.as_view(), name="create_survey"),
    path('retrieve/', RetrieveSurvey.as_view(), name="retrieve_survey"),
]
