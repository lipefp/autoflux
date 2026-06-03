from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [('client', 'Cliente'), ('store', 'Lojista')]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f'{self.username} ({self.role})'


class Store(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='store')
    name = models.CharField(max_length=200)
    cnpj = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=300, blank=True)
    district = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    hours = models.CharField(max_length=100, blank=True, default='08h-18h')
    distance = models.CharField(max_length=20, blank=True, default='2,0 km')
    delivery_radius_km = models.IntegerField(default=10)
    rating = models.FloatField(default=5.0)
    total_reviews = models.IntegerField(default=0)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Part(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='parts')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    brand = models.CharField(max_length=50)
    compatible = models.CharField(max_length=200, blank=True)
    code = models.CharField(max_length=50, blank=True)
    stock = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ('aguardando', 'Aguardando'),
        ('confirmado', 'Confirmado'),
        ('separando', 'Separando'),
        ('a_caminho', 'A caminho'),
        ('entregue', 'Entregue'),
        ('cancelado', 'Cancelado'),
    ]
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    store = models.ForeignKey(Store, on_delete=models.SET_NULL, null=True, blank=True)
    items = models.JSONField(default=list)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=8)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery = models.BooleanField(default=True)
    address = models.CharField(max_length=300, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='aguardando')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Pedido #{self.id} - {self.status}'


class Review(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    client = models.ForeignKey(User, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(default=5)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review loja {self.store_id} nota {self.rating}'
