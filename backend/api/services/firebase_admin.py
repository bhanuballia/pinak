import firebase_admin
from firebase_admin import credentials, messaging
import os

# Initialize Firebase Admin SDK
def initialize_firebase_admin():
    try:
        # Check if already initialized
        firebase_admin.get_app()
    except ValueError:
        # Not initialized, try to find the service account key
        key_path = os.path.join(os.path.dirname(__file__), "..", "firebase-adminsdk.json")
        if os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
            print("[FIREBASE] Admin SDK initialized successfully.")
        else:
            print(f"[FIREBASE] Warning: Service account key not found at {key_path}. Push notifications will not work.")

def send_push_notification(token: str, title: str, body: str, data: dict = None):
    """
    Send a push notification to a specific device token.
    """
    try:
        # Check if Firebase is initialized
        firebase_admin.get_app()
        
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data or {},
            token=token,
        )

        response = messaging.send(message)
        print(f"[FIREBASE] Successfully sent message: {response}")
        return True, response
    except Exception as e:
        print(f"[FIREBASE ERROR] Error sending message: {e}")
        return False, str(e)
