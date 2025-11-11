import time
import requests

# Define your URLs
urls = [
    "http://192.168.0.30/on/1",
    "http://192.168.0.30/off/1"
]

# Number of cycles (each = 1 hour, alternating on/off)
how_many_cycles_are_being_ran = 4 #Set number of activation cycles here
cycles = int(how_many_cycles_are_being_ran * 2)  # on and off


for i in range(cycles):
    url = urls[i % 2]  # alternate between on/off

    print(f"Cycle {i + 1}/{cycles}: Sending request to {url}")

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            print(f"✅ Success: {url}")
            if "on" in url:
                print("FCO OPEN")
            elif "off" in url:
                print("FCO DOWN")
        else:
            print(f"⚠️ Failed ({response.status_code}): {url}")
    except Exception as e:
        print(f"❌ Error sending to {url}: {e}")

    if i < cycles - 1:
        print("⏳ Waiting 1 hour before next request...")
        time.sleep(3600)  # wait 1 hour (3600 seconds)

print("✅ Done — all cycles complete.")