from django.urls import path
from . import views

app_name = 'downloads'

urlpatterns = [
    path('', views.download_latest, name='download_latest'),
    path('file/<str:version>/', views.download_file, name='download_file'),
    path('verify_activation/', views.verify_activation, name='verify_activation'),
    path('<str:version>/', views.download_version, name='download_version'),
]
