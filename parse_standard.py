import urllib.request

html = urllib.request.urlopen("https://www.pipa.com.au/wp-content/uploads/2019/04/TN01-Dimensions-of-PE-Pipes.pdf").read()
# Actually, I can't easily parse pdf. Let's just use my generated table but adjust slightly if needed, or use the exact ISO 4427 values if I can find them.
