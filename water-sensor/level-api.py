import time
import RPi.GPIO as GPIO
from flask import Flask, jsonify
from flask_cors import CORS
import statistics


# GPIO setup
TRIG = 23
ECHO = 24
GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

# Tank height in cm
TANK_HEIGHT = 300.0


def get_distance():
    GPIO.output(TRIG, False)
    time.sleep(0.05)
    GPIO.output(TRIG, True)
    time.sleep(0.00001)
    GPIO.output(TRIG, False)
    pulse_start = pulse_end = time.time()
    while GPIO.input(ECHO) == 0:
        pulse_start = time.time()
    while GPIO.input(ECHO) == 1:
        pulse_end = time.time()
    duration = pulse_end - pulse_start
    # speed of sound ~34300 cm/s
    distance = (duration * 34300) / 2
    return min(max(distance, 2), TANK_HEIGHT + 20)


app = Flask(__name__)
CORS(app)


@app.route("/api/level")
def level():
    d_array = []
    for i in range(10):
        d = get_distance()
        print(d)
        d_array.append(d)
        time.sleep(0.2)
        # Remove outliers: keep only values within 1 standard deviation of the mean
    mean = statistics.mean(d_array)
    stdev = statistics.stdev(d_array)
    d_array = [x for x in d_array if abs(x - mean) <= stdev]
    d = sum(d_array) / len(d_array)
    print(f"Filtered distance: {d}")
    fill_cm = TANK_HEIGHT - d + 20
    pct = round((fill_cm / TANK_HEIGHT) * 100, 1)
    return jsonify(
        {"distance_cm": round(d, 1), "fill_cm": round(fill_cm, 1), "percent": pct}
    )


if __name__ == "__main__":
    try:
        app.run(host="0.0.0.0", port=5000)
    finally:
        GPIO.cleanup()
