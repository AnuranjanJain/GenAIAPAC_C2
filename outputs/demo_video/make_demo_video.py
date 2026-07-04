import math
import re
import subprocess
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parent
SCREENS = ROOT / "screens"
WORK = ROOT / "work"
WORK.mkdir(parents=True, exist_ok=True)

WIDTH = 1920
HEIGHT = 1080
FPS = 24
VOICE = "en-US-JennyNeural"
RATE = "+8%"

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
PYTHON = "python"


SEGMENTS = [
    {
        "screen": "01_dashboard.png",
        "title": "CivicMind AI",
        "subtitle": "A smart community decision platform for faster, clearer city operations.",
        "narration": "Meet CivicMind AI, a smart community decision intelligence platform for city teams, ward officers, and civic responders.",
    },
    {
        "screen": "01_dashboard.png",
        "title": "The Problem",
        "subtitle": "Cities have data, but decisions are slowed by scattered systems and delayed interpretation.",
        "narration": "The problem is not that communities lack data. Complaints, traffic updates, waste logs, utility events, and environment signals already exist, but they are scattered across systems.",
    },
    {
        "screen": "01_dashboard.png",
        "title": "The Solution",
        "subtitle": "One clean cockpit turns civic signals into explainable, human-approved action.",
        "narration": "CivicMind AI brings those signals into one clean cockpit, so leaders can see the most urgent priority, understand why it matters, and approve action faster.",
    },
    {
        "screen": "01_dashboard.png",
        "title": "First Screen",
        "subtitle": "The dashboard focuses attention on the highest-risk ward instead of overwhelming the viewer.",
        "narration": "The dashboard is intentionally simple. It highlights one live civic priority, Ward eleven, with a risk score, clear reasoning, and compact operational metrics.",
    },
    {
        "screen": "02_risk_map.png",
        "title": "Risk Map",
        "subtitle": "Ward-level risk scores reveal where response teams should look first.",
        "narration": "The Risk Map shows ward-level risk, so teams can compare areas quickly and inspect why one location needs faster response than another.",
    },
    {
        "screen": "03_actions.png",
        "title": "Recommendations",
        "subtitle": "Actions are ranked by urgency, owner, expected impact, and supporting evidence.",
        "narration": "The Actions view converts analysis into a practical queue, including the owner, severity, estimated response time, expected impact, and the evidence behind each recommendation.",
    },
    {
        "screen": "04_reports.png",
        "title": "Daily Brief",
        "subtitle": "The report view creates a shareable civic brief with sources and next steps.",
        "narration": "The Reports view turns agent analysis into a shareable daily brief, useful for hackathon judging, department meetings, or escalation notes.",
    },
    {
        "screen": "05_faq.png",
        "title": "How To Use It",
        "subtitle": "Dashboard, Risk Map, Actions, Reports, and FAQ guide the complete demo flow.",
        "narration": "To use the prototype, start on Dashboard, open Risk Map for ward evidence, review Actions for interventions, open Reports for the generated brief, and use FAQ to understand the demo.",
    },
    {
        "screen": "05_faq.png",
        "title": "Demo Data",
        "subtitle": "30 seeded records across complaints, traffic, waste, utilities, environment, actions, and documents.",
        "narration": "The local demo includes thirty seeded records across seven civic tables, including complaints, traffic events, waste collection, utilities, environment readings, actions, and policy documents.",
    },
    {
        "screen": "01_dashboard.png",
        "title": "Decision Assistant",
        "subtitle": "The right panel answers questions in plain English with confidence, evidence, and citations.",
        "narration": "The right-side decision assistant answers plain-English questions, summarizes evidence, shows confidence, and keeps recommendations grounded in data and policy snippets.",
    },
    {
        "screen": "01_dashboard.png",
        "title": "Google Cloud Stack",
        "subtitle": "Cloud Run, BigQuery, Gemini, ADK, Vector Search, Looker, Cloud Storage, IAM, and Logging.",
        "narration": "The cloud-ready architecture maps to Google Cloud services: Cloud Run for the app, BigQuery for analytics, Gemini and ADK for agents, Vector Search for retrieval, Looker for dashboards, and IAM plus logging for governance.",
    },
    {
        "screen": "05_faq.png",
        "title": "Responsible AI",
        "subtitle": "The system recommends and explains, but humans approve civic decisions.",
        "narration": "Responsible AI is built into the concept. CivicMind AI recommends and explains, but final civic action remains human approved, auditable, and grounded in visible evidence.",
    },
    {
        "screen": "01_dashboard.png",
        "title": "Impact",
        "subtitle": "Faster insight, better resource allocation, and clearer community response.",
        "narration": "The impact is faster time to insight, better resource allocation, clearer coordination, and improved quality of life for communities.",
    },
    {
        "screen": "01_dashboard.png",
        "title": "Final Pitch",
        "subtitle": "CivicMind AI turns scattered civic data into actionable community intelligence.",
        "narration": "CivicMind AI turns scattered civic data into actionable community intelligence, helping teams ask better questions, spot problems earlier, and act with confidence.",
    },
]


