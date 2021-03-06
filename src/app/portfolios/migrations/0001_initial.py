# Generated by Django 2.2.3 on 2019-07-29 01:37

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='OwnerPortfoliosSummary',
            fields=[
                ('id', models.BigIntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('units', models.DecimalField(decimal_places=10, max_digits=20)),
                ('value', models.DecimalField(decimal_places=10, max_digits=20)),
                ('average_price', models.DecimalField(decimal_places=10, max_digits=20)),
                ('latest_transaction_date', models.DateTimeField()),
                ('date_created', models.DateTimeField()),
                ('date_modified', models.DateTimeField()),
            ],
            options={
                'db_table': 'vw_owner_portfolios_summary',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='OwnerPortfoliosSummarySymbol',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('symbol', models.CharField(max_length=20)),
                ('units', models.DecimalField(decimal_places=10, max_digits=20)),
                ('value', models.DecimalField(decimal_places=10, max_digits=20)),
                ('average_price', models.DecimalField(decimal_places=10, max_digits=20)),
                ('latest_transaction_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'vw_owner_portfolios_summary_symbols',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='PortfolioSummary',
            fields=[
                ('id', models.BigIntegerField(primary_key=True, serialize=False)),
                ('symbol', models.CharField(max_length=20)),
                ('units', models.DecimalField(decimal_places=10, max_digits=20)),
                ('value', models.DecimalField(decimal_places=10, max_digits=20)),
                ('average_price', models.DecimalField(decimal_places=10, max_digits=20)),
            ],
            options={
                'db_table': 'vw_portfolios_summary',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Portfolio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='portfolio_owned_by', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('name',),
                'unique_together': {('name', 'owner')},
            },
        ),
        migrations.CreateModel(
            name='TransactionType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=5, unique=True)),
                ('description', models.CharField(max_length=10)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ('code',),
            },
        ),
        migrations.CreateModel(
            name='PortfolioDetail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('symbol', models.CharField(max_length=20)),
                ('transaction_date', models.DateTimeField()),
                ('units', models.DecimalField(decimal_places=10, max_digits=20)),
                ('price', models.DecimalField(decimal_places=10, max_digits=20)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('portfolio_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='portfolio_details', to='portfolios.Portfolio')),
                ('transaction_type_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='portfolio_detail_trans', to='portfolios.TransactionType')),
            ],
            options={
                'ordering': ('symbol', '-transaction_date'),
            },
        ),
    ]
