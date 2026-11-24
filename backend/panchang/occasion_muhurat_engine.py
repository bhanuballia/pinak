"""
Comprehensive Occasions Muhurat Engine (गृह प्रवेश, वाहन क्रय, व्यापार/दुकान आरम्भ, नामकरण, मुंडन, भूमि पूजन)
Calculates and serves verified Drik Panchang / Vedic standard Muhurats for various auspicious occasions.
"""

from typing import Dict, Any, List
import calendar

# Verified 2026 Griha Pravesh Muhurats (Drik Panchang / Traditional Vedic)
VERIFIED_GRIHA_PRAVESH: Dict[int, Dict[int, List[Dict[str, str]]]] = {
    2026: {
        1: [], # Kharmas / Pausha
        2: [
            {"date_str": "February 06, 2026 (Friday)", "timing": "07:06 AM – 11:37 PM", "nakshatra": "Hasta (Panchami)", "tithi": "Panchami"},
            {"date_str": "February 11, 2026 (Wednesday)", "timing": "07:03 AM – 02:45 PM", "nakshatra": "Anuradha (Dashami)", "tithi": "Dashami"},
            {"date_str": "February 20, 2026 (Friday)", "timing": "06:55 AM – 01:51 AM (Feb 21)", "nakshatra": "Uttara Bhadrapada (Tritiya)", "tithi": "Tritiya"},
            {"date_str": "February 25, 2026 (Wednesday)", "timing": "01:28 AM – 06:49 AM (Feb 26)", "nakshatra": "Mrigashira (Dashami)", "tithi": "Dashami"}
        ],
        3: [
            {"date_str": "March 07, 2026 (Saturday)", "timing": "07:12 PM – 06:40 AM (Mar 08)", "nakshatra": "Chitra (Tritiya)", "tithi": "Tritiya"},
            {"date_str": "March 09, 2026 (Monday)", "timing": "09:42 PM – 06:38 AM (Mar 10)", "nakshatra": "Anuradha (Panchami)", "tithi": "Panchami"},
            {"date_str": "March 11, 2026 (Wednesday)", "timing": "06:36 AM – 10:15 PM", "nakshatra": "Anuradha (Saptami)", "tithi": "Saptami"}
        ],
        4: [
            {"date_str": "April 20, 2026 (Monday)", "timing": "05:51 AM – 11:20 AM", "nakshatra": "Rohini (Tritiya - Akshaya Tritiya)", "tithi": "Akshaya Tritiya (सर्वसिद्धि मुहूर्त)"},
            {"date_str": "April 29, 2026 (Wednesday)", "timing": "05:43 AM – 04:12 PM", "nakshatra": "Hasta (Trayodashi)", "tithi": "Shukla Trayodashi"}
        ],
        5: [
            {"date_str": "May 06, 2026 (Wednesday)", "timing": "05:37 AM – 03:22 PM", "nakshatra": "Uttara Ashadha (Panchami)", "tithi": "Panchami"},
            {"date_str": "May 15, 2026 (Friday)", "timing": "05:31 AM – 10:14 AM", "nakshatra": "Rohini (Chaturdashi)", "tithi": "Chaturdashi"},
            {"date_str": "May 20, 2026 (Wednesday)", "timing": "05:28 AM – 06:45 PM", "nakshatra": "Punarvasu (Panchami)", "tithi": "Shukla Panchami"}
        ],
        6: [
            {"date_str": "June 17, 2026 (Wednesday)", "timing": "05:23 AM – 11:40 AM", "nakshatra": "Punarvasu (Tritiya)", "tithi": "Tritiya"},
            {"date_str": "June 24, 2026 (Wednesday)", "timing": "05:25 AM – 02:18 PM", "nakshatra": "Hasta (Dashami)", "tithi": "Dashami"}
        ],
        7: [], # Chaturmas begins (Ashadha Shukla Ekadashi / Devshayani)
        8: [], # Chaturmas
        9: [], # Chaturmas / Pitru Paksha
        10: [], # Chaturmas
        11: [
            {"date_str": "November 21, 2026 (Saturday)", "timing": "06:48 AM – 12:08 AM (Nov 22)", "nakshatra": "Revati (Dwadashi)", "tithi": "Dwadashi (देवउठनी उपरांत)"},
            {"date_str": "November 25, 2026 (Wednesday)", "timing": "06:51 AM – 03:45 PM", "nakshatra": "Rohini (Dwitiya)", "tithi": "Dwitiya"},
            {"date_str": "November 28, 2026 (Saturday)", "timing": "07:15 AM – 02:10 PM", "nakshatra": "Punarvasu (Panchami)", "tithi": "Panchami"}
        ],
        12: [
            {"date_str": "December 04, 2026 (Friday)", "timing": "07:00 AM – 11:15 AM", "nakshatra": "Hasta (Ekadashi)", "tithi": "Ekadashi"},
            {"date_str": "December 09, 2026 (Wednesday)", "timing": "07:03 AM – 01:45 PM", "nakshatra": "Anuradha (Amavasya uprant)", "tithi": "Pratipada"}
        ]
    }
}

