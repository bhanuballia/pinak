# nakshatra_advanced/gpu/cuda_engine.py

try:
    import cupy as cp

    GPU_ENABLED = True

except Exception:

    GPU_ENABLED = False


class GPUAstroEngine:

    def process(
        self,
        values
    ):

        if not GPU_ENABLED:

            return values

        arr = cp.array(values)

        return cp.sqrt(arr)
