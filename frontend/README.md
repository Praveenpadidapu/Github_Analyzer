# DevInsight AI 🧠✨

DevInsight AI is an advanced, enterprise-grade GitHub developer intelligence platform. It analyzes repository activity, commit frequency, code architecture, and community reach to provide actionable insights into a developer's workflow and impact, powered by Gemini AI.

![DevInsight AI Dashboard Overview](./public/dashboard-preview.png)

## 🚀 Features

- **Real-Time Analytics Dashboard**: Instantly track your GitHub metrics including total contributions, stars earned, followers, and public repositories over time.
- **AI Productivity Score**: A robust, weighted score dynamically calculated based on Activity & Consistency (40%), Code Impact (30%), Experience & Breadth (20%), and Community Reach (10%). Includes an interactive breakdown modal.
- **AI-Powered Repository Insights**: Leverages the Gemini Generative AI model to analyze repository code architecture, text stacks, and architectural flow.
- **Commit & Language Analytics**: Visualizes historical commit patterns and favorite programming languages using beautiful charts.
- **Interactive Custom Themes**: Support for dynamically generated accent themes across components with native light and dark modes.
- **Export Data**: Easily export your timeline and tracking history to a clean JSON/CSV format.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS (v4) with Custom Semantic Variables
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Icons:** React Icons & Lucide React
- **Data Visualizations:** Recharts
- **AI Integration:** Google Generative AI (Gemini 1.5 Pro/Flash)
- **Database (via Prisma):** PostgreSQL
- **Theme Support:** next-themes

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key
- GitHub OAuth Application Credentials (Client ID & Secret)
- Postgres Database (Neon, Supabase, or local)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Praveenpadidapu/Github_Analyzer.git
   cd Github_Analyzer/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the `frontend` root directory and add the following:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   DATABASE_URL="your_postgresql_database_url_here"
   GITHUB_CLIENT_ID="your_github_oauth_client_id"
   GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## 🎨 Theme Architecture
DevInsight AI was designed from the ground up to support highly customizable UI themes. It uses `next-themes` wrapped around CSS variables to offer fluid Light, Dark, and System preferred UI settings without hardcoded hex colors blocking the flow.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an Issue for any bugs or feature requests.

## 📄 License
This project is licensed under the MIT License.
