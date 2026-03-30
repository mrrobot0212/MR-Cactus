import speech_recognition as sr
import pyttsx3
import webbrowser
import os
from flask import Flask, render_template, request

# ===============================
# Text to Speech (বাংলা)
# ===============================
engine = pyttsx3.init()
engine.setProperty('rate', 150)  # কথা বলার স্পীড

def speak(text):
    engine.say(text)
    engine.runAndWait()

# ===============================
# Voice Recognition
# ===============================
def listen():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("শোনার চেষ্টা করছি...")
        audio = r.listen(source)
        try:
            command = r.recognize_google(audio)
            print(f"আপনি বললেন: {command}")
            return command.lower()
        except:
            speak("দুঃখিত, আমি বুঝতে পারিনি।")
            return ""

# ===============================
# Flask Web Interface
# ===============================
app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        command = request.form["command"].lower()
        result = execute_command(command)
        return render_template("index.html", result=result)
    return render_template("index.html", result="")

# ===============================
# Command Execution
# ===============================
def execute_command(command):
    if "ইউটিউব খোল" in command or "youtube" in command:
        speak("ইউটিউব খোলা হচ্ছে")
        webbrowser.open("https://youtube.com")
        return "YouTube খুললাম।"
    elif "ক্রোম খোল" in command or "chrome" in command:
        speak("ক্রোম খোলা হচ্ছে")
        os.system("start chrome")
        return "Chrome খুললাম।"
    elif "/say bangla" in command:
        speak("আপনি কি করতে চান?")
        return "বাংলায় কথা বলছি।"
    elif "exit" in command or "বন্ধ কর" in command:
        speak("বিদায়!")
        return "Assistant বন্ধ।"
    else:
        speak("আমি সেই কমান্ড বুঝতে পারিনি।")
        return "কমান্ড বুঝতে পারিনি।"

# ===============================
# Run Flask
# ===============================
if __name__ == "__main__":
    speak("আমি প্রস্তুত, আপনি কথা বলুন।")
    app.run(debug=True)