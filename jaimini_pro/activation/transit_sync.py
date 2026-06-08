# jaimini_pro/activation/transit_sync.py
class TransitSynchronization:
    def synchronize(self, dasha, transit):
        return { "active": dasha == transit }
