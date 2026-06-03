from rest_framework import serializers
from .models import User, Store, Part, Order, Review


class PartSerializer(serializers.ModelSerializer):
    store = serializers.CharField(source='store.name', read_only=True)
    distance = serializers.CharField(source='store.distance', read_only=True)
    store_id = serializers.PrimaryKeyRelatedField(
        queryset=Store.objects.all(), source='store', write_only=True, required=False
    )
    id = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)

    class Meta:
        model = Part
        fields = ['id', 'name', 'description', 'price', 'brand', 'compatible',
                  'code', 'stock', 'store', 'distance', 'store_id', 'active']

    def get_id(self, obj):
        return str(obj.id)


class StoreSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = ['id', 'name', 'cnpj', 'address', 'district', 'city',
                  'hours', 'distance', 'rating', 'total_reviews', 'active',
                  'delivery_radius_km']

    def get_id(self, obj):
        return str(obj.id)


class OrderSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    delivery_fee = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    store_name = serializers.CharField(source='store.name', read_only=True, default='')

    class Meta:
        model = Order
        fields = ['id', 'items', 'subtotal', 'delivery_fee', 'total',
                  'delivery', 'address', 'status', 'created_at', 'store', 'store_name']

    def get_id(self, obj):
        return str(obj.id)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'order', 'store', 'rating', 'comment', 'created_at', 'client']
        read_only_fields = ['client', 'created_at']
