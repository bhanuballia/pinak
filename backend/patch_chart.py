import re

path = r'frontend\src\components\ZodiacChart.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update component signature
old_sig = 'const ZodiacChart = ({ houses, transitHouses = null, onPlanetClick, title, variant = "modern", planetEffects = {}, scaleText = 1, planetPositions = [], defaultRect = false, hideLegend = false, hideOuterRect, defaultLang = "en", showFullscreenButton = false, onPopOut, bgColor, stackLayout = false }) => {'

new_sig = 'const ZodiacChart = ({ houses, transitHouses = null, onPlanetClick, title, variant = "modern", planetEffects = {}, scaleText = 1, planetPositions = [], defaultRect = false, hideLegend = false, hideOuterRect, defaultLang = "en", showFullscreenButton = false, onPopOut, bgColor, stackLayout = false, showNakshatra = false }) => {'
content = content.replace(old_sig, new_sig)

# 2. Update ZodiacRectSign call
old_call = 'return <ZodiacRectSign houses={houses} transitHouses={transitHouses} onPlanetClick={onPlanetClick} title={title} variant={variant} planetEffects={planetEffects} planetPositions={planetPositions} isRect={isRect} setIsRect={setIsRect} scaleText={scaleText} hideLegend={hideLegend} hideOuterRect={finalHideOuterRect} defaultLang={lang} showFullscreenButton={showFullscreenButton} onPopOut={onPopOut} />;'

new_call = 'return <ZodiacRectSign houses={houses} transitHouses={transitHouses} onPlanetClick={onPlanetClick} title={title} variant={variant} planetEffects={planetEffects} planetPositions={planetPositions} isRect={isRect} setIsRect={setIsRect} scaleText={scaleText} hideLegend={hideLegend} hideOuterRect={finalHideOuterRect} defaultLang={lang} showFullscreenButton={showFullscreenButton} onPopOut={onPopOut} showNakshatra={showNakshatra} />;'
content = content.replace(old_call, new_call)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("ZodiacChart patched successfully.")
