from flask import Flask, jsonify
from mysql.connector as mysql

servico = Flask(__name__)

IS_ALIVE = "yes"
DEBUG= True
TAMANHO_PAGINA = 2

# MYSQL_SERVER = "database"