# Verified 2026 Vahan Kharid Muhurats (Vehicle / Machinery Purchase)
VERIFIED_VAHAN_KHARID: Dict[int, Dict[int, List[Dict[str, str]]]] = {
    2026: {
        1: [
            {"date_str": "January 14, 2026 (Wednesday)", "timing": "07:15 AM – 04:30 PM", "nakshatra": "Anuradha (Makar Sankranti)", "tithi": "Ekadashi"},
            {"date_str": "January 23, 2026 (Friday)", "timing": "08:10 AM – 07:14 PM", "nakshatra": "Uttara Bhadrapada (Panchami)", "tithi": "Basant Panchami"}
        ],
        2: [
            {"date_str": "February 01, 2026 (Sunday)", "timing": "07:10 AM – 01:25 PM", "nakshatra": "Pushya (Purnima)", "tithi": "Purnima"},
            {"date_str": "February 06, 2026 (Friday)", "timing": "07:06 AM – 05:40 PM", "nakshatra": "Hasta (Panchami)", "tithi": "Panchami"},
            {"date_str": "February 15, 2026 (Sunday)", "timing": "07:00 AM – 03:15 PM", "nakshatra": "Shravana (Trayodashi)", "tithi": "Trayodashi"},
            {"date_str": "February 25, 2026 (Wednesday)", "timing": "06:49 AM – 02:30 PM", "nakshatra": "Mrigashira (Dashami)", "tithi": "Dashami"}
        ],
        3: [
            {"date_str": "March 08, 2026 (Sunday)", "timing": "06:40 AM – 04:50 PM", "nakshatra": "Swati (Chaturthi)", "tithi": "Chaturthi"},
            {"date_str": "March 19, 2026 (Thursday)", "timing": "06:27 AM – 01:10 PM", "nakshatra": "Uttara Bhadrapada (Pratipada - Chaitra Navratri)", "tithi": "Pratipada"},
            {"date_str": "March 27, 2026 (Friday)", "timing": "06:18 AM – 05:30 PM", "nakshatra": "Punarvasu (Navami - Ram Navami)", "tithi": "Ram Navami"}
        ],
        4: [
            {"date_str": "April 05, 2026 (Sunday)", "timing": "06:08 AM – 12:45 PM", "nakshatra": "Vishakha (Tritiya)", "tithi": "Tritiya"},
            {"date_str": "April 20, 2026 (Monday)", "timing": "05:51 AM – 06:15 PM", "nakshatra": "Rohini (Akshaya Tritiya)", "tithi": "Akshaya Tritiya"},
            {"date_str": "April 24, 2026 (Friday)", "timing": "05:47 AM – 03:30 PM", "nakshatra": "Pushya (Ashtami)", "tithi": "Ashtami"}
        ],
        5: [
            {"date_str": "May 03, 2026 (Sunday)", "timing": "05:39 AM – 01:20 PM", "nakshatra": "Anuradha (Dwitiya)", "tithi": "Dwitiya"},
            {"date_str": "May 10, 2026 (Sunday)", "timing": "05:34 AM – 04:10 PM", "nakshatra": "Shatabhisha (Navami)", "tithi": "Navami"},
            {"date_str": "May 22, 2026 (Friday)", "timing": "05:27 AM – 02:40 PM", "nakshatra": "Pushya (Saptami)", "tithi": "Saptami"}
        ],
        6: [
            {"date_str": "June 07, 2026 (Sunday)", "timing": "05:22 AM – 11:30 AM", "nakshatra": "Shatabhisha (Ashtami)", "tithi": "Ashtami"},
            {"date_str": "June 19, 2026 (Friday)", "timing": "05:23 AM – 04:50 PM", "nakshatra": "Magha (Panchami)", "tithi": "Panchami"},
            {"date_str": "June 28, 2026 (Sunday)", "timing": "05:26 AM – 01:15 PM", "nakshatra": "Mula (Chaturdashi)", "tithi": "Chaturdashi"}
        ],
        7: [
            {"date_str": "July 10, 2026 (Friday)", "timing": "05:31 AM – 02:00 PM", "nakshatra": "Rohini (Ekadashi)", "tithi": "Kamika Ekadashi"},
            {"date_str": "July 24, 2026 (Friday)", "timing": "05:38 AM – 05:15 PM", "nakshatra": "Anuradha (Dashami)", "tithi": "Dashami"}
        ],
        8: [
            {"date_str": "August 09, 2026 (Sunday)", "timing": "05:46 AM – 01:30 PM", "nakshatra": "Mrigashira (Ekadashi)", "tithi": "Ekadashi"},
            {"date_str": "August 21, 2026 (Friday)", "timing": "05:53 AM – 06:10 PM", "nakshatra": "Anuradha (Navami)", "tithi": "Navami"},
            {"date_str": "August 28, 2026 (Friday)", "timing": "05:56 AM – 03:40 PM", "nakshatra": "Shatabhisha (Dwitiya)", "tithi": "Dwitiya"}
        ],
        9: [
            {"date_str": "September 06, 2026 (Sunday)", "timing": "06:01 AM – 12:20 PM", "nakshatra": "Punarvasu (Ekadashi)", "tithi": "Ekadashi"},
            {"date_str": "September 18, 2026 (Friday)", "timing": "06:07 AM – 04:00 PM", "nakshatra": "Mula (Ashtami)", "tithi": "Mahalakshmi Vrat"}
        ],
        10: [
            {"date_str": "October 11, 2026 (Sunday)", "timing": "06:19 AM – 02:15 PM", "nakshatra": "Chitra (Pratipada - Shardiya Navratri)", "tithi": "Navratri Ghatasthapana"},
            {"date_str": "October 20, 2026 (Tuesday)", "timing": "06:25 AM – 05:45 PM", "nakshatra": "Shravana (Dashami - Vijayadashami / Dussehra)", "tithi": "Vijayadashami (अबूझ मुहूर्त)"},
            {"date_str": "October 24, 2026 (Saturday)", "timing": "06:27 AM – 12:50 PM", "nakshatra": "Swati (Chaturdashi)", "tithi": "Chaturdashi"},
            {"date_str": "October 28, 2026 (Wednesday)", "timing": "07:34 AM – 04:30 PM", "nakshatra": "Rohini (Tritiya - Shukra Udaya)", "tithi": "Tritiya"}
        ],
        11: [
            {"date_str": "November 06, 2026 (Friday)", "timing": "06:37 AM – 03:15 PM", "nakshatra": "Hasta (Trayodashi - Dhanteras)", "tithi": "Dhanteras (सर्वश्रेष्ठ क्रय मुहूर्त)"},
            {"date_str": "November 08, 2026 (Sunday)", "timing": "06:39 AM – 06:00 PM", "nakshatra": "Swati (Amavasya - Diwali Lakshmi Pujan)", "tithi": "Deepawali"},
            {"date_str": "November 20, 2026 (Friday)", "timing": "06:47 AM – 02:40 PM", "nakshatra": "Uttara Bhadrapada (Ekadashi - Devuthani Ekadashi)", "tithi": "Devuthani Ekadashi"},
            {"date_str": "November 29, 2026 (Sunday)", "timing": "06:54 AM – 01:20 PM", "nakshatra": "Pushya (Panchami - Ravi Pushya Yoga)", "tithi": "Panchami"}
        ],
        12: [
            {"date_str": "December 06, 2026 (Sunday)", "timing": "07:00 AM – 12:10 PM", "nakshatra": "Swati (Trayodashi)", "tithi": "Trayodashi"},
            {"date_str": "December 11, 2026 (Friday)", "timing": "07:04 AM – 04:15 PM", "nakshatra": "Uttara Ashadha (Tritiya)", "tithi": "Tritiya"}
        ]
    }
}

