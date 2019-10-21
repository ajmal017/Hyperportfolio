"""stocks_django URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from rest_framework_simplejwt import views as jwt_views
from portfolios.api.views import PortfolioListView
from instruments.api.views import InstrumentSearchView
from .api import router

urlpatterns = [
    # Maps the `admin/` endpoint. Autogenerated by Django.
    path('admin/', admin.site.urls),

    # Sets the base URL for all the application endpoints to `api/`.
    path('api/', include(router.urls)),
    path('api/', include('portfolios.api.urls')),
    path('api/', include('instruments.api.urls')),

    # Sets the `api/login` endpoint for the JWT login.
    path('api/login/', jwt_views.TokenObtainPairView.as_view(),
                   name='token_obtain_pair'),

    # Sets the `api/login/refresh` for the JWT session refresh.
    path('api/login/refresh/', jwt_views.TokenRefreshView.as_view(),
                           name='token_refresh'),
]

