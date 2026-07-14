# nakshatra_advanced/alerts/notification_engine.py

def send_alert_notification(alert_data: dict):
    """
    Stub to dispatch notifications for high-priority transit alerts.
    """
    return {
        "status": "dispatched",
        "delivered": alert_data.get("severity") == "HIGH"
    }