def font(name: str, size: int):
    fonts = Path("C:/Windows/Fonts")
    candidates = {
        "bold": ["segoeuib.ttf", "arialbd.ttf"],
        "semi": ["seguisb.ttf", "segoeuib.ttf", "arialbd.ttf"],
        "regular": ["segoeui.ttf", "arial.ttf"],
    }[name]
    for candidate in candidates:
        path = fonts / candidate
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


FONT_TITLE = font("bold", 76)
FONT_SUBTITLE = font("semi", 39)
FONT_SMALL = font("semi", 28)
FONT_CHAPTER = font("bold", 31)


def run(cmd):
    subprocess.run(cmd, check=True)


def ffmpeg_duration(path: Path) -> float:
    proc = subprocess.run(
        [FFMPEG, "-i", str(path)],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    match = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", proc.stderr)
    if not match:
        raise RuntimeError(f"Could not read duration for {path}")
    hours, minutes, seconds = match.groups()
    return int(hours) * 3600 + int(minutes) * 60 + float(seconds)


def generate_audio():
    concat_file = WORK / "audio_concat.txt"
    subtitle_file = ROOT / "CivicMind_AI_Demo_Subtitles.srt"
    entries = []
    start = 0.0

    with concat_file.open("w", encoding="utf-8") as concat, subtitle_file.open("w", encoding="utf-8") as srt:
      for index, segment in enumerate(SEGMENTS, start=1):
          audio = WORK / f"segment_{index:02d}.mp3"
          if not audio.exists():
              run([
                  PYTHON,
                  "-m",
                  "edge_tts",
                  "--voice",
                  VOICE,
                  "--rate",
                  RATE,
                  "--text",
                  segment["narration"],
                  "--write-media",
                  str(audio),
              ])
          duration = ffmpeg_duration(audio)
          entries.append({**segment, "audio": audio, "duration": duration})
          concat.write(f"file '{audio.as_posix()}'\n")

          end = start + duration
          srt.write(f"{index}\n")
          srt.write(f"{srt_time(start)} --> {srt_time(end)}\n")
          srt.write(segment["subtitle"] + "\n\n")
          start = end

    narration = ROOT / "CivicMind_AI_Demo_Narration.mp3"
    run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(concat_file), "-c", "copy", str(narration)])
    return entries, narration, subtitle_file


