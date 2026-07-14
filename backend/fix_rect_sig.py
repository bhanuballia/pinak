import re

path = r'frontend\src\components\ZodiacRectSign.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_sig = "const ZodiacRectSign = ({ houses, onPlanetClick, title, variant = \"modern\", planetEffects = {}, aspectRatio = 2.5, planetPositions = [], isRect, setIsRect, scaleText = 1, hideLegend = false, hideOuterRect, defaultLang = 'en', showFullscreenButton = false, onPopOut }) => {"

new_sig = "const ZodiacRectSign = ({ houses, onPlanetClick, title, variant = \"modern\", planetEffects = {}, aspectRatio = 2.5, planetPositions = [], isRect, setIsRect, scaleText = 1, hideLegend = false, hideOuterRect, defaultLang = 'en', showFullscreenButton = false, onPopOut, showNakshatra = false, showDegree = false }) => {"

content = content.replace(old_sig, new_sig)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed ZodiacRectSign.jsx")
