<div align="center">

# ⚡ PokemonCraze

### *The Ultimate Pokémon Team Builder & Coverage Analyzer*

[![Live Demo](https://img.shields.io/badge/🔴_Live_Demo-seucra.github.io/pokemon-DC2626?style=for-the-badge)](https://seucra.github.io/pokemon/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

*Analyze type coverage, optimize abilities, and craft the perfect competitive team.*
*Designed by trainers, for trainers.*

---

</div>

## 🎮 What is PokemonCraze?

PokemonCraze is a high-performance, premium Pokémon data hub and team builder designed for enthusiasts. It provides real-time defensive coverage analysis, ability management, and multi-team support — all wrapped in a sleek, Pokémon-themed interface built for speed.

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Intelligent Search** | Instant Pokémon lookup with smart autocomplete powered by PokéAPI |
| 🛡️ **Defensive Coverage** | Real-time 18-type matrix calculating weaknesses (2x/4x), resistances & immunities |
| ⚔️ **Team Builder** | Manage a full 6-Pokémon squad with interactive slot selection |
| 🧬 **Ability Sync** | Choose and save specific abilities, including rare Hidden Abilities |
| 📦 **Multi-Team Hub** | Create and manage multiple specialized teams with persistent local storage |
| 📱 **Ultra-Responsive** | Full-featured experience on any device, from ultrawide monitors to mobile |

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | [React](https://react.dev/) | 19 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.9 |
| **Bundler** | [Vite](https://vite.dev/) | 7 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4 |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) | 5 |
| **Icons** | [Lucide React](https://lucide.dev/) | Latest |
| **Data Source** | [PokéAPI](https://pokeapi.co/) | v2 |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `v18+`
- [npm](https://www.npmjs.com/) `v9+`

### Installation

```bash
# Clone the repository
git clone https://github.com/seucra/pokemon.git
cd pokemon

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/pokemon/`.

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
pokemon/
├── public/              # Static assets
├── src/
│   ├── api/             # PokéAPI data fetching
│   ├── assets/          # Images & media
│   ├── components/
│   │   ├── Navigation/  # Navbar & routing
│   │   ├── Pages/       # Landing page, Pokédex
│   │   └── Teambuilder/ # Core team builder UI
│   ├── hooks/           # Custom React hooks
│   ├── logic/           # Type calculation engine
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Helper utilities
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── index.html
├── vite.config.ts
└── package.json
```

## 🗺️ Roadmap

- [x] **Phase 1** — Core Team Builder & Defensive Coverage
- [ ] **Phase 2** — Move-set selection & IV/EV calculators
- [ ] **Phase 3** — Offensive coverage analysis & damage calculators
- [ ] **Phase 4** — Battle Simulator integration

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

*Data powered by [PokéAPI](https://pokeapi.co/) · Built with ❤️ for the Pokémon community*

</div>