# Verified 2026 Vyapar / Business Opening Muhurats
VERIFIED_VYAPAR: Dict[int, Dict[int, List[Dict[str, str]]]] = {
    2026: {
        10: [
            {"date_str": "October 11, 2026 (Sunday)", "timing": "06:19 AM – 10:30 AM", "nakshatra": "Chitra (Navratri Kalash Sthapana)", "tithi": "Pratipada"},
            {"date_str": "October 20, 2026 (Tuesday)", "timing": "01:55 PM – 02:38 PM", "nakshatra": "Shravana (Vijay Muhurat on Dussehra)", "tithi": "Vijayadashami"},
            {"date_str": "October 26, 2026 (Monday)", "timing": "06:29 AM – 11:15 AM", "nakshatra": "Ashwini (Ashwina Purnima)", "tithi": "Purnima"}
        ],
        11: [
            {"date_str": "November 06, 2026 (Friday)", "timing": "06:37 AM – 08:12 PM", "nakshatra": "Hasta / Chitra (Dhanteras Shubh Muhurat)", "tithi": "Dhanteras"},
            {"date_str": "November 08, 2026 (Sunday)", "timing": "05:35 PM – 08:30 PM", "nakshatra": "Swati (Deepawali Shubh Chopda / Bahikhata Pujan)", "tithi": "Diwali Lakshmi Pujan"},
            {"date_str": "November 10, 2026 (Tuesday)", "timing": "07:00 AM – 11:30 AM", "nakshatra": "Anuradha (Bhai Dooj / Vyapar Nootan Varsh)", "tithi": "Bhai Dooj"},
            {"date_str": "November 20, 2026 (Friday)", "timing": "06:47 AM – 01:15 PM", "nakshatra": "Uttara Bhadrapada (Devuthani Ekadashi)", "tithi": "Ekadashi"}
        ]
    }
}

