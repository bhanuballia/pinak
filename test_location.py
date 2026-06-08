from utils.location_resolver import search_city, safe_search_city
import time

start = time.time()
safe_search_city("ballia", limit=8)
print("First safe_search_city:", time.time()-start)

start = time.time()
safe_search_city("ballia", limit=8)
print("Second safe_search_city:", time.time()-start)

print(safe_search_city.cache_info())
print(search_city.cache_info())
