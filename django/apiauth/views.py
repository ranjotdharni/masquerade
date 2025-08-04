from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class TestView(APIView):
    def get(self, request):
        print("hit the api test endpoint")
        return Response({ "message": "success" }, status=200)