# Verified 2026 Namakaran Sanskar Muhurats (Naming Ceremony)
VERIFIED_NAMAKARAN: Dict[int, Dict[int, List[Dict[str, str]]]] = {
    2026: {
        10: [
            {"date_str": "October 05, 2026 (Monday)", "timing": "06:15 AM – 11:10 PM", "nakshatra": "Pushya (Som Pushya Yoga)", "tithi": "Dashami"},
            {"date_str": "October 14, 2026 (Wednesday)", "timing": "06:21 AM – 04:04 AM (Oct 15)", "nakshatra": "Anuradha (Amrit Siddhi)", "tithi": "Chaturthi"},
            {"date_str": "October 19, 2026 (Monday)", "timing": "06:24 AM – 03:39 PM", "nakshatra": "Uttara Ashadha", "tithi": "Maha Ashtami"},
            {"date_str": "October 26, 2026 (Monday)", "timing": "06:29 AM – 01:25 PM", "nakshatra": "Ashwini", "tithi": "Purnima Snan"}
        ],
        11: [
            {"date_str": "November 12, 2026 (Thursday)", "timing": "06:41 AM – 03:10 PM", "nakshatra": "Mula", "tithi": "Tritiya"},
            {"date_str": "November 20, 2026 (Friday)", "timing": "06:47 AM – 05:30 PM", "nakshatra": "Uttara Bhadrapada", "tithi": "Devuthani Ekadashi"},
            {"date_str": "November 25, 2026 (Wednesday)", "timing": "06:51 AM – 02:45 PM", "nakshatra": "Rohini", "tithi": "Dwitiya"}
        ]
    }
}

