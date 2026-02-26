# ShieldDispatch (Ranger Copilot)

**ShieldDispatch** is an autonomous AI-driven anti-poaching surveillance system designed to provide real-time field intelligence and automated patrol response. It triages field camera images, detects poaching threats, and generates actionable intelligence for ranger teams.

![ShieldDispatch Dashboard](Data/Image1.png) *(Example Image)*

## 🚀 Key Features

- **Autonomous AI Triage**: Automatically processes field batches using OpenAI Vision to identify wildlife, humans, and vehicles.
- **Advanced Poaching Detection**: Distinguishes between normal wildlife behavior, legal conservation dehorning, and active poaching threats.
- **Automated Audit Trail**: A complete, reactive history of all triaged field data with live status tracking.
- **Incident Briefings**: Generates structured markdown reports and AI voice briefings (ElevenLabs) for field teams.
- **Direct Patrol Dispatch**: One-click escalation to field teams (Dispatch Rangers) with full analysis context.
- **Geospatial Tracking**: Captures and displays GPS and EXIF data directly from field images for precise location monitoring.

## 🛠 Tech Stack

- **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Backend/DB**: [Convex](https://www.convex.dev/) (Real-time Database + File Storage + Edge Functions)
- **AI/ML**: [OpenAI GPT-4o Vision](https://platform.openai.com/docs/models/gpt-4o), [ElevenLabs TTS](https://elevenlabs.io/)
- **Icons/UI**: [Lucide React](https://lucide.dev/), [Date-fns](https://date-fns.org/)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js & npm
- Python 3.x (for automated integration tests)
- Convex Account (or run locally)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-org/shield-dispatch.git
    cd shield-dispatch
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    pip install -r requirements.txt
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file based on `.env.example`:
    ```bash
    cp .env.example .env
    ```
    Add your `OPENAI_API_KEY` and `ELEVENLABS_API_KEY` to `.env`.

4.  **Run with Convex**:
    Start the backend and frontend simultaneously:
    ```bash
    npx convex dev
    ```

## 🏗 Technical Implementation

- **Threat Score Algorithm**: Detection logic located in `convex/pipeline.ts` uses neural confidence deltas combined with factor-based logic (Humans + Vehicles + Arms) to calculate real-time threat levels.
- **Reactive UI**: The dashboard uses Convex's `useQuery` hooks to provide sub-second updates as AI analysis completes in the background.
- **Metadata Extraction**: Frontend extracts EXIF data (GPS/Capture Time) using `lib/exif.ts` before ingestion to ensure data integrity.

## 📄 License

MIT © [Ranger Copilot Team]
