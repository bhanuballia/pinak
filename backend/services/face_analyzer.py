import base64
import cv2
import mediapipe as mp
import numpy as np

mp_face_mesh = mp.solutions.face_mesh
mp_selfie_segmentation = mp.solutions.selfie_segmentation

def calculate_distance(p1, p2):
    return np.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def validate_face_image(image_bytes: bytes) -> bool:
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        return False
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    with mp_face_mesh.FaceMesh(
        static_image_mode=True,
        max_num_faces=2,
        refine_landmarks=False,
        min_detection_confidence=0.5) as face_mesh:
        
        results = face_mesh.process(image_rgb)
        if not results.multi_face_landmarks:
            return False
        if len(results.multi_face_landmarks) > 1:
            return False
            
        # Get the first face detected
        landmarks = results.multi_face_landmarks[0].landmark
        h, w, _ = image.shape
        
        def get_pt(idx):
            return (landmarks[idx].x * w, landmarks[idx].y * h)
            
        # Calculate distances from nose tip to the left and right sides of the face
        nose_tip = get_pt(1)
        left_cheek = get_pt(234)
        right_cheek = get_pt(454)
        
        dist_left = calculate_distance(nose_tip, left_cheek)
        dist_right = calculate_distance(nose_tip, right_cheek)
        
        if dist_right == 0 or dist_left == 0:
            return False
            
        # If looking straight, the distances should be roughly equal (ratio near 1.0)
        yaw_ratio = dist_left / dist_right
        
        # Reject if the head is turned too much to either side
        if yaw_ratio < 0.65 or yaw_ratio > 1.55:
            return False
            
    return True