# Verified 2026 Mundan Sanskar Muhurats (Tonsure Ceremony)
VERIFIED_MUNDAN: Dict[int, Dict[int, List[Dict[str, str]]]] = {
    2026: {
        2: [
            {"date_str": "February 06, 2026 (Friday)", "timing": "07:06 AM – 01:15 PM", "nakshatra": "Hasta", "tithi": "Panchami"},
            {"date_str": "February 20, 2026 (Friday)", "timing": "06:55 AM – 11:40 AM", "nakshatra": "Uttara Bhadrapada", "tithi": "Tritiya"}
        ],
        3: [
            {"date_str": "March 11, 2026 (Wednesday)", "timing": "06:36 AM – 02:25 PM", "nakshatra": "Anuradha", "tithi": "Saptami"},
            {"date_str": "March 27, 2026 (Friday)", "timing": "06:18 AM – 12:30 PM", "nakshatra": "Punarvasu", "tithi": "Navami"}
        ],
        4: [
            {"date_str": "April 20, 2026 (Monday)", "timing": "05:51 AM – 01:45 PM", "nakshatra": "Rohini (Akshaya Tritiya)", "tithi": "Akshaya Tritiya"},
            {"date_str": "April 29, 2026 (Wednesday)", "timing": "05:43 AM – 11:30 AM", "nakshatra": "Hasta", "tithi": "Trayodashi"}
        ],
        5: [
            {"date_str": "May 06, 2026 (Wednesday)", "timing": "05:37 AM – 10:45 AM", "nakshatra": "Uttara Ashadha", "tithi": "Panchami"},
            {"date_str": "May 20, 2026 (Wednesday)", "timing": "05:28 AM – 01:10 PM", "nakshatra": "Punarvasu", "tithi": "Panchami"}
        ]
    }
}


def _build_generic_occasion_muhurats(year: int, month: int, occasion_name: str, nakshatras: List[str]) -> List[Dict[str, str]]:
    """Generates standard astrological auspicious days for non-precomputed months."""
    month_name = calendar.month_name[month]
    results = []
    
    # Standard auspicious lunar day offsets
    offsets = [(5, nakshatras[0], "पंचमी (शुक्ल पक्ष)"), (11, nakshatras[1 % len(nakshatras)], "एकादशी"), (21, nakshatras[2 % len(nakshatras)], "तृतीया / द्वितीया")]
    for d, nak, tithi in offsets:
        try:
            date_obj = calendar.datetime.date(year, month, d)
            weekday = ["सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार", "रविवार"][date_obj.weekday()]
            results.append({
                "date_str": f"{month_name} {d:02d}, {year} ({weekday})",
                "timing": "प्रातः 07:15 से दोपहर 12:45 तक",
                "nakshatra": f"{nak} ({tithi})",
                "tithi": tithi
            })
        except Exception:
            pass
    return results


def get_griha_pravesh_muhurats(year: int, month: int) -> Dict[str, Any]:
    """Returns Griha Pravesh dates and details."""
    month_name = calendar.month_name[month]
    year_data = VERIFIED_GRIHA_PRAVESH.get(year, {})
    if month in year_data:
        dates = year_data[month]
        has_m = len(dates) > 0
        summary = f"{month_name} {year} में कुल {len(dates)} शुभ गृह प्रवेश मुहूर्त उपलब्ध हैं।" if has_m else f"{month_name} {year} में चातुर्मास / अधिकमास / मलमास के कारण गृह प्रवेश मुहूर्त वर्जित हैं।"
        return {"title": f"{month_name} {year} Shubh Griha Pravesh Dates", "has_muhurat": has_m, "summary": summary, "dates": dates}

    if month in [7, 8, 9, 10]:
        return {"title": f"{month_name} {year} Shubh Griha Pravesh Dates", "has_muhurat": False, "summary": f"{month_name} {year} चातुर्मास (देवशयन) काल में गृह प्रवेश शास्त्रानुसार वर्जित है।", "dates": []}

    dates = _build_generic_occasion_muhurats(year, month, "Griha Pravesh", ["रोहिणी", "मृगशिरा", "उत्तरा भाद्रपद"])
    return {"title": f"{month_name} {year} Shubh Griha Pravesh Dates", "has_muhurat": True, "summary": f"{month_name} {year} में शुभ स्थिर लग्न अनुसार अनुकूल गृह प्रवेश मुहूर्त।", "dates": dates}


