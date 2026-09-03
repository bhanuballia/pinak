import cv2
import mediapipe as mp
import numpy as np

mp_hands = mp.solutions.hands
# Initialize once
hands = mp_hands.Hands(
    static_image_mode=True, 
    max_num_hands=1, 
    min_detection_confidence=0.5
)

def get_bezier_curve(p0, p1, p2, p3, num_points=20):
    """Generate points for a cubic Bezier curve."""
    pts = []
    for t in np.linspace(0, 1, num_points):
        # Cubic Bezier formula
        x = (1-t)**3 * p0[0] + 3*(1-t)**2 * t * p1[0] + 3*(1-t) * t**2 * p2[0] + t**3 * p3[0]
        y = (1-t)**3 * p0[1] + 3*(1-t)**2 * t * p1[1] + 3*(1-t) * t**2 * p2[1] + t**3 * p3[1]
        pts.append(np.array([x, y]))
    return pts

def extract_palm_features(pil_image):
    """
    Extracts palm lines and mounts using MediaPipe for landmarks.
    Instead of noisy edge detection, it generates smooth, hand-proportional 
    curves based on the 3D hand structure.
    Returns normalized coordinates (0-1000) for drawing in the frontend.
    """
    img_cv = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    h, w, _ = img_cv.shape
    
    results = hands.process(cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB))
    
    if not results.multi_hand_landmarks:
        raise ValueError("No clear hand detected. Please hold your hand flat, ensure good lighting, and try again.")
        
    landmarks = results.multi_hand_landmarks[0].landmark
    
    def pt(idx):
        return np.array([landmarks[idx].x * w, landmarks[idx].y * h])

    # Validate orientation (wrist should be lower in image than middle finger tip)
    # y increases downwards, so wrist y should be GREATER than middle finger tip y
    if pt(0)[1] < pt(12)[1]:
        raise ValueError("Hand appears to be upside down. Please ensure your fingers are pointing upwards.")

    # Validate size (hand should be reasonably large in the frame)
    palm_length_px = np.linalg.norm(pt(9) - pt(0))
    if palm_length_px < h * 0.15:
        raise ValueError("Hand is too far away. Please move the camera closer so your palm fills the frame.")

    def normalize(pts):
        return [[(y/h)*1000, (x/w)*1000] for x, y in pts]

    # --- Calculate Hand Proportions ---
    # Distance from wrist(0) to middle finger base(9) is the palm length
    palm_length = np.linalg.norm(pt(9) - pt(0))
    # Distance from index base(5) to pinky base(17) is palm width
    palm_width = np.linalg.norm(pt(5) - pt(17))

    # --- Generate Smooth Proportional Lines ---

    # 1. Heart Line: Starts below pinky (17) and curves up towards index (5)/middle (9)
    heart_start = pt(17) + [0, palm_length*0.1]
    heart_end = (pt(5) + pt(9)) / 2 + [0, palm_length*0.05]
    heart_cp1 = heart_start + [-palm_width*0.2, palm_length*0.02]
    heart_cp2 = heart_end + [palm_width*0.2, palm_length*0.05]
    heart_pts = get_bezier_curve(heart_start, heart_cp1, heart_cp2, heart_end)

    # 2. Head Line: Starts between thumb(2) and index(5), curves slightly down across palm
    head_start = (pt(2) + pt(5)) / 2 + [palm_width*0.05, palm_length*0.05]
    head_end = pt(17) + [-palm_width*0.05, palm_length*0.3]
    head_cp1 = head_start + [-palm_width*0.2, palm_length*0.05]
    head_cp2 = head_end + [palm_width*0.1, -palm_length*0.02]
    head_pts = get_bezier_curve(head_start, head_cp1, head_cp2, head_end)

    # 3. Life Line: Starts with Head Line, curves heavily around Thumb (Mount of Venus) to wrist (0)
    life_start = head_start
    life_end = pt(0) + [palm_width*0.1, -palm_length*0.05]
    life_cp1 = pt(2) + [-palm_width*0.1, palm_length*0.2]
    life_cp2 = pt(1) + [palm_width*0.1, 0]
    life_pts = get_bezier_curve(life_start, life_cp1, life_cp2, life_end)

    # 4. Fate Line: Straight/slightly curved up the middle from wrist (0) to middle finger (9)
    fate_start = pt(0) + [-palm_width*0.05, -palm_length*0.1]
    fate_end = pt(9) + [0, palm_length*0.05]  # Stops right under middle finger
    fate_cp1 = fate_start + [0, -palm_length*0.2]
    fate_cp2 = fate_end + [0, palm_length*0.2]
    fate_pts = get_bezier_curve(fate_start, fate_cp1, fate_cp2, fate_end)
    
    # 5. Sun Line: Vertical line going towards the ring finger (13)
    sun_start = pt(0) + [palm_width*0.2, -palm_length*0.15]
    sun_end = pt(13) + [0, palm_length*0.08]  # Stops under ring finger
    sun_cp1 = sun_start + [0, -palm_length*0.2]
    sun_cp2 = sun_end + [0, palm_length*0.2]
    sun_pts = get_bezier_curve(sun_start, sun_cp1, sun_cp2, sun_end)

    # 6. Marriage Line: Short horizontal line below pinky (17) on the percussion
    marriage_start = pt(17) + [palm_width*0.1, palm_length*0.1]
    marriage_end = pt(17) + [palm_width*0.25, palm_length*0.1]
    marriage_cp1 = marriage_start + [palm_width*0.05, 0]
    marriage_cp2 = marriage_end + [-palm_width*0.05, 0]
    marriage_pts = get_bezier_curve(marriage_start, marriage_cp1, marriage_cp2, marriage_end)

    # 7. Children Line: Short vertical line rising from the Marriage Line
    children_start = pt(17) + [palm_width*0.15, palm_length*0.1]
    children_end = pt(17) + [palm_width*0.15, palm_length*0.05]
    children_cp1 = children_start + [0, -palm_length*0.02]
    children_cp2 = children_end + [0, palm_length*0.02]
    children_pts = get_bezier_curve(children_start, children_cp1, children_cp2, children_end)

    # 8. Wrist Bracelets (मणिबंध रेखा): 3 horizontal curves at the wrist (0)
    def make_bracelet(y_offset_pct):
        start = pt(0) + [-palm_width*0.2, palm_length*y_offset_pct]
        end = pt(0) + [palm_width*0.2, palm_length*y_offset_pct]
        cp1 = start + [palm_width*0.1, palm_length*0.05]
        cp2 = end + [-palm_width*0.1, palm_length*0.05]
        return normalize(get_bezier_curve(start, cp1, cp2, end))

    bracelet_1 = make_bracelet(0.0)
    bracelet_2 = make_bracelet(0.05)
    bracelet_3 = make_bracelet(0.1)

    lines = [
        {"name": "Heart Line", "points": normalize(heart_pts)},
        {"name": "Head Line", "points": normalize(head_pts)},
        {"name": "Life Line", "points": normalize(life_pts)},
        {"name": "Fate Line (Bhagya Rekha)", "points": normalize(fate_pts)},
        {"name": "Sun Line", "points": normalize(sun_pts)},
        {"name": "Marriage Line", "points": normalize(marriage_pts)},
        {"name": "Children Line", "points": normalize(children_pts)},
        {"name": "Manibandh Rekha 1", "points": bracelet_1},
        {"name": "Manibandh Rekha 2", "points": bracelet_2},
        {"name": "Manibandh Rekha 3", "points": bracelet_3}
    ]

    # --- Generate Labels (Fingers and Zodiac Signs) ---
    def make_label(name, pt_val):
        return {
            "name": name,
            "position": [(pt_val[1]/h)*1000, (pt_val[0]/w)*1000]
        }
        
    labels = [
        # Fingers
        make_label("तर्जनी", pt(8) + [0, -palm_length*0.08]),
        make_label("मध्यमा", pt(12) + [0, -palm_length*0.08]),
        make_label("अनामिका", pt(16) + [0, -palm_length*0.08]),
        make_label("कनीनिका", pt(20) + [0, -palm_length*0.08]),
        make_label("अंगूठा", pt(4) + [palm_width*0.15, 0]),
        
        # Zodiac Signs on Phalanges (Index)
        make_label("मेष", (pt(8) + pt(7))/2),
        make_label("वृषभ", (pt(7) + pt(6))/2),
        make_label("मिथुन", (pt(6) + pt(5))/2),
        
        # Zodiac Signs on Phalanges (Middle)
        make_label("मकर", (pt(12) + pt(11))/2),
        make_label("कुंभ", (pt(11) + pt(10))/2),
        make_label("मीन", (pt(10) + pt(9))/2),
        
        # Zodiac Signs on Phalanges (Ring)
        make_label("कर्क", (pt(16) + pt(15))/2),
        make_label("सिंह", (pt(15) + pt(14))/2),
        make_label("कन्या", (pt(14) + pt(13))/2),
        
        # Zodiac Signs on Phalanges (Pinky)
        make_label("तुला", (pt(20) + pt(19))/2),
        make_label("वृश्चिक", (pt(19) + pt(18))/2),
        make_label("धनु", (pt(18) + pt(17))/2)
    ]

    # --- Generate Mounts ---
    def make_mount(name, center_idx, y_offset_pct, size_pct):
        p = pt(center_idx)
        cy = p[1] + (palm_length * y_offset_pct)
        cx = p[0]
        s = palm_width * size_pct
        return {
            "name": name,
            "bounding_box": [
                ((cy - s) / h) * 1000, ((cx - s) / w) * 1000,
                ((cy + s) / h) * 1000, ((cx + s) / w) * 1000
            ]
        }

    mounts = [
        make_mount("Mount of Jupiter", 5, 0.08, 0.1),
        make_mount("Mount of Saturn", 9, 0.08, 0.1),
        make_mount("Mount of Sun", 13, 0.08, 0.1),
        make_mount("Mount of Mercury", 17, 0.08, 0.1),
        make_mount("Mount of Venus", 2, 0.25, 0.15),
        make_mount("Mount of Moon", 17, 0.60, 0.15),
        make_mount("Mount of Mars", 17, 0.35, 0.1),
        make_mount("Mount of Rahu", 9, 0.50, 0.1),
        make_mount("Mount of Ketu", 0, -0.15, 0.1)
    ]

    return {
        "lines": lines,
        "mounts": mounts,
        "labels": labels
    }
