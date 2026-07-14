# jaimini_pro/activation/event_trigger_engine.py
class EventTriggerEngine:
    def detect_event(self, factors):
        if factors >= 3: return "Major Life Event"
        return "Minor Activation"
