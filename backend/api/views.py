from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User, Store, Part, Order, Review
from .serializers import (PartSerializer, StoreSerializer,
                          OrderSerializer, ReviewSerializer)


# ---------- AUTH ----------

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    d = request.data
    if User.objects.filter(email=d.get('email', '')).exists():
        return Response({'detail': 'Email ja cadastrado'}, status=400)
    user = User.objects.create_user(
        username=d['email'],
        email=d['email'],
        password=d['password'],
        role=d.get('role', 'client'),
        phone=d.get('phone', ''),
        first_name=d.get('name', ''),
    )
    if user.role == 'store':
        Store.objects.create(
            user=user,
            name=d.get('storeName', d.get('name', 'Minha loja')),
            cnpj=d.get('cnpj', ''),
            address=d.get('address', ''),
            district=d.get('district', ''),
            city=d.get('city', ''),
            hours=d.get('hours', '08h-18h'),
        )
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'role': user.role,
        'user': {'id': user.id, 'name': user.first_name or user.email, 'email': user.email, 'phone': user.phone},
    }, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email', '')
    password = request.data.get('password', '')
    user = authenticate(username=email, password=password)
    if not user:
        return Response({'detail': 'Email ou senha invalidos'}, status=401)
    token, _ = Token.objects.get_or_create(user=user)
    store_id = None
    try:
        store_id = str(user.store.id)
    except Exception:
        pass
    return Response({
        'token': token.key,
        'role': user.role,
        'user': {'id': user.id, 'name': user.first_name or user.email, 'email': user.email, 'phone': user.phone},
        'store_id': store_id,
    })


@api_view(['GET'])
def me_view(request):
    u = request.user
    if not u.is_authenticated:
        return Response({'detail': 'Nao autenticado'}, status=401)
    store_id = None
    try:
        store_id = str(u.store.id)
    except Exception:
        pass
    return Response({
        'id': u.id,
        'name': u.first_name or u.email,
        'email': u.email,
        'role': u.role,
        'phone': u.phone,
        'store_id': store_id,
    })


# ---------- PARTS ----------

@api_view(['GET', 'POST'])
def parts_list(request):
    if request.method == 'GET':
        qs = Part.objects.filter(active=True).select_related('store')
        brand = request.GET.get('brand')
        search = request.GET.get('search')
        store_id = request.GET.get('store_id')
        if brand and brand != 'Todas':
            qs = qs.filter(brand=brand)
        if search:
            qs = qs.filter(name__icontains=search)
        if store_id:
            qs = qs.filter(store_id=store_id)
        return Response(PartSerializer(qs, many=True).data)
    # POST
    user = request.user
    data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
    if user.is_authenticated and user.role == 'store' and 'store_id' not in data:
        try:
            data['store_id'] = user.store.id
        except Exception:
            pass
    s = PartSerializer(data=data)
    s.is_valid(raise_exception=True)
    s.save()
    return Response(s.data, status=201)


@api_view(['GET', 'PUT', 'DELETE'])
def part_detail(request, pk):
    try:
        part = Part.objects.get(pk=pk)
    except Part.DoesNotExist:
        return Response({'detail': 'Peca nao encontrada'}, status=404)
    if request.method == 'GET':
        return Response(PartSerializer(part).data)
    if request.method == 'PUT':
        s = PartSerializer(part, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)
    part.active = False
    part.save()
    return Response(status=204)


# ---------- STORES ----------

@api_view(['GET'])
def stores_list(request):
    return Response(StoreSerializer(Store.objects.filter(active=True), many=True).data)


@api_view(['GET', 'PUT'])
def store_detail(request, pk):
    try:
        store = Store.objects.get(pk=pk)
    except Store.DoesNotExist:
        return Response({'detail': 'Loja nao encontrada'}, status=404)
    if request.method == 'GET':
        return Response(StoreSerializer(store).data)
    s = StoreSerializer(store, data=request.data, partial=True)
    s.is_valid(raise_exception=True)
    s.save()
    return Response(s.data)


@api_view(['GET'])
def store_metrics(request, pk):
    try:
        store = Store.objects.get(pk=pk)
    except Store.DoesNotExist:
        return Response({'detail': 'Loja nao encontrada'}, status=404)
    from django.utils import timezone
    from datetime import timedelta
    today = timezone.now().date()
    orders_today = Order.objects.filter(store=store, created_at__date=today)
    total_today = sum(o.total for o in orders_today)
    pending = Order.objects.filter(store=store, status='aguardando').count()
    parts_count = Part.objects.filter(store=store, active=True).count()
    return Response({
        'orders_today': orders_today.count(),
        'revenue_today': float(total_today),
        'pending_orders': pending,
        'parts_count': parts_count,
        'rating': store.rating,
    })


# ---------- ORDERS ----------

@api_view(['GET', 'POST'])
def orders_list(request):
    if request.method == 'GET':
        qs = Order.objects.all().order_by('-created_at')
        user = request.user
        store_id = request.GET.get('store_id')
        client_id = request.GET.get('client_id')
        status_filter = request.GET.get('status')
        if store_id:
            qs = qs.filter(store_id=store_id)
        elif client_id:
            qs = qs.filter(client_id=client_id)
        elif user.is_authenticated:
            if user.role == 'client':
                qs = qs.filter(client=user)
            elif user.role == 'store':
                try:
                    qs = qs.filter(store=user.store)
                except Exception:
                    pass
        if status_filter:
            qs = qs.filter(status=status_filter)
        return Response(OrderSerializer(qs, many=True).data)
    # POST
    d = request.data
    user = request.user
    client = user if user.is_authenticated else User.objects.filter(role='client').first()
    store_id = d.get('store_id') or None
    subtotal = float(d.get('subtotal', d.get('total', 0)))
    delivery_fee = 8.0 if d.get('delivery', True) else 0.0
    order = Order.objects.create(
        client=client,
        items=d.get('items', []),
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        total=subtotal + delivery_fee,
        delivery=d.get('delivery', True),
        address=d.get('address', ''),
        store_id=store_id,
    )
    return Response(OrderSerializer(order).data, status=201)


@api_view(['GET'])
def order_detail(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'detail': 'Pedido nao encontrado'}, status=404)
    return Response(OrderSerializer(order).data)


@api_view(['PATCH'])
def order_status(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'detail': 'Pedido nao encontrado'}, status=404)
    order.status = request.data.get('status', order.status)
    order.save()
    return Response(OrderSerializer(order).data)


# ---------- REVIEWS ----------

@api_view(['GET', 'POST'])
def reviews(request):
    if request.method == 'GET':
        qs = Review.objects.all().order_by('-created_at')
        store_id = request.GET.get('store_id')
        if store_id:
            qs = qs.filter(store_id=store_id)
        return Response(ReviewSerializer(qs, many=True).data)
    # POST
    user = request.user
    client = user if user.is_authenticated else User.objects.filter(role='client').first()
    data = dict(request.data)
    review = Review.objects.create(
        client=client,
        order_id=data.get('order'),
        store_id=data.get('store'),
        rating=data.get('rating', 5),
        comment=data.get('comment', ''),
    )
    # update store rating
    store = review.store
    reviews_qs = Review.objects.filter(store=store)
    store.rating = round(sum(r.rating for r in reviews_qs) / reviews_qs.count(), 1)
    store.total_reviews = reviews_qs.count()
    store.save()
    return Response(ReviewSerializer(review).data, status=201)
