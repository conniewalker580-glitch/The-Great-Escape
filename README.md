# 🎮 The Great Escape

> An immersive, AI-powered escape room experience with 100 unique rooms, 360° panoramic views, and premium visual effects.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.2-black)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎯 Core Gameplay
- **100 Unique Escape Rooms** across multiple themes and difficulty levels
- **360° Panoramic Views** with interactive hotspots
- **Multiple Puzzle Types** - Code input and multiple-choice questions
- **AI-Powered Hints** - Multi-tier hint system with AI fallback
- **Real-time Progress Tracking** - Stars, ranks, and completion times

### 🎨 Visual Experience
- **Premium Success Celebrations:**
  - 🎊 Confetti explosions
  - 🎈 Floating balloons with 3D rotation
  - ✨ Pulsing glow effects
  - 💥 Particle burst animations
  - ⚡ Screen flash effects

### 💎 Subscription Tiers

| Tier | Price | Rooms/Month | Features |
|------|-------|-------------|----------|
| **Free** | $0 | 3 | Standard tutorials, daily rewards |
| **Explorer** | $6.99 | 10 | No ads, priority support |
| **Adventurer** | $12.99 | 100 | Unlimited hints, elite previews ⭐ |
| **Elite** | $19.99 | 200 | Bonus rooms, priority queue 🆕 |
| **Master Escape** | $29.99 | Unlimited | Exclusive cosmetics, early access |

### 🎭 Themes & Difficulty

**Themes:**
- 🔍 Mystery & Detective
- 🚀 Sci-Fi & Space
- 👻 Horror
- 🏛️ Ancient & Historical
- 🎨 Abstract
- 🏠 Cozy & Nostalgic
- 🌊 Coastal
- ⚙️ Industrial & Steampunk
- 🎬 Noir
- 🌌 Astronomy & Mythic
- ⏰ Time Travel
- 🌃 Cyberpunk
- 🧙 Fantasy

**Difficulty Levels:**
- 🟢 Easy (5-10 mins)
- 🟡 Medium (15-25 mins)
- 🔴 Hard (30-45 mins)
- ⚫ Expert (50-90 mins)

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x
- npm or yarn
- Clerk account (authentication)
- Stripe account (payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/the-great-escape.git
cd the-great-escape

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe Payments
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PRICE_EXPLORER=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ADVENTURER=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ELITE=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_MASTER=price_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI (Optional)
HUGGINGFACE_API_KEY=your_huggingface_key
AI_PROVIDER=huggingface
```

## 🏗️ Tech Stack

- **Framework:** Next.js 16.1.2 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS + Framer Motion
- **Authentication:** Clerk
- **Payments:** Stripe
- **AI:** HuggingFace (optional)
- **Image Generation:** Pollinations AI
- **Animations:** Canvas Confetti + Custom CSS

## 📁 Project Structure

```
the-great-escape/
├── app/
│   ├── api/              # Backend API routes
│   │   ├── checkout/     # Stripe checkout
│   │   ├── user-progress/ # Progress tracking
│   │   ├── play/track/   # Usage limits
│   │   └── ai/hint/      # AI hints
│   ├── play/[roomId]/    # Game page
│   ├── pricing/          # Subscription tiers
│   ├── dashboard/        # User dashboard
│   └── rewards/          # Rewards & badges
├── lib/
│   ├── game-data.ts      # Rooms 1-20
│   ├── extra-rooms.ts    # Rooms 21-30
│   ├── rooms-31-50.ts    # Rooms 31-50
│   ├── rooms-51-75.ts    # Rooms 51-75
│   ├── rooms-76-100.ts   # Rooms 76-100
│   ├── subscription.ts   # Tier configuration
│   ├── visual-effects.ts # Visual effects
│   ├── rewards.ts        # Rewards system
│   └── types.ts          # TypeScript types
├── components/
│   ├── PanoramicViewer.tsx  # 360° viewer
│   └── ui/                  # UI components
└── public/
    └── rooms/            # Room assets
```

## 🎮 How to Play

1. **Sign Up** - Create an account (free tier gives you 3 rooms/month)
2. **Choose a Room** - Browse 100 rooms by theme or difficulty
3. **Explore** - Use 360° view to look around the room
4. **Find Clues** - Click on hotspots to inspect objects
5. **Solve Puzzles** - Answer questions using clues you found
6. **Get Hints** - Stuck? Request hints (limited by tier)
7. **Celebrate** - Watch the visual effects when you succeed!
8. **Upgrade** - Want more rooms? Choose a subscription tier

## 🎨 Visual Effects Showcase

When you answer correctly, you'll see:

1. **Confetti** - 150 particles explode in cyan and purple
2. **Balloons** - Colorful balloons float up with 3D rotation
3. **Glow** - Submit button pulses with cyan glow
4. **Particles** - 30 particles burst radially from center
5. **Flash** - Subtle cyan flash across the screen

All effects run simultaneously for maximum celebration! 🎉

## 🔧 Development

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## 📊 Room Statistics

- **Total Rooms:** 100
- **Free Rooms:** 3
- **Premium Rooms:** 97
- **Themes:** 13
- **Difficulty Levels:** 4
- **Average Completion Time:** 15-30 minutes
- **Total Puzzles:** 150+

## 🗺️ Roadmap

- [x] 100 unique escape rooms
- [x] 5-tier subscription model
- [x] Premium visual effects
- [x] 360° panoramic views
- [x] AI-powered hints
- [ ] Database migration (from JSON to PostgreSQL)
- [ ] Multiplayer co-op mode
- [ ] User-generated rooms
- [ ] Mobile app (React Native)
- [ ] Seasonal events
- [ ] Leaderboards

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**C.S. Walker**
- Email: snapmoodaivideo@gmail.com
- GitHub: [@conniewalker580](https://github.com/conniewalker580)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Clerk for seamless authentication
- Stripe for payment processing
- Pollinations AI for image generation
- All the escape room enthusiasts who inspired this project

## 📚 Documentation

- [Quick Start Guide](QUICK_START.md) - Get up and running fast
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Technical details
- [Progress Report](.agent/PROGRESS_REPORT.md) - Development status

## 🐛 Known Issues

- Rooms 76-100 have simplified data (expansion planned)
- Database currently uses JSON file (migration to PostgreSQL planned)
- Stripe products need to be created manually

## 💡 Support

Having issues? Check out:
- [Quick Start Guide](QUICK_START.md)
- [GitHub Issues](https://github.com/yourusername/the-great-escape/issues)
- Email: snapmoodaivideo@gmail.com

---

**Built with ❤️ using Next.js, TypeScript, and lots of coffee ☕**

⭐ Star this repo if you enjoyed playing!
