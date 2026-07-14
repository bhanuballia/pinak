import urllib.request
import os

def download_font(url, filename):
    print(f"Downloading {url} to {filename}...")
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            data = response.read()
            if len(data) == 0:
                print(f"Warning: Downloaded 0 bytes for {filename}")
                return False
            with open(filename, 'wb') as f:
                f.write(data)
            print(f"Success! Downloaded {len(data)} bytes.")
            return True
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
        return False

if __name__ == "__main__":
    font_dir = r"D:\vedic-astrology-app\reports\fonts"
    os.makedirs(font_dir, exist_ok=True)
    
    sans_url = "https://raw.githubusercontent.com/notofonts/noto-fonts/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf"
    # Serif might be in a different path or family
    serif_url = "https://raw.githubusercontent.com/notofonts/noto-fonts/main/hinted/ttf/NotoSerifDevanagari/NotoSerifDevanagari-Regular.ttf"
    
    download_font(sans_url, os.path.join(font_dir, "NotoSansDevanagari-Regular.ttf"))
    download_font(serif_url, os.path.join(font_dir, "NotoSerifDevanagari-Regular.ttf"))
