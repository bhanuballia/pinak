from charts.divisional.d11_rudramsha import D11Rudramsha

d11 = D11Rudramsha()

# Test case: Aries at 1.0 degree (1st part of an Odd sign)
# Odd: Start from self. Part 1 should be Aries (0).
res = d11.calculate(1.0)
print(f"Natal: Aries 1.0° -> D11 Sign Index: {res['sign_index']} ({res['sign_name']})")
if res['sign_index'] == 0:
    print("SUCCESS: D11 matches Odd-sign rule (Part 1).")
else:
    print(f"FAILURE: Expected 0, got {res['sign_index']}")

# Test case: Taurus at 1.0 degree (1st part of an Even sign)
# Even: Start from 12th from sign. 12th from Taurus(1) is Aries(0).
# Part 1 of Taurus should be Aries (0).
res_even = d11.calculate(31.0) # Taurus 1.0 deg
print(f"Natal: Taurus 1.0° -> D11 Sign Index: {res_even['sign_index']} ({res_even['sign_name']})")
if res_even['sign_index'] == 0:
    print("SUCCESS: D11 matches Even-sign rule (Part 1).")
else:
    print(f"FAILURE: Expected 0, got {res_even['sign_index']}")
