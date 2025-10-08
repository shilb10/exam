# 🎓 Offline Examination System

A complete offline examination system that works by simply opening `index.html` in any browser - **no server, no internet required!**

## � How to Run the Exam

1. **📂 Download** all files to your computer
2. **🖱️ Double-click** `index.html` to open in your browser
3. **📚 Select** Class → Subject → Topic → Paper from dropdowns
4. **▶️ Click** "Start Exam" and begin!
5. **📊 Submit** to view results with explanations

**That's it!** Works completely offline on any device with a modern browser.

## 📝 Adding Content (Instructors)

All exam content is stored in `js/embedded-exam-data.js`. Edit this file to add new classes, subjects, topics, tests, and questions.

### 1. Adding a New Class

Add to the `structure.classes` array:

```javascript
{
    name: "Class 12",
    subjects: [
        // Add subjects here
    ]
}
```

### 2. Adding a New Subject

Within a class, add to the `subjects` array:

```javascript
{
    name: "Chemistry (Advanced)",
    topics: [
        // Add topics here
    ]
}
```

### 3. Adding a New Topic

Within a subject, add to the `topics` array:

```javascript
{
    name: "Organic Chemistry",
    papers: [
        // Add tests here
    ]
}
```

### 4. Adding a New Test

Within a topic, add to the `papers` array:

```javascript
{
    name: "Organic Reactions - Test 1",
    duration: 60,  // minutes
    questions: 10, // number of questions
    jsonFile: "class_12_chemistry_organic_reactions_test1.json"  // unique filename
}
```

### 5. Adding Questions

In the `questions` object, add an entry with the same filename:

```javascript
'class_12_chemistry_organic_reactions_test1.json': {
    "paper_info": {
        "name": "Organic Reactions - Test 1",
        "subject": "Chemistry (Advanced)",
        "topic": "Organic Chemistry",
        "class": "Class 12"
    },
    "questions": [
        {
            "type": "multiple_choice",
            "question": "Which reagent is used for oxidation of alcohols?",
            "options": [
                "KMnO₄",
                "LiAlH₄",
                "NaBH₄",
                "Zn/HCl"
            ],
            "correct": 0,  // Index of correct answer (0-3)
            "explanation": "KMnO₄ is a strong oxidizing agent used to oxidize alcohols."
        }
        // Add more questions...
    ]
}
```

### Mathematical Expressions

Use LaTeX syntax for math:
- Inline: `$x^2 + 2x + 1$`
- Display: `$$\\int 2x \\, dx = x^2 + C$$`

## 💡 Tips

- **Test changes**: Open `index.html` to verify new content appears
- **Math rendering**: Uses KaTeX for mathematical expressions
- **Mobile friendly**: Ensure questions display well on small screens
- **Keep backups**: Save copies before making major changes

---

© 2025 Ramakrishna Mission Home of Service, Luxa, Varanasi, Uttar Pradesh | All Rights Reserved
