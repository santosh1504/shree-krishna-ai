#!/usr/bin/env python3
import json
import os
import re

RAW_DIR = "data/bhagavad-gita-raw"
OUTPUT_DIR = "src/data"
SERVER_DATA_DIR = "server/data"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(SERVER_DATA_DIR, exist_ok=True)
os.makedirs("public/data", exist_ok=True)

with open(os.path.join(RAW_DIR, "chapters.json"), encoding="utf-8-sig") as f:
    raw_chapters = json.load(f)

with open(os.path.join(RAW_DIR, "verse.json"), encoding="utf-8-sig") as f:
    raw_verses = json.load(f)

with open(os.path.join(RAW_DIR, "translation.json"), encoding="utf-8-sig") as f:
    raw_translations = json.load(f)

print(f"Loaded {len(raw_chapters)} chapters, {len(raw_verses)} verses, {len(raw_translations)} translations.")

def clean_text(s):
    if not s:
        return ""
    s = re.sub(r'\r\n', '\n', s)
    s = re.sub(r'\n{3,}', '\n\n', s)
    return s.strip()

translations_by_verse_id = {}
for t in raw_translations:
    vid = t.get("verse_id")
    if vid not in translations_by_verse_id:
        translations_by_verse_id[vid] = []
    translations_by_verse_id[vid].append({
        "author": t.get("authorName", "").strip(),
        "lang": t.get("lang", "").strip().lower(),
        "text": clean_text(t.get("description", ""))
    })

THEME_KEYWORDS = {
    "action_and_duty": ["karma", "duty", "action", "work", "prescribed", "deeds", "righteous", "fruit", "result"],
    "mind_and_meditation": ["mind", "meditation", "restless", "control", "focus", "dhyana", "thought", "calm", "steady"],
    "fear_and_mortality": ["death", "grief", "sorrow", "soul", "eternal", "fear", "dying", "imperishable", "lament"],
    "anger_and_desire": ["anger", "desire", "passion", "lust", "wrath", "krodha", "kama", "delusion", "senses"],
    "relationships_and_compassion": ["all beings", "friend", "compassion", "equal", "enemy", "love", "hatred", "kindness"],
    "dilemma_and_dharma": ["dharma", "righteousness", "confused", "dilemma", "right", "wrong", "surrender", "path"],
    "peace_and_equanimity": ["peace", "equanimity", "balance", "serenity", "shanti", "contentment", "equipoise"],
    "devotion_and_surrender": ["devotion", "bhakti", "surrender", "refuge", "faith", "worship", "divine", "krishna"]
}

processed_chapters = []
for ch in raw_chapters:
    processed_chapters.append({
        "chapter_number": ch.get("chapter_number"),
        "name_sanskrit": ch.get("name", "").strip(),
        "name_meaning": ch.get("name_meaning", "").strip(),
        "name_translation": ch.get("name_translation", "").strip(),
        "name_transliterated": ch.get("name_transliterated", "").strip(),
        "verses_count": ch.get("verses_count", 0),
        "summary": clean_text(ch.get("chapter_summary", "")),
        "summary_hindi": clean_text(ch.get("chapter_summary_hindi", ""))
    })

processed_verses = []
verse_lookup = {}

for v in raw_verses:
    vid = v.get("id") or v.get("verse_id")
    ch_num = v.get("chapter_number") or v.get("chapter_id")
    v_num = v.get("verse_number")
    
    slok = clean_text(v.get("text", ""))
    transliteration = clean_text(v.get("transliteration", ""))
    word_meanings = clean_text(v.get("word_meanings", ""))
    
    v_translations = translations_by_verse_id.get(vid, [])
    
    en_trans = [t for t in v_translations if t["lang"] == "english"]
    hi_trans = [t for t in v_translations if t["lang"] == "hindi"]
    
    primary_en = ""
    primary_author = ""
    for preferred_author in ["Swami Sivananda", "Swami Gambirananda", "Swami Adidevananda", "Shri Purohit Swami", "Dr. S. Sankaranarayan"]:
        match = next((t for t in en_trans if preferred_author.lower() in t["author"].lower()), None)
        if match and match["text"]:
            primary_en = match["text"]
            primary_author = match["author"]
            break
    if not primary_en and en_trans:
        primary_en = en_trans[0]["text"]
        primary_author = en_trans[0]["author"]

    primary_hi = ""
    primary_hi_author = ""
    for preferred_hi in ["Swami Ramsukhdas", "Swami Tejomayananda"]:
        match = next((t for t in hi_trans if preferred_hi.lower() in t["author"].lower()), None)
        if match and match["text"]:
            primary_hi = match["text"]
            primary_hi_author = match["author"]
            break
    if not primary_hi and hi_trans:
        primary_hi = hi_trans[0]["text"]
        primary_hi_author = hi_trans[0]["author"]

    full_text_search = (slok + " " + transliteration + " " + primary_en + " " + word_meanings).lower()
    matched_themes = []
    for theme, kw_list in THEME_KEYWORDS.items():
        if any(kw in full_text_search for kw in kw_list):
            matched_themes.append(theme)

    verse_obj = {
        "id": vid,
        "chapter": ch_num,
        "verse": v_num,
        "citation": f"Chapter {ch_num}, Verse {v_num}",
        "reference": f"{ch_num}.{v_num}",
        "slok": slok,
        "transliteration": transliteration,
        "word_meanings": word_meanings,
        "translation_english": primary_en,
        "translator_english": primary_author or "Swami Sivananda",
        "translation_hindi": primary_hi,
        "translator_hindi": primary_hi_author or "Swami Ramsukhdas",
        "all_translations": v_translations,
        "themes": matched_themes
    }
    
    processed_verses.append(verse_obj)
    verse_lookup[f"{ch_num}.{v_num}"] = verse_obj

print(f"Processed {len(processed_verses)} verses successfully.")

with open(os.path.join(OUTPUT_DIR, "chapters.json"), "w", encoding="utf-8") as f:
    json.dump(processed_chapters, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, "verses.json"), "w", encoding="utf-8") as f:
    json.dump(processed_verses, f, ensure_ascii=False, indent=2)

with open(os.path.join(SERVER_DATA_DIR, "chapters.json"), "w", encoding="utf-8") as f:
    json.dump(processed_chapters, f, ensure_ascii=False, indent=2)

with open(os.path.join(SERVER_DATA_DIR, "verses.json"), "w", encoding="utf-8") as f:
    json.dump(processed_verses, f, ensure_ascii=False, indent=2)

with open(os.path.join(SERVER_DATA_DIR, "verse_lookup.json"), "w", encoding="utf-8") as f:
    json.dump(verse_lookup, f, ensure_ascii=False, indent=2)

with open("public/data/chapters.json", "w", encoding="utf-8") as f:
    json.dump(processed_chapters, f, ensure_ascii=False, indent=2)

with open("public/data/verses.json", "w", encoding="utf-8") as f:
    json.dump(processed_verses, f, ensure_ascii=False, indent=2)

print("Gita indexing and export complete!")
