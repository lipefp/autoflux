from django.core.management.base import BaseCommand
from api.models import User, Store, Part, Order


class Command(BaseCommand):
    help = 'Popula o banco com dados de demonstracao'

    def handle(self, *args, **kwargs):
        # superuser admin
        if not User.objects.filter(username='admin@autoflux.com').exists():
            User.objects.create_superuser(
                username='admin@autoflux.com', email='admin@autoflux.com',
                password='admin', role='store', first_name='Admin')
            self.stdout.write('Admin criado: admin@autoflux.com / admin')

        # cliente demo
        if not User.objects.filter(email='cliente@autoflux.com').exists():
            User.objects.create_user(
                username='cliente@autoflux.com', email='cliente@autoflux.com',
                password='123456', role='client', first_name='Cliente Demo',
                phone='11999990001')
            self.stdout.write('Cliente criado: cliente@autoflux.com / 123456')

        # lojista demo + loja
        if not User.objects.filter(email='loja@autoflux.com').exists():
            lojista = User.objects.create_user(
                username='loja@autoflux.com', email='loja@autoflux.com',
                password='123456', role='store', first_name='AutoCenter SP',
                phone='11999990002')
            loja1 = Store.objects.create(
                user=lojista, name='AutoCenter SP',
                city='Sao Paulo', district='Centro',
                address='Av. Paulista, 1000', distance='2,3 km',
                rating=4.8, hours='08h-18h')
            self.stdout.write('Lojista criado: loja@autoflux.com / 123456')
        else:
            loja1 = Store.objects.filter(name='AutoCenter SP').first() or Store.objects.first()

        # lojas adicionais
        if Store.objects.count() < 3:
            if not User.objects.filter(email='rj@autoflux.com').exists():
                u2 = User.objects.create_user(
                    username='rj@autoflux.com', email='rj@autoflux.com',
                    password='123456', role='store', first_name='Pecas RJ')
                Store.objects.create(
                    user=u2, name='Pecas Rapidas RJ',
                    city='Rio de Janeiro', district='Botafogo',
                    address='Rua das Pecas, 50', distance='3,1 km',
                    rating=4.5, hours='09h-17h')
            if not User.objects.filter(email='nit@autoflux.com').exists():
                u3 = User.objects.create_user(
                    username='nit@autoflux.com', email='nit@autoflux.com',
                    password='123456', role='store', first_name='MotoPartes')
                Store.objects.create(
                    user=u3, name='MotoPartes NIT',
                    city='Niteroi', district='Icarai',
                    address='Rua do Motor, 200', distance='1,8 km',
                    rating=4.9, hours='08h-20h')

        # pecas
        if Part.objects.count() == 0:
            lojas = list(Store.objects.all())
            dados = [
                ('Filtro de oleo Bosch', 45.90, 'Honda', 'Honda Civic 2018-2023', 'BOX-3330', 12),
                ('Pastilha de freio Fras-le', 89.00, 'Toyota', 'Toyota Corolla 2019-2023', 'FRS-441', 5),
                ('Vela de ignicao NGK', 32.00, 'VW', 'VW Gol 2015-2022', 'NGK-BKR6', 20),
                ('Correia dentada Gates', 120.00, 'Ford', 'Ford Ka 2018-2021', 'GAT-5521', 8),
                ('Amortecedor Monroe', 210.00, 'Chevrolet', 'Chevrolet Onix 2019-2023', 'MNR-032', 4),
                ('Filtro de ar Mann', 38.50, 'Honda', 'Honda HRV 2017-2022', 'MNN-C2840', 15),
            ]
            for i, (nome, preco, marca, compat, cod, est) in enumerate(dados):
                Part.objects.create(
                    store=lojas[i % len(lojas)],
                    name=nome, price=preco,
                    brand=marca, compatible=compat,
                    code=cod, stock=est)
            self.stdout.write('6 pecas criadas')

        # pedido de exemplo
        cliente = User.objects.filter(email='cliente@autoflux.com').first()
        if cliente and not Order.objects.filter(client=cliente).exists():
            Order.objects.create(
                client=cliente, store=loja1,
                items=[{'partId': '1', 'name': 'Filtro de oleo Bosch', 'price': 45.90, 'quantity': 2}],
                subtotal=91.80, delivery_fee=8, total=99.80,
                status='separando', address='Rua Exemplo, 100 - Sao Paulo')
            self.stdout.write('Pedido de exemplo criado')

        self.stdout.write(self.style.SUCCESS('Seed concluido!'))
