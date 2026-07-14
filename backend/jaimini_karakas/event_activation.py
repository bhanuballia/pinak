# jaimini_karakas/event_activation.py

class EventActivation:

    def activate(

        self,
        transit,
        karaka

    ):

        return {

            "event_active":
                transit == karaka

        }
