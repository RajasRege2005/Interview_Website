# RehearseAI - Practice & Excel

**RehearseAI** is a comprehensive platform designed to help users master their interview skills with AI-powered feedback, real-time analysis, and dedicated coding practice environments.

## 🚀 Features

- **AI-Powered Mock Interviews**: Simulate real interview scenarios with automated transcription and analysis.
- **Audio & Transcript Analysis**: Built-in speech recognition and audio processing for detailed communication feedback.
- **Attention & Behavior Tracking**: Integrated tracking features (e.g., face landmarks and attention tracking) to provide behavioral insights during practice sessions.
- **Coding Practice Environment**: Dedicated spaces to practice and solve coding problems with a built-in interactive platform.
- **Comprehensive Dashboards & Reports**: View detailed post-interview analytics, historical performance, and personalized reports.
- **Secure Authentication**: User accounts, login, and profile management (powered by Supabase).

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Directory)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & custom UI components (shadcn/ui inspired)
- **Authentication & Database**: [Supabase](https://supabase.com/)
- **Audio/Video Processing**: Python-based audio analysis (Whisper) & Web Speech APIs

## 📁 Project Structure

A high-level overview of the main workspace directories:

- `/app` - Next.js application routes (Dashboard, Interview, Coding, Auth, Reports).
- `/components` - Reusable React components including UI elements, interview/attention trackers, and layout wrappers.
- `/contexts` - Global state and React contexts (e.g., AuthContext).
- `/lib` - Core utility functions, Supabase client initialization, and analysis helpers.
- `/scripts` - Python (for audio analysis) and TypeScript (for question fetching) utility scripts for backend audio analysis and database seeding.

## 💻 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v18 or higher recommended)
- Python (for audio analysis scripts)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RajasRege2005/Interview_Website.git
   cd Interview_Website

2. **Install Frontend Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```
3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```
4. **Environment Variables**
Create a .env.local file in the root directory and add the necessary environment variables for your database, authentication, and external APIs.
```bash
# Example:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Run the development server**
```bash
npm run dev
```
