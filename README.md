
# HOUSEKEEPING-MANAGEMENT-PORTAL---SECURE-AND-CUZTOMIZEABLE-NEXT.JS-FINAL-YEAR-PROJECT

**Empowering Housekeeping with Secure, Customizable Management Solutions**

<p align="center">
  <img src="https://img.shields.io/github/last-commit/faizzyhon/Housekeeping-Management-Portal---Secure-and-Cuztomizeable-Next.js-Final-Year-Project" />
  <img src="https://img.shields.io/github/languages/top/faizzyhon/Housekeeping-Management-Portal---Secure-and-Cuztomizeable-Next.js-Final-Year-Project" />
  <img src="https://img.shields.io/github/languages/count/faizzyhon/Housekeeping-Management-Portal---Secure-and-Cuztomizeable-Next.js-Final-Year-Project" />
  <img src="https://img.shields.io/github/languages/code-size/faizzyhon/Housekeeping-Management-Portal---Secure-and-Cuztomizeable-Next.js-Final-Year-Project" />
</p>

---

## 🛠️ Built with:

<p>
  <img src="https://img.shields.io/badge/-JSON-black?style=flat-square&logo=json" />
  <img src="https://img.shields.io/badge/-npm-CB3837?style=flat-square&logo=npm" />
  <img src="https://img.shields.io/badge/-Autoprefixer-DD3735?style=flat-square&logo=autoprefixer" />
  <img src="https://img.shields.io/badge/-PostCSS-DD3A0A?style=flat-square&logo=postcss" />
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/-Zod-5B21B6?style=flat-square&logoColor=white" />
  <img src="https://img.shields.io/badge/-date-fns-E44D26?style=flat-square&logoColor=white" />
  <img src="https://img.shields.io/badge/-React_Hook_Form-EC5990?style=flat-square" />
  <img src="https://img.shields.io/badge/-YAML-CB171E?style=flat-square&logo=yaml" />
</p>

---

## ✨ Features

- 📋 User & Admin Dashboards
- 🔐 Auth with RBAC (Role-Based Access Control)
- 🧼 Room Assignment & Task Management
- 🗂️ Daily Logs & Cleaning Schedules
- ⚙️ Fully customizable setup with `.env`
- 📊 Analytics Dashboard for performance
- 🔧 API integrated & DB-ready backend

---

## 📸 Screenshots

> Add your actual images here:
<p align="center">
  <img src="https://github.com/faizzyhon/assets/blob/main/housekeeping-portal/dashboard-preview.png" alt="Dashboard Preview" width="800" />
  <br />
  <em>Dashboard Overview (Light Mode)</em>
</p>

---

## 🚀 Getting Started (Local Development)

```bash
git clone git@github.com:faizzyhon/Housekeeping-Management-Portal---Secure-and-Cuztomizeable-Next.js-Final-Year-Project.git
cd Housekeeping-Management-Portal---Secure-and-Cuztomizeable-Next.js-Final-Year-Project
npm install
```

### 🔧 Set Environment Variables

Create `.env.local` and add your secrets:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=your_postgres_url
NEXTAUTH_SECRET=your_secret
```

### 📦 Run the app

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🌍 Deployment

You can deploy this app easily to:

### 🟣 Vercel (Recommended)
1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com/)
3. Add your `.env` variables in Vercel dashboard
4. Deploy!

### 🟢 Other Options:
- Docker
- Railway
- Firebase Hosting (Static Export)
- DigitalOcean

---

## 🔧 Customization Guide

- **To change UI**: Edit files inside `components/`, `app/`, and `styles/`
- **To update fields**: Go to `types/` and `zod/` schema validators
- **To add roles**: Update `auth.config.ts` and `middleware.ts`

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📩 Contact

> Maintained by [@faizzyhon](https://github.com/faizzyhon)

📧 Email: support@faizzyhon.online  
🔗 [LinkedIn](https://linkedin.com/in/mfaizanai)  
☕ [Buy me a Coffee](https://www.patreon.com/c/Faizzyhon)

---

## 📜 License

MIT
