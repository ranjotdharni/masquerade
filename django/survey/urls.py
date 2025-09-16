from django.urls import path

from .views import CreateSurvey

urlpatterns = [
    path('create/', CreateSurvey.as_view(), name="create_survey"),
]
