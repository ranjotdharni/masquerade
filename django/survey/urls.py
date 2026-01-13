from django.urls import path

from .views import CreateSurvey, SubmitSurvey, SurveyCatalog, SurveyDetail, SurveyTest

urlpatterns = [
    path('create/', CreateSurvey.as_view(), name="create_survey"),
    path('submit/', SubmitSurvey.as_view(), name="submit_survey"),
    path('catalog/', SurveyCatalog.as_view(), name="survey_catalog"),
    path('detail/', SurveyDetail.as_view(), name="survey_detail"),
    path('test/', SurveyTest.as_view(), name="submission_test"),
]
