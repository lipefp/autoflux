from django.urls import path
from . import views

urlpatterns = [
    path('auth/register', views.register),
    path('auth/login', views.login_view),
    path('auth/me', views.me_view),

    path('parts', views.parts_list),
    path('parts/<int:pk>', views.part_detail),

    path('stores', views.stores_list),
    path('stores/<int:pk>', views.store_detail),
    path('stores/<int:pk>/metrics', views.store_metrics),

    path('orders', views.orders_list),
    path('orders/<int:pk>', views.order_detail),
    path('orders/<int:pk>/status', views.order_status),

    path('reviews', views.reviews),
]
