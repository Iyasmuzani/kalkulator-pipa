import PyPDF2
import sys

def test_passwords(filepath, passwords):
    try:
        reader = PyPDF2.PdfReader(filepath)
        if not reader.is_encrypted:
            print("Not encrypted")
            return
        
        for pwd in passwords:
            try:
                # decrypt returns 0 for failure, 1 for user pwd, 2 for owner pwd
                res = reader.decrypt(pwd)
                if res:
                    print(f"FOUND PASSWORD: {pwd}")
                    return
            except Exception as e:
                pass
        print("Password not found in list")
    except Exception as e:
        print(f"Error: {e}")

common_pwds = [
    "kalkulator-pipa", "kalkulatorpipa", "iyasmuzani", "kalkulator", "pipa", "123456", 
    "password", "sni", "standar", "admin", "kalkulator-pipa.com", "iyas",
    "kalkulator_pipa", "KalkulatorPipa", "kalkulator-pipa-2023", "kalkulator-pipa-2024",
    "kalkulator-pipa-2025", "kalkulator-pipa-2026", "2024", "2025", "2026",
    "sni_75112011", "sni_75112011.pdf", "sni7511"
]

test_passwords("standards/sistem/sni_75112011.pdf", common_pwds)
