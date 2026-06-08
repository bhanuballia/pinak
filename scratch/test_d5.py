from charts.divisional.d5_panchamsha import D5Panchamsha

d5 = D5Panchamsha()

# Test case: Aries at 8 degrees (2nd part of an Odd sign)
# According to the user, this should result in Aries being in the 3rd house.
# This means the Lagna sign index should be 10 (Aquarius).
res = d5.calculate(8.0)
print(f"Natal: Aries 8.0° -> D5 Sign Index: {res['sign_index']} ({res['sign_name']})")
if res['sign_index'] == 10:
    print("SUCCESS: D5 Lagna is Aquarius (10), so Aries will be in the 3rd house.")
else:
    print(f"FAILURE: Expected 10, got {res['sign_index']}")

# Test case: Taurus at 8 degrees (2nd part of an Even sign)
# Even mapping: Taurus(1), Virgo(5), Pisces(11), Capricorn(9), Cancer(3)
# 2nd part should be Virgo (5).
res_even = d5.calculate(38.0) # Taurus 8 deg
print(f"Natal: Taurus 8.0° -> D5 Sign Index: {res_even['sign_index']} ({res_even['sign_name']})")
if res_even['sign_index'] == 5:
    print("SUCCESS: D5 Lagna is Virgo (5).")
else:
    print(f"FAILURE: Expected 5, got {res_even['sign_index']}")
