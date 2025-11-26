# Scrapy Topics

A delightful alternative for interactive quiz learning. Transform PDF question banks into engaging, interactive quizzes with instant feedback and progress tracking.

## Features

- 📄 **PDF to JSON Conversion** - Parse PDF files containing multiple-choice questions into structured JSON format
- 📝 **Interactive Quiz Interface** - Practice questions with an intuitive, user-friendly interface
- ✅ **Instant Feedback** - Get immediate validation of your answers with visual feedback
- 🎯 **Smart Answer Selection** - Automatic limit on selectable answers based on correct answer count
- 🌓 **Dark Mode Support** - Seamless light/dark theme switching
- 📊 **Progress Tracking** - Navigate through questions with keyboard shortcuts and direct question jumping
- 💾 **Import/Export** - Load JSON question banks and export parsed data

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/iskorini/scrapytopics.git
cd scrapytopics
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### For Students (Main Interface)

1. Navigate to the homepage
2. Upload a JSON file containing your question bank
3. Select answers by clicking checkboxes (limited to the number of correct answers)
4. Click "Show solution" when ready to check your answers
5. Navigate between questions using Previous/Next buttons or direct question number input

### For Administrators (PDF Conversion)

1. Navigate to `/admin`
2. Upload a PDF file containing multiple-choice questions
3. The system will automatically parse the questions
4. Download the generated JSON file
5. Use this JSON file in the main interface for practice

## Question Format

The application expects questions in the following JSON structure:

```json
{
  "1": {
    "question": "What is the correct answer?",
    "answers": {
      "A": "First option",
      "B": "Second option",
      "C": "Third option",
      "D": "Fourth option"
    },
    "community_answer": ["A", "C"],
    "proposed_answer": ["A", "C"],
    "community_answer_score": "85%"
  }
}
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **PDF Processing**: Custom parser with API route

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main quiz interface
│   ├── admin/
│   │   └── page.tsx      # PDF to JSON conversion page
│   └── api/
│       └── pdf2text/
│           └── route.ts  # PDF processing endpoint
├── components/
│   ├── QuestionCard.tsx  # Interactive question component
│   ├── UploadJSON.tsx    # JSON file uploader
│   ├── UploadPDF.tsx     # PDF file uploader
│   └── DownloadJSON.tsx  # JSON download button
└── lib/
    ├── parser.ts         # PDF text parsing logic
    └── validator.ts      # Answer validation logic
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

This README was written with assistance from Claude Sonnet 4.5.

---

Built with ❤️ by [iskorini](https://github.com/iskorini)
