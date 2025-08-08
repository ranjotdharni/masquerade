from django.shortcuts import render
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class TestView(APIView):
    def get(self, request):
        client = settings.MONGO_CLIENT

        try:
            client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)

        return Response({ "message": "successful test" }, status=200)
