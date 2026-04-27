import urllib.request
import json
import re

# I will write the exact standard values from an ISO 4427 PE100 table if I can.
# Let's just use the original Rucika ones and append SDR 9 and 7.4 correctly.
# If SDR 11 is PN16, SDR 9 is PN20.
# Let's use the formula: e = dn / SDR. 
# According to ISO 4065, thickness e is chosen from the R10/R20 series, or calculated by e = dn / SDR, 
# then rounded to the next higher value in the table of preferred numbers.
# Actually, the standard e_min is simply exactly dn/SDR rounded to 1 decimal place?
# No, 90/17 = 5.29 -> 5.4. This is because SDR 17 is S 8. 
# The exact calculation is actually e_min = dn / (2S + 1). S = 8.
# Wait, for S=8, 2S+1 = 17. 90/17 = 5.294. So how is it 5.4?