def srt_time(seconds: float) -> str:
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int(round((seconds - math.floor(seconds)) * 1000))
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font_obj, max_width: int):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        test = f"{current} {word}".strip()
        if draw.textbbox((0, 0), test, font=font_obj)[2] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def rounded_box(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def render_frame(base: Image.Image, segment, local_t: float, duration: float, index: int):
    progress = 0 if duration <= 0 else min(1, max(0, local_t / duration))
    ease = 0.5 - 0.5 * math.cos(progress * math.pi)
    scale = 1.0 + 0.045 * ease
    crop_w = int(WIDTH / scale)
    crop_h = int(HEIGHT / scale)
    pan_x = int((WIDTH - crop_w) * (0.18 + 0.12 * math.sin(index)))
    pan_y = int((HEIGHT - crop_h) * (0.18 + 0.16 * math.cos(index)))
    crop = base.crop((pan_x, pan_y, pan_x + crop_w, pan_y + crop_h)).resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    crop = ImageEnhance.Brightness(crop).enhance(0.78)
    crop = ImageEnhance.Contrast(crop).enhance(1.05)

    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (4, 8, 14, 70))
    frame = Image.alpha_composite(crop.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(frame)

    enter = min(1, local_t / 0.8)
    y_shift = int((1 - enter) * 22)
    left = 86
    top = 72 + y_shift

    rounded_box(draw, (left, top, left + 330, top + 56), 28, (12, 20, 32, 218), (96, 165, 250, 150), 2)
    draw.text((left + 24, top + 12), f"SECTION {index:02d}", font=FONT_CHAPTER, fill=(96, 165, 250, 255))

    title_lines = wrap_text(draw, segment["title"], FONT_TITLE, 880)
    title_y = top + 84
    for line in title_lines:
        draw.text((left, title_y), line, font=FONT_TITLE, fill=(246, 249, 255, 255))
        title_y += 82

    accent_x = left
    accent_y = title_y + 10
    draw.rounded_rectangle((accent_x, accent_y, accent_x + int(520 * ease), accent_y + 6), radius=4, fill=(56, 189, 248, 240))

    subtitle = segment["subtitle"]
    lines = wrap_text(draw, subtitle, FONT_SUBTITLE, 1320)[:2]
    box_h = 112 if len(lines) == 1 else 154
    box_left = 190
    box_top = HEIGHT - box_h - 58
    rounded_box(draw, (box_left, box_top, WIDTH - box_left, HEIGHT - 54), 30, (8, 13, 22, 226), (38, 54, 77, 220), 2)
    sy = box_top + 25
    for line in lines:
        text_w = draw.textbbox((0, 0), line, font=FONT_SUBTITLE)[2]
        draw.text(((WIDTH - text_w) / 2, sy), line, font=FONT_SUBTITLE, fill=(238, 242, 248, 255))
        sy += 48

    return frame.convert("RGB")


def render_video(entries, narration):
    output = ROOT / "CivicMind_AI_3min_Demo_Video.mp4"
    cmd = [
        FFMPEG,
        "-y",
        "-f",
        "rawvideo",
        "-vcodec",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{WIDTH}x{HEIGHT}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-i",
        str(narration),
        "-map",
        "0:v",
        "-map",
        "1:a",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "18",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-shortest",
        str(output),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    try:
        for idx, segment in enumerate(entries, start=1):
            base = Image.open(SCREENS / segment["screen"]).convert("RGB").resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
            frames = max(1, int(round(segment["duration"] * FPS)))
            for frame_index in range(frames):
                image = render_frame(base, segment, frame_index / FPS, segment["duration"], idx)
                proc.stdin.write(np.asarray(image, dtype=np.uint8).tobytes())
    finally:
        proc.stdin.close()
        proc.wait()
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg failed with code {proc.returncode}")
    return output


def main():
    entries, narration, subtitles = generate_audio()
    total_duration = sum(item["duration"] for item in entries)
    if total_duration > 180:
        raise RuntimeError(f"Video would exceed 3 minutes: {total_duration:.1f}s")
    output = render_video(entries, narration)
    print(f"video={output}")
    print(f"narration={narration}")
    print(f"subtitles={subtitles}")
    print(f"duration={total_duration:.2f}")


if __name__ == "__main__":
    main()
