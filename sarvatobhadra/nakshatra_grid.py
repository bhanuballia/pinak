class NakshatraGrid:

    def build_grid(self):
        # 9x9 = 81 cells
        grid = [{"id": i, "label": "", "type": "empty"} for i in range(81)]

        def set_cell(r, c, label, cell_type, index=None):
            idx = r * 9 + c
            grid[idx]["label"] = label
            grid[idx]["type"] = cell_type
            if index:
                grid[idx]["index"] = index

        # 1. Outer Ring: Nakshatras & Swaras (Vowels) in corners
        # Top corners
        set_cell(0, 0, "अ (a)", "swara", "1/1")
        set_cell(0, 8, "आ (aa)", "swara", "1/2")
        # Bottom corners
        set_cell(8, 0, "ई (ii)", "swara", "1/4")
        set_cell(8, 8, "इ (i)", "swara", "1/3")

        # Top edge (Krittika to Ashlesha)
        top_naks = ["Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha"]
        for i, nak in enumerate(top_naks):
            set_cell(0, i + 1, nak, "nakshatra")

        # Right edge (Magha to Vishakha)
        right_naks = ["Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha"]
        for i, nak in enumerate(right_naks):
            set_cell(i + 1, 8, nak, "nakshatra")

        # Bottom edge (Anuradha to Shravana, right to left)
        bottom_naks = ["Anuradha", "Jyeshtha", "Mula", "Purvashadha", "Uttarashadha", "Abhijit", "Shravana"]
        for i, nak in enumerate(bottom_naks):
            set_cell(8, 7 - i, nak, "nakshatra")

        # Left edge (Dhanishta to Bharani, bottom to top)
        left_naks = ["Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati", "Ashwini", "Bharani"]
        for i, nak in enumerate(left_naks):
            set_cell(7 - i, 0, nak, "nakshatra")

        # 2. Inner Ring 1: Rashis (Signs) and Aksharas (Consonants)
        # Corners of Ring 1
        set_cell(1, 1, "उ (u)", "swara", "1/5")
        set_cell(1, 7, "ऊ (uu)", "swara", "1/6")
        set_cell(7, 1, "ॠ (rri)", "swara", "1/8")
        set_cell(7, 7, "ऋ (ri)", "swara", "1/7")

        # Top Rashis
        set_cell(1, 2, "अ (a)", "akshara", "3/17")
        set_cell(1, 3, "व (va)", "akshara", "3/18")
        set_cell(1, 4, "क (ka)", "akshara", "3/19")
        set_cell(1, 5, "ह (ha)", "akshara", "3/20")
        set_cell(1, 6, "ड (da)", "akshara", "3/21")

        # Right Rashis
        set_cell(2, 7, "म (ma)", "akshara", "3/22")
        set_cell(3, 7, "ट (ta)", "akshara", "3/23")
        set_cell(4, 7, "प (pa)", "akshara", "3/24")
        set_cell(5, 7, "र (ra)", "akshara", "3/25")
        set_cell(6, 7, "त (ta)", "akshara", "3/26")

        # Bottom Rashis
        set_cell(7, 6, "न (na)", "akshara", "3/27")
        set_cell(7, 5, "य (ya)", "akshara", "3/28")
        set_cell(7, 4, "भ (bha)", "akshara", "3/29")
        set_cell(7, 3, "ज (ja)", "akshara", "3/30")
        set_cell(7, 2, "ख (kha)", "akshara", "3/31")

        # Left Rashis
        set_cell(6, 1, "ग (ga)", "akshara", "3/32")
        set_cell(5, 1, "श (sha)", "akshara", "3/33")
        set_cell(4, 1, "द (da)", "akshara", "3/34")
        set_cell(3, 1, "च (cha)", "akshara", "3/35")
        set_cell(2, 1, "ल (la)", "akshara", "3/36")

        # 3. Inner Ring 2: Rashis 
        # Taurus, Gemini, Cancer (Top)
        set_cell(2, 3, "Taurus", "rashi", "4/2")
        set_cell(2, 4, "Gemini", "rashi", "4/3")
        set_cell(2, 5, "Cancer", "rashi", "4/4")
        # Leo, Virgo, Libra (Right)
        set_cell(3, 6, "Leo", "rashi", "4/5")
        set_cell(4, 6, "Virgo", "rashi", "4/6")
        set_cell(5, 6, "Libra", "rashi", "4/7")
        # Scorpio, Sagittarius, Capricorn (Bottom)
        set_cell(6, 5, "Scorpio", "rashi", "4/8")
        set_cell(6, 4, "Sagittarius", "rashi", "4/9")
        set_cell(6, 3, "Capricorn", "rashi", "4/10")
        # Aquarius, Pisces, Aries (Left)
        set_cell(5, 2, "Aquarius", "rashi", "4/11")
        set_cell(4, 2, "Pisces", "rashi", "4/12")
        set_cell(3, 2, "Aries", "rashi", "4/1")

        # Fill remaining gaps with Tithis / Days (Center cross)
        set_cell(3, 3, "Nanda", "tithi")
        set_cell(3, 5, "Bhadra", "tithi")
        set_cell(5, 3, "Jaya", "tithi")
        set_cell(5, 5, "Rikta", "tithi")
        
        # Center core
        set_cell(4, 4, "Purna", "tithi")
        set_cell(3, 4, "Sun/Tue", "day")
        set_cell(4, 3, "Fri", "day")
        set_cell(4, 5, "Mon/Wed", "day")
        set_cell(5, 4, "Thu", "day")
        
        # Some empty cells in corners of rashi ring for neatness
        set_cell(2, 2, "लृ (lri)", "swara", "1/9")
        set_cell(2, 6, "लॄ (lrii)", "swara", "1/10")
        set_cell(6, 2, "ऐ (ai)", "swara", "1/12")
        set_cell(6, 6, "ए (e)", "swara", "1/11")
        
        # Inner most corners (next to tithis)
        set_cell(3, 3, "ओ (o)", "swara", "1/13")
        set_cell(3, 5, "औ (au)", "swara", "1/14")
        set_cell(5, 3, "अः (ah)", "swara", "1/16")
        set_cell(5, 5, "अं (am)", "swara", "1/15")

        return grid
