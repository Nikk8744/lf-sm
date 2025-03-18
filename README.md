# Local Farmers' Marketplace 🌾

A modern e-commerce platform connecting local farmers directly with consumers, built with Next.js 13+ and the App Router.

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, React Query
- **Backend:** Next.js API routes, Drizzle ORM
- **Database:** PostgreSQL (Neon)
- **Authentication:** NextAuth.js (Google OAuth)
- **Payments:** Stripe
- **Email:** Resend
- **Validation:** Zod
- **State Management:** Zustand
- **UI Components:** shadcn/ui
- **Deployment:** Vercel

## 🛠️ Prerequisites

- Node.js 18+ 
- pnpm
- PostgreSQL database (Neon)
- Google OAuth credentials
- Stripe account
- Resend account

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=your_neon_database_url

# Auth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Resend
RESEND_API_KEY=your_resend_api_key
VERIFIED_EMAIL=your_verified_email
```

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/local-farmers-marketplace.git
cd local-farmers-marketplace
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up the database**
```bash
# Generate database schema
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed the database (optional)
pnpm db:seed
```

4. **Run the development server**
```bash
pnpm dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── database/        # Database schema and config
│   ├── emails/          # Email templates
│   └── store/           # TypeScript types
├── public/              # Static assets
└── migrations/          # Database migrations
```

## 🔑 Key Features

- 🛍️ Product browsing and searching
- 🛒 Shopping cart management
- 💳 Secure checkout with Stripe
- 📦 Order tracking
- ⭐ Product reviews
- 👤 User profiles
- 📧 Email notifications
- 🗺️ Map view of products
- 📱 Responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
```bash
git checkout -b feature/amazing-feature
```
3. Make your changes
4. Run tests (when implemented)
```bash
pnpm test
```
5. Commit your changes
```bash
git commit -m 'Add amazing feature'
```
6. Push to the branch
```bash
git push origin feature/amazing-feature
```
7. Open a Pull Request

## 📝 Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Add comments for complex logic
- Test your changes thoroughly

## 🚀 Deployment

The project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy!

## 📜 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate database schema
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm db:seed` - Seed the database

## 🔜 Roadmap

- [ ] AI Recepie suggestions
- [ ] Subscription service
- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Bulk ordering
- [ ] Farmer profiles
- [ ] Community features

<!-- ## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername) -->

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Neon Database](https://neon.tech/)
- [Stripe](https://stripe.com/)
- [Resend](https://resend.com/)
- [Zod](https://zod.dev/)
- [Zustand](https://github.com/pmndrs/zustand)

<!-- [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)] -->