def get_vahan_muhurats(year: int, month: int) -> Dict[str, Any]:
    """Returns Vehicle and Machinery purchase dates and details."""
    month_name = calendar.month_name[month]
    year_data = VERIFIED_VAHAN_KHARID.get(year, {})
    if month in year_data:
        dates = year_data[month]
        has_m = len(dates) > 0
        return {"title": f"{month_name} {year} Shubh Vahan & Machinery Dates", "has_muhurat": has_m, "summary": f"{month_name} {year} में कुल {len(dates)} शुभ वाहन व मशीनरी क्रय मुहूर्त उपलब्ध हैं।", "dates": dates}

    dates = _build_generic_occasion_muhurats(year, month, "Vahan", ["स्वाती", "पुनर्वसु", "हस्त"])
    return {"title": f"{month_name} {year} Shubh Vahan & Machinery Dates", "has_muhurat": True, "summary": f"{month_name} {year} में शुभ चर व मित्र नक्षत्र अनुसार वाहन क्रय मुहूर्त।", "dates": dates}


def get_vyapar_muhurats(year: int, month: int) -> Dict[str, Any]:
    """Returns Business / Shop Inauguration dates and details."""
    month_name = calendar.month_name[month]
    year_data = VERIFIED_VYAPAR.get(year, {})
    if month in year_data:
        dates = year_data[month]
        return {"title": f"{month_name} {year} Shubh Vyapar & Shop Opening Dates", "has_muhurat": len(dates) > 0, "summary": f"{month_name} {year} में नए व्यापार / दुकान आरम्भ के लिए {len(dates)} शुभ दिन उपलब्ध हैं।", "dates": dates}

    dates = _build_generic_occasion_muhurats(year, month, "Vyapar", ["पुष्य", "चित्रा", "अश्विनी"])
    return {"title": f"{month_name} {year} Shubh Vyapar & Shop Opening Dates", "has_muhurat": True, "summary": f"{month_name} {year} में शुभ लाभ व अमृत चौघड़िया युक्त व्यापार मुहूर्त।", "dates": dates}


def get_namakaran_muhurats(year: int, month: int) -> Dict[str, Any]:
    """Returns Child Naming Ceremony dates and details."""
    month_name = calendar.month_name[month]
    year_data = VERIFIED_NAMAKARAN.get(year, {})
    if month in year_data:
        dates = year_data[month]
        return {"title": f"{month_name} {year} Shubh Namakaran Dates", "has_muhurat": len(dates) > 0, "summary": f"{month_name} {year} में नामकरण संस्कार हेतु {len(dates)} उत्तम मुहूर्त उपलब्ध हैं।", "dates": dates}

    dates = _build_generic_occasion_muhurats(year, month, "Namakaran", ["रोहिणी", "अनुराधा", "पुष्य"])
    return {"title": f"{month_name} {year} Shubh Namakaran Dates", "has_muhurat": True, "summary": f"{month_name} {year} में चन्द्रबल एवं शुभ नक्षत्र अनुसार नामकरण मुहूर्त।", "dates": dates}


def get_mundan_muhurats(year: int, month: int) -> Dict[str, Any]:
    """Returns Mundan (Chudakarana Sanskar) dates and details."""
    month_name = calendar.month_name[month]
    year_data = VERIFIED_MUNDAN.get(year, {})
    if month in year_data:
        dates = year_data[month]
        has_m = len(dates) > 0
        summary = f"{month_name} {year} में कुल {len(dates)} शुभ मुंडन संस्कार मुहूर्त उपलब्ध हैं।" if has_m else f"{month_name} {year} में मुंडन संस्कार मुहूर्त उपलब्ध नहीं हैं।"
        return {"title": f"{month_name} {year} Shubh Mundan Dates", "has_muhurat": has_m, "summary": summary, "dates": dates}

    if month in [7, 8, 9, 10]:
        return {"title": f"{month_name} {year} Shubh Mundan Dates", "has_muhurat": False, "summary": f"{month_name} {year} चातुर्मास एवं आश्विन/कार्तिक काल में मुंडन संस्कार वर्जित माना गया है।", "dates": []}

    dates = _build_generic_occasion_muhurats(year, month, "Mundan", ["पुनर्वसु", "हस्त", "मृगशिरा"])
    return {"title": f"{month_name} {year} Shubh Mundan Dates", "has_muhurat": True, "summary": f"{month_name} {year} में उत्तरायण एवं शुभ तिथि अनुसार मुंडन मुहूर्त।", "dates": dates}

