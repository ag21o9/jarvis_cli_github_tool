# Jarvis CLI — Your Personal Dev Assistant

Jarvis is a powerful, interactive CLI tool that helps developers quickly scaffold projects, automate setup tasks, and create GitHub repositories — all from the terminal with a single command.

It is designed to save time during hackathons, rapid prototyping, and daily development.

---

# Features

### Smart Project Generators

* `jarvis create backend`

  * Express server setup
  * Prisma + CORS + Axios + Dotenv installed
  * Folder structure created
  * `.env` + `.gitignore` configured

* `jarvis create frontend`

  * Choose:

    * 🌐 Website → React + Vite + Tailwind
    * 📱 Android → React Native (Expo)
  * Fully auto-configured

### GitHub Automation

* `jarvis create repo <name>`

  * Creates repo in your GitHub account
  * Pushes current code automatically

### Utility Commands

* `jarvis tell date`
* `jarvis tell time`

### Secure Login System

First-time setup stores:

* Username
* Email
* Password (local only)
* GitHub Token

---

# Installation

Install globally using npm:

```bash
npm install -g <your-package-name>
```

After installing, you can run from anywhere:

```bash
jarvis
```

---

# 🔑 First-Time Setup

When you run Jarvis for the first time:

```bash
jarvis
```

It will ask for:

* Username
* Email
* Password
* GitHub Personal Access Token

This information is stored locally on your system.

---

# How to Get a GitHub Token (Important)

Jarvis needs a GitHub token to create repositories automatically.

### Step-by-step:

1. Go to:

   ```
   https://github.com/settings/tokens
   ```

2. Click:

   ```
   Generate new token (classic)
   ```

3. Select scopes:

   * ✅ repo
   * ✅ workflow (optional but recommended)

4. Click:

   ```
   Generate token
   ```

5. Copy the token immediately
   (GitHub will not show it again)

6. Paste it into Jarvis when asked.

---

# Security Note

* Your token is stored **locally only**
* Never upload your token to GitHub
* Never share it publicly

If compromised:

* Delete it from GitHub
* Generate a new one

---

# Usage Guide

## Create Backend

```bash
jarvis create backend
```

Creates:

* Express project
* Prisma installed
* Config folders
* `.env` + `.gitignore`
* Starter server file

---

## Create Frontend

```bash
jarvis create frontend
```

Then choose:

* Website (React + Vite + Tailwind)
* Android App (React Native + Expo)

Jarvis will:

* Ask project name
* Install dependencies
* Configure everything automatically

---

## Create GitHub Repo

Inside your project folder:

```bash
jarvis create repo my-project-name
```

Jarvis will:

* Create a repo on GitHub
* Initialize git
* Push your code

---

## 📅 Utility Commands

```bash
jarvis tell date
jarvis tell time
```

---

## 🔓 Logout

```bash
jarvis logout
```

Clears stored user credentials.

---

# 📁 Example Workflow

```bash
mkdir myApp
cd myApp

jarvis create backend
jarvis create frontend
jarvis create repo myApp
```

In minutes you have:

* Backend
* Frontend
* GitHub repo

---

# Why Jarvis?

Jarvis removes repetitive setup tasks like:

* Creating folders
* Installing packages
* Configuring Tailwind
* Setting up Express
* Initializing Git
* Creating repositories

Perfect for:

* Hackathons
* Students
* Freelancers
* Rapid MVP building

---

# Author

Built with ❤️ to make development faster and more enjoyable.

---

# Future Updates

Planned features:

* Fullstack generator
* Auth-ready backend templates
* AI-based project creation
* Deployment automation
* Theme customization
* Voice commands 

---

# ⭐ Support

If you find this helpful:

* Star the repository
* Share with friends
* Contribute ideas

Happy Building 
