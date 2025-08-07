from django.shortcuts import render
from django.conf import settings

import certifi

from rest_framework.views import APIView
from rest_framework.response import Response

from pymongo.mongo_client import MongoClient

# Create your views here.

database_uri = settings.DB_CONNECTION_STRING

class TestView(APIView):
    def get(self, request):
        client = MongoClient(database_uri, tlsCAFile=certifi.where())

        try:
            client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)

        return Response({ "message": "successful test" }, status=200)
