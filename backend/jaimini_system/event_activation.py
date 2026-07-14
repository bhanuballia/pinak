# jaimini_system/event_activation.py

class EventActivation:
    def activate(self, dasha_sign, transit_sign):
        return dasha_sign == transit_sign
