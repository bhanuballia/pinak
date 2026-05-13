# tests/test_renderer.py
from charts.renderers.rasi_chart_renderer import render_rasi_svg
def test_render_rasi_creates_file(tmp_path):
    chart = {"houses": {i: {"sign_name": f"Sign{i}", "planets": []} for i in range(1,13)}}
    out = tmp_path / "test_rasi.svg"
    path = render_rasi_svg(chart, str(out), size=500)
    assert out.exists()
