# 02 - Voice Control for Robotics with OpenAI Whisper

Voice control offers a natural and intuitive way for humans to interact with robots, moving beyond traditional joystick controls or pre-programmed sequences. In this section, we'll explore how to integrate OpenAI Whisper, a powerful open-source speech-to-text model, to enable voice-to-action commands for your robot.

## Understanding OpenAI Whisper

OpenAI Whisper is a general-purpose speech recognition model trained on a large dataset of diverse audio and text. It can transcribe audio into text in multiple languages and also translate those languages into English. Its robustness to accents, background noise, and technical jargon makes it an excellent candidate for robotic applications.

**Key Features of Whisper:**

*   **Multilingual Speech Recognition**: Transcribes speech in many languages.
*   **Language Identification**: Automatically detects the spoken language.
*   **Robustness**: Performs well even in challenging audio conditions.
*   **Speaker Diarization (via community extensions)**: Can identify different speakers in an audio segment (not directly in the base model).

## Architecture for Voice-to-Action

The general architecture for implementing voice-to-action commands involves several steps:

1.  **Audio Capture**: Recording speech from a microphone.
2.  **Speech-to-Text (Whisper)**: Converting the captured audio into a text transcript.
3.  **Command Interpretation (LLM/NLU)**: Processing the text transcript to understand the user's intent and extract relevant parameters.
4.  **Action Mapping**: Translating the interpreted command into specific robot actions.
5.  **Robot Execution**: Sending commands to the robot's control system.

```mermaid
graph TD
    A[User Speaks Command] --> B(Microphone Capture);
    B --> C{OpenAI Whisper API/Model};
    C --> D[Text Transcript];
    D --> E{Command Interpretation (LLM/NLU)};
    E --> F[Robot Action / Parameters];
    F --> G(Robot Control System);
    G --> H[Robot Executes Action];
```

## Step-by-Step Guide: Integrating Whisper

Let's outline a conceptual guide for setting up a basic voice control system using OpenAI Whisper and a simplified command interpreter.

### Prerequisites

*   Python 3.8+
*   `pip` package manager
*   A microphone
*   (Optional) OpenAI API key if using the hosted Whisper API, or sufficient computational resources for local models.

### 1. Install Whisper (Local Model) or OpenAI API Client

If running Whisper locally (recommended for robotics to minimize latency and ensure privacy), you can install the `whisper` Python package:

```bash
pip install -U openai-whisper
```

Alternatively, if using the OpenAI API for transcription:

```bash
pip install openai
```

### 2. Audio Capture

You'll need a library to capture audio from your microphone. `PyAudio` is a common choice.

```bash
pip install PyAudio
```

**Example Python snippet for audio capture:**

```python
import pyaudio
import wave

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
RECORD_SECONDS = 5
WAVE_OUTPUT_FILENAME = "output.wav"

p = pyaudio.PyAudio()

stream = p.open(format=FORMAT,
                channels=CHANNELS,
                rate=RATE,
                input=True,
                frames_per_buffer=CHUNK)

print("\n* Recording...")

frames = []

for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
    data = stream.read(CHUNK)
    frames.append(data)

print("* Done recording\n")

stream.stop_stream()
stream.close()
p.terminate()

wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
wf.setnchannels(CHANNELS)
wf.setsampwidth(p.get_sample_size(FORMAT))
wf.setframerate(RATE)
wf.writeframes(b''.join(frames))
wf.close()
```

### 3. Transcribe Audio with Whisper

**Using local Whisper model:**

```python
import whisper

model = whisper.load_model("base") # or "small", "medium", "large"
result = model.transcribe("output.wav")
print(f"Transcript: {result['text']}")
```

**Using OpenAI API:**

```python
from openai import OpenAI
import os

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

audio_file= open("output.wav", "rb")
transcription = client.audio.transcriptions.create(
  model="whisper-1",
  file=audio_file
)
print(f"Transcript: {transcription.text}")
```

### 4. Command Interpretation (Simplified Example)

For simple commands, you can use basic string matching or regular expressions. For more complex scenarios, a small Language Model (LLM) or a Natural Language Understanding (NLU) service would be beneficial.

```python
def interpret_command(transcript):
    transcript = transcript.lower()
    if "move forward" in transcript or "go forward" in transcript:
        return {"action": "move", "direction": "forward"}
    elif "turn left" in transcript:
        return {"action": "turn", "direction": "left"}
    elif "stop" in transcript:
        return {"action": "stop"}
    else:
        return {"action": "unknown"}

command = interpret_command(transcription.text)
print(f"Interpreted Command: {command}")
```

### 5. Robot Action Mapping and Execution

This step depends heavily on your robot's specific control interface (e.g., ROS 2 topics, direct motor commands, etc.).

**Example (conceptual ROS 2 integration):**

```python
import rclpy
from geometry_msgs.msg import Twist

def execute_robot_action(command):
    if command["action"] == "move" and command["direction"] == "forward":
        print("Sending move forward command to robot...")
        # Example: Publish to /cmd_vel topic
        # twist_msg = Twist()
        # twist_msg.linear.x = 0.5
        # publisher.publish(twist_msg)
    elif command["action"] == "turn" and command["direction"] == "left":
        print("Sending turn left command to robot...")
        # Example: Publish to /cmd_vel topic
        # twist_msg = Twist()
        # twist_msg.angular.z = 0.5
        # publisher.publish(twist_msg)
    elif command["action"] == "stop":
        print("Sending stop command to robot...")
        # Example: Publish zero Twist

# Assuming rclpy.init() and node creation somewhere else
# publisher = node.create_publisher(Twist, 'cmd_vel', 10)

# execute_robot_action(command)
```

## Conclusion

By combining OpenAI Whisper for accurate speech-to-text with a robust command interpretation layer, you can create powerful and natural voice control interfaces for your robotic applications. This approach significantly enhances human-robot interaction, making robots more accessible and easier to operate in diverse environments.
