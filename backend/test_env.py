import os
from dotenv import load_dotenv
load_dotenv()
print('KEY EXISTS:', bool(os.getenv('GEMINI_API_KEY')))

try:
    import google.generativeai as genai
    print('GENAI IMPORT: SUCCESS')
except Exception as e:
    print('GENAI IMPORT ERROR:', e)
