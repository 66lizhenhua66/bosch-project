import psycopg2


conn = psycopg2.connect(database="boshi", user="postgres", password="admin", host="127.0.0.1", port="5432")
cur = conn.cursor()
cur.execute("SELECT * FROM public.program")
rows = cur.fetchall()

print(type(rows))
print(rows)

cur.close()
conn.close()
