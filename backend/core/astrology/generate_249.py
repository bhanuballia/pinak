DASHA_YEARS = {'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7, 'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17}
DASHA_SEQ = list(DASHA_YEARS.keys())
SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

def get_249():
    res = []
    current_deg = 0.0
    horary_num = 1
    
    for n in range(27):
        star_lord = DASHA_SEQ[n % 9]
        start_idx = DASHA_SEQ.index(star_lord)
        
        for s in range(9):
            sub_lord = DASHA_SEQ[(start_idx + s) % 9]
            sub_span = (DASHA_YEARS[sub_lord] / 120.0) * (13.0 + 20.0/60.0)
            
            sign_start = int(round(current_deg, 5) / 30)
            end_deg = current_deg + sub_span
            sign_end = int(round(end_deg, 5) / 30)
            
            # If end_deg is exactly a multiple of 30, sign_end will jump, but it shouldn't split
            # because the sublord ends exactly at the boundary.
            if round(end_deg, 5) % 30 == 0:
                sign_end = sign_start
                
            if sign_end > sign_start:
                # crosses sign boundary, split
                boundary_deg = sign_end * 30.0
                res.append({
                    'num': horary_num,
                    'sign': SIGNS[sign_start],
                    'star_lord': star_lord,
                    'sub_lord': sub_lord,
                    'start_deg': current_deg,
                    'end_deg': boundary_deg
                })
                horary_num += 1
                
                res.append({
                    'num': horary_num,
                    'sign': SIGNS[sign_end],
                    'star_lord': star_lord,
                    'sub_lord': sub_lord,
                    'start_deg': boundary_deg,
                    'end_deg': end_deg
                })
                horary_num += 1
                current_deg = end_deg
            else:
                res.append({
                    'num': horary_num,
                    'sign': SIGNS[sign_start],
                    'star_lord': star_lord,
                    'sub_lord': sub_lord,
                    'start_deg': current_deg,
                    'end_deg': end_deg
                })
                horary_num += 1
                current_deg = end_deg
    return res

l = get_249()
print(f'Total: {len(l)}')

output_file = 'kp_horary.py'
with open(output_file, 'w') as f:
    f.write('KP_249_TABLE = [\n')
    for item in l:
        f.write(f'    {item},\n')
    f.write(']\n\n')
    f.write('''def get_horary_ascendant(horary_number):
    """Returns the starting degree (Ascendant longitude) for a given horary number (1-249)."""
    if horary_number < 1 or horary_number > 249:
        raise ValueError("Horary number must be between 1 and 249")
    for entry in KP_249_TABLE:
        if entry['num'] == horary_number:
            return entry['start_deg']
    return 0.0
''')
