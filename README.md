# 🌟 Lewis Gathaiya - Professional Portfolio Website

A modern, multilingual portfolio website built with Next.js, TypeScript, and MongoDB. Features include dark mode, responsive design, admin dashboard, and support for English, French, and Swahili languages.

![Portfolio Preview](public/HomeImage.jpeg)

## 🚀 Live Demo

- **Website**: [Coming Soon - Deploy to Vercel]
- **Admin Dashboard**: [Your URL]/admin

## ✨ Features

### 🌍 Multilingual Support
- **3 Languages**: English 🇺🇸, French 🇫🇷, Swahili 🇰🇪
- Instant language switching
- No page reload required
- Language preference saved in localStorage

### 🎨 Modern Design
- **Dark/Light Mode**: Toggle between themes
- **Responsive**: Works on all devices (mobile, tablet, desktop)
- **Smooth Animations**: Framer Motion animations
- **Modern UI**: Tailwind CSS styling

### 📱 Pages
- **Home**: Hero section with introduction
- **About**: Professional profile, skills, experience, education
- **Experience**: Interactive timeline (vertical/horizontal views)
- **Projects**: Live GitHub integration with search and filters
- **Contact**: Form with validation and email notifications
- **Admin Dashboard**: Secure admin panel for managing contacts

### 🔐 Admin Features
- Secure authentication
- View contact messages
- Delete messages
- Performance monitoring
- Dashboard statistics

### 🛠️ Technical Features
- **Next.js 14**: App Router, Server Components
- **TypeScript**: Type-safe code
- **MongoDB**: Database for contacts and admin
- **i18next**: Internationalization
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **React Icons**: Beautiful icons
- **Form Validation**: Client and server-side validation

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **i18n**: i18next, react-i18next

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT
- **Validation**: Express Validator

### Deployment
- **Frontend**: Vercel (recommended)
- **Backend**: Railway / Render
- **Database**: MongoDB Atlas

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Git installed

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/lewis-portfolio-website.git
cd lewis-portfolio-website
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Set Up Environment Variables

#### Frontend (.env.local)
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

#### Backend (backend/.env)
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

### 4. Set Up MongoDB

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier)
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (allow from anywhere)
5. Get connection string
6. Add to `backend/.env`

### 5. Initialize Admin User

```bash
cd backend
node scripts/init-admin.js
cd ..
```

Default admin credentials:
- Email: `gathaiyalewis1122@gmail.com`
- Password: `Lewis001!`

### 6. Run Development Servers

#### Terminal 1 - Frontend
```bash
npm run dev
```
Frontend runs on: http://localhost:3000

#### Terminal 2 - Backend
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

## 🚀 Deployment

### Deploy to Vercel (Frontend)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy!

See [QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md) for detailed instructions.

### Deploy Backend to Railway

1. Go to [Railway](https://railway.app)
2. Create new project
3. Deploy from GitHub
4. Add environment variables
5. Get backend URL
6. Update frontend env variable

## 📁 Project Structure

```
lewis-portfolio-website/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── about/          # About page
│   │   ├── admin/          # Admin dashboard
│   │   ├── api/            # API routes
│   │   ├── contact/        # Contact page
│   │   ├── experience/     # Experience page
│   │   ├── projects/       # Projects page
│   │   └── page.tsx        # Homepage
│   ├── components/         # React components
│   │   ├── admin/         # Admin components
│   │   ├── layout/        # Layout components
│   │   ├── seo/           # SEO components
│   │   └── ui/            # UI components
│   ├── contexts/          # React contexts
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/               # Utility functions
│   └── locales/           # Translation files
│       ├── en.json        # English
│       ├── fr.json        # French
│       └── sw.json        # Swahili
├── backend/
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   ├── services/          # Business logic
│   └── server.js          # Express server
├── public/                # Static assets
└── package.json           # Dependencies
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/github/repos` - Get GitHub repositories
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Protected)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/contacts` - Get all contacts
- `DELETE /api/admin/contacts/:id` - Delete contact
- `GET /api/admin/dashboard` - Dashboard stats

## 🔧 Configuration

### Adding New Languages

1. Create translation file: `src/locales/[lang].json`
2. Add language to `src/lib/i18n.ts`
3. Update `LanguageContext.tsx` supported languages
4. Add flag to `LanguageToggle.tsx`

### Customizing Theme

Edit `tailwind.config.js` to customize colors, fonts, and more.

### Adding New Pages

1. Create page in `src/app/[page-name]/page.tsx`
2. Add translations to locale files
3. Update navigation in `AppLayout.tsx`

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend
npm test
```

## 📝 Environment Variables

### Frontend
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL

### Backend
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Lewis Gathaiya**
- Email: gathaiyalewis1122@gmail.com
- Phone: +254702320995
- Location: Nairobi, Kenya

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for free hosting
- MongoDB Atlas for free database
- All open-source contributors

## 📞 Support

For support, email gathaiyalewis1122@gmail.com or create an issue in this repository.

---

**⭐ If you like this project, please give it a star on GitHub!**

Made with ❤️ by Lewis Gathaiya
