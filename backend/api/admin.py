from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Store, Part, Order, Review


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'phone', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (('AutoFlux', {'fields': ('role', 'phone')}),)


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'rating', 'active')
    search_fields = ('name', 'city')


@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'price', 'stock', 'store', 'active')
    list_filter = ('brand', 'store')
    search_fields = ('name', 'code')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'store', 'total', 'status', 'created_at')
    list_filter = ('status',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('store', 'rating', 'client', 'created_at')
