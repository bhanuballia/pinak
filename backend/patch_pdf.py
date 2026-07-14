import sys

def patch():
    path = r'd:\vedic-astrology-app - 2 - okFinal - Deploy\backend\reports\pdf_generator.py'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Charts
    content = content.replace(
        '        v_key = f"d{d}"\n        png_path = chart_images.get(f"{v_key}_png")',
        '        v_key = f"d{d}"\n        if v_key != "d1" and not should_render(v_key):\n            continue\n        png_path = chart_images.get(f"{v_key}_png")'
    )
    
    # 2. Ashtakavarga
    content = content.replace(
        '    # Ashtakavarga Chart & Table\n    if chart_images.get("ashtakavarga_png"):',
        '    # Ashtakavarga Chart & Table\n    if chart_images.get("ashtakavarga_png") and should_render("ashtakavarga"):'
    )
    
    # 3. Destiny Timeline
    content = content.replace(
        '    if report_data.get("destiny_timeline"):\n        timeline_title',
        '    if report_data.get("destiny_timeline") and should_render("destiny_timeline"):\n        timeline_title'
    )
    
    # 4. Destiny Grid / Map
    content = content.replace(
        '    destiny_grid = report_data.get("destiny_grid", [])\n    if destiny_grid:',
        '    destiny_grid = report_data.get("destiny_grid", [])\n    if destiny_grid and should_render("cosmic_life_map"):'
    )

    # 5. Dosha
    content = content.replace(
        '    dosha_details = report_data.get("dosha_details", [])\n    if dosha_details:\n        dosha_title',
        '    dosha_details = report_data.get("dosha_details", [])\n    if dosha_details and should_render("dosha"):\n        dosha_title'
    )
    
    # 6. Remedies
    content = content.replace(
        '    remedies = report_data.get("remedies", [])\n    if remedies:\n        rem_title',
        '    remedies = report_data.get("remedies", [])\n    if remedies and should_render("remedies"):\n        rem_title'
    )

    # 7. Dasha
    content = content.replace(
        '    # Dashas\n    dasha = report_data.get("dasha", {})\n    if dasha:\n        dasha_title',
        '    # Dashas\n    dasha = report_data.get("dasha", {})\n    if dasha and should_render("dasha"):\n        dasha_title'
    )

    # 8. Life Events Narrative
    content = content.replace(
        '    life_events = report_data.get("life_events", {})\n    if life_events:\n        events_title',
        '    life_events = report_data.get("life_events", {})\n    if life_events and should_render("life_events_narrative"):\n        events_title'
    )

    # 9. Favourable Insights
    content = content.replace(
        '            theme_palette=theme_palette,\n        ),\n        Spacer(1, 8)\n    ])',
        '            theme_palette=theme_palette,\n        ),\n        Spacer(1, 8)\n    ], sec_key="auspicious_factors")'
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Patched pdf_generator.py")

patch()