def analyze_face_image(image_bytes: bytes) -> dict:
    # Convert image bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        raise ValueError("Could not decode image")

    # Convert the BGR image to RGB before processing
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    ratios = {
        "face_width_to_height": 1.0,
        "eye_distance_to_width": 1.0,
        "nose_length_to_face": 0.33,
        "upper_to_lower_lip": 1.0
    }

    with mp_face_mesh.FaceMesh(
        static_image_mode=True,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5) as face_mesh:
        
        results = face_mesh.process(image_rgb)
        
        if not results.multi_face_landmarks:
            raise ValueError("No face detected in the image")
            
        landmarks = results.multi_face_landmarks[0].landmark
        
        h, w, _ = image.shape
        
        # Helper to get (x,y) pixel coordinates from normalized landmarks
        def get_pt(idx):
            return (landmarks[idx].x * w, landmarks[idx].y * h)
            
        # 1. Face Shape Ratios
        top_of_head = get_pt(10)
        bottom_of_chin = get_pt(152)
        left_cheek = get_pt(234)
        right_cheek = get_pt(454)
        
        face_height = calculate_distance(top_of_head, bottom_of_chin)
        face_width = calculate_distance(left_cheek, right_cheek)
        
        if face_height > 0:
            ratios["face_width_to_height"] = face_width / face_height

        # 2. Eye Spacing
        left_eye_inner = get_pt(133)
        right_eye_inner = get_pt(362)
        left_eye_outer = get_pt(33)
        
        eye_distance = calculate_distance(left_eye_inner, right_eye_inner)
        eye_width = calculate_distance(left_eye_outer, left_eye_inner)
        
        if eye_width > 0:
            ratios["eye_distance_to_width"] = eye_distance / eye_width
            
        # 3. Nose Length
        nose_bridge = get_pt(168)
        nose_tip = get_pt(1)
        
        nose_length = calculate_distance(nose_bridge, nose_tip)
        
        if face_height > 0:
            ratios["nose_length_to_face"] = nose_length / face_height
            
        # 4. Lip Thickness
        upper_lip_top = get_pt(0)
        upper_lip_bottom = get_pt(13)
        lower_lip_top = get_pt(14)
        lower_lip_bottom = get_pt(17)
        
        upper_lip_thickness = calculate_distance(upper_lip_top, upper_lip_bottom)
        lower_lip_thickness = calculate_distance(lower_lip_top, lower_lip_bottom)
        
        if lower_lip_thickness > 0:
            ratios["upper_to_lower_lip"] = float(upper_lip_thickness / lower_lip_thickness)
        else:
            ratios["upper_to_lower_lip"] = 1.0

        # 5. Forehead Ratio
        forehead_top = get_pt(10)
        forehead_bottom = get_pt(151)
        forehead_height = calculate_distance(forehead_top, forehead_bottom)
        
        if face_height > 0:
            ratios["forehead_ratio"] = float(forehead_height / face_height)
        else:
            ratios["forehead_ratio"] = 0.33
            
        # 6. Jaw Ratio & Forehead Width
        jaw_left = get_pt(361)
        jaw_right = get_pt(132)
        jaw_width = calculate_distance(jaw_left, jaw_right)
        
        forehead_left = get_pt(251) # right temple
        forehead_right = get_pt(21) # left temple
        forehead_width = calculate_distance(forehead_left, forehead_right)
        
        if face_width > 0:
            ratios["jaw_ratio"] = float(jaw_width / face_width)
            ratios["forehead_width_ratio"] = float(forehead_width / face_width)
        else:
            ratios["jaw_ratio"] = 1.0
            ratios["forehead_width_ratio"] = 1.0

        # 7. Eyebrow Metrics
        left_eb_inner = get_pt(107)
        right_eb_inner = get_pt(336)
        eb_spacing = calculate_distance(left_eb_inner, right_eb_inner)
        left_eb_top = get_pt(52)
        left_eb_bottom = get_pt(65)
        eb_thickness = calculate_distance(left_eb_top, left_eb_bottom)
        
        if eye_distance > 0:
            ratios["eb_spacing_ratio"] = float(eb_spacing / eye_distance)
        else:
            ratios["eb_spacing_ratio"] = 1.0
            
        if face_height > 0:
            ratios["eb_thickness_ratio"] = float(eb_thickness / face_height)
        else:
            ratios["eb_thickness_ratio"] = 0.05
            
        # 8. Eye Size (Height vs Width)
        left_eye_top = get_pt(159)
        left_eye_bottom = get_pt(145)
        eye_height = calculate_distance(left_eye_top, left_eye_bottom)
        
        if eye_width > 0:
            ratios["eye_size_ratio"] = float(eye_height / eye_width)
        else:
            ratios["eye_size_ratio"] = 0.3
            
        # 9. Nose Tip Width
        nose_left = get_pt(129) # left nostril
        nose_right = get_pt(358) # right nostril
        nose_tip_width = calculate_distance(nose_left, nose_right)
        
        if face_width > 0:
            ratios["nose_tip_ratio"] = float(nose_tip_width / face_width)
        else:
            ratios["nose_tip_ratio"] = 0.2
            
        # 10. Mouth Width
        mouth_left = get_pt(61)
        mouth_right = get_pt(291)
        mouth_width = calculate_distance(mouth_left, mouth_right)
        
        if face_width > 0:
            ratios["mouth_width_ratio"] = float(mouth_width / face_width)
        else:
            ratios["mouth_width_ratio"] = 0.3
            
        # 11. Upper Lip to Face Ratio (For explicit upper lip fullness)
        if face_height > 0:
            ratios["upper_lip_ratio"] = float(upper_lip_thickness / face_height)
            ratios["lower_lip_ratio"] = float(lower_lip_thickness / face_height)
        else:
            ratios["upper_lip_ratio"] = 0.02
            ratios["lower_lip_ratio"] = 0.02

        # Ensure all other ratios are standard Python floats
        ratios["face_width_to_height"] = float(ratios["face_width_to_height"])
        ratios["eye_distance_to_width"] = float(ratios["eye_distance_to_width"])
        ratios["nose_length_to_face"] = float(ratios["nose_length_to_face"])

        # Calculate crop based on chin position to show only face and neck
        chin_y = landmarks[152].y
        top_y = landmarks[10].y
        face_h = chin_y - top_y
        
        # Crop slightly below the chin (e.g., 30% of face height for the neck)
        crop_y = chin_y + face_h * 0.3
        
        crop_bottom_px = int(crop_y * h)
        if crop_bottom_px > h:
            crop_bottom_px = h
            
        scale_y = h / crop_bottom_px if crop_bottom_px > 0 else 1.0

        # Extract normalized landmarks for frontend overlays, adjusting Y for cropped image
        extracted_landmarks = {
            "hair": {"x": landmarks[10].x, "y": landmarks[10].y * scale_y},
            "forehead": {"x": landmarks[151].x, "y": landmarks[151].y * scale_y},
            "eyebrows_right": {"x": landmarks[66].x, "y": landmarks[66].y * scale_y},
            "eyebrows_left": {"x": landmarks[296].x, "y": landmarks[296].y * scale_y},
            "eye_right": {"x": landmarks[33].x, "y": landmarks[33].y * scale_y},
            "eye_left": {"x": landmarks[263].x, "y": landmarks[263].y * scale_y},
            "nose": {"x": landmarks[1].x, "y": landmarks[1].y * scale_y},
            "cheek_right": {"x": landmarks[111].x, "y": landmarks[111].y * scale_y},
            "cheek_left": {"x": landmarks[340].x, "y": landmarks[340].y * scale_y},
            "upper_lip": {"x": landmarks[0].x, "y": landmarks[0].y * scale_y},
            "lower_lip": {"x": landmarks[14].x, "y": landmarks[14].y * scale_y},
            "chin": {"x": landmarks[152].x, "y": landmarks[152].y * scale_y},
            "ear_right": {"x": landmarks[127].x, "y": landmarks[127].y * scale_y},
            "ear_left": {"x": landmarks[356].x, "y": landmarks[356].y * scale_y},
        }

        # --- OpenCV Forehead Line Detection ---
        detected_forehead_lines = []
        try:
            top_y_px = landmarks[10].y * h
            eyebrow_y_px = min(landmarks[65].y, landmarks[295].y) * h
            left_x_px = min(landmarks[33].x, landmarks[263].x) * w
            right_x_px = max(landmarks[33].x, landmarks[263].x) * w
            
            fh_top = int(max(0, top_y_px))
            fh_bottom = int(min(h, eyebrow_y_px))
            fh_left = int(max(0, left_x_px))
            fh_right = int(min(w, right_x_px))
            
            if fh_bottom > fh_top + 10 and fh_right > fh_left + 10:
                roi = image_rgb[fh_top:fh_bottom, fh_left:fh_right]
                gray = cv2.cvtColor(roi, cv2.COLOR_RGB2GRAY)
                clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
                gray_clahe = clahe.apply(gray)
                blurred = cv2.GaussianBlur(gray_clahe, (5, 5), 0)
                sobel_y = cv2.Sobel(blurred, cv2.CV_64F, 0, 1, ksize=3)
                abs_sobel = cv2.convertScaleAbs(sobel_y)
                _, thresh = cv2.threshold(abs_sobel, 50, 255, cv2.THRESH_BINARY)
                
                row_sums = np.sum(thresh, axis=1)
                peaks = []
                min_dist = max(3, (fh_bottom - fh_top) // 14)
                mean_val = np.mean(row_sums)
                threshold_val = mean_val * 1.5
                
                for i in range(1, len(row_sums) - 1):
                    if row_sums[i] > row_sums[i-1] and row_sums[i] > row_sums[i+1]:
                        if row_sums[i] >= threshold_val:
                            if not peaks or (i - peaks[-1]) >= min_dist:
                                peaks.append(i)
                            elif row_sums[i] > row_sums[peaks[-1]]:
                                peaks[-1] = i
                                
                planets = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"]
                total_zones = 7
                zone_height = (fh_bottom - fh_top) / total_zones if (fh_bottom - fh_top) > 0 else 1
                
                max_peak_intensity = max([row_sums[p] for p in peaks]) if peaks else 0
                
                for peak in peaks:
                    zone_index = int(peak / zone_height)
                    if zone_index >= total_zones:
                        zone_index = total_zones - 1
                        
                    abs_y = fh_top + peak
                    norm_y = (abs_y / h) * scale_y
                    
                    intensity = row_sums[peak]
                    if intensity >= max_peak_intensity * 0.8:
                        status = "Good"
                    elif intensity <= max_peak_intensity * 0.5:
                        status = "Bad"
                    else:
                        status = "Neutral"
                    
                    detected_forehead_lines.append({
                        "y": float(norm_y),
                        "planet": planets[zone_index],
                        "zone": zone_index + 1,
                        "status": status,
                        "intensity": float(intensity)
                    })
        except Exception as e:
            print(f"[FACE_ANALYZER] Error detecting forehead lines: {e}")

        extracted_landmarks["detected_lines"] = detected_forehead_lines


    # Perform selfie segmentation to remove background
    processed_base64 = None
    with mp_selfie_segmentation.SelfieSegmentation(model_selection=1) as selfie_seg:
        seg_results = selfie_seg.process(image_rgb)
        if seg_results.segmentation_mask is not None:
            # Create a white background image
            bg_image = np.ones(image_rgb.shape, dtype=np.uint8) * 255
            
            # Apply mask (mask values > 0.1 are foreground)
            mask = seg_results.segmentation_mask
            condition = np.stack((mask,) * 3, axis=-1) > 0.1
            output_image = np.where(condition, image_rgb, bg_image)
            
            # Crop image vertically to focus on face/neck
            output_image = output_image[:crop_bottom_px, :]
            
            # Convert back to BGR and encode to base64 JPEG
            output_bgr = cv2.cvtColor(output_image, cv2.COLOR_RGB2BGR)
            _, buffer = cv2.imencode('.jpg', output_bgr, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
            processed_base64 = base64.b64encode(buffer).decode('utf-8')

    print(f"[FACE_ANALYZER] Computed Ratios: {ratios}")
    return ratios, extracted_landmarks, processed_base64
