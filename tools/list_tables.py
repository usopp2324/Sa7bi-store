import os, sys
sys.path.append(r'c:/Users/anas/Desktop/myproject')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
import django
django.setup()
from django.db import connection
print(sorted(connection.introspection.table_names()))
