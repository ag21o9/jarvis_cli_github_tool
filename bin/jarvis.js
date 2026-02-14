#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const simpleGit = require("simple-git");
const git = simpleGit();
const chalk = require("chalk");
const ora = require("ora");
const figlet = require("figlet");
const gradient = require("gradient-string");
const boxen = require("boxen");


// Path where user info will be stored
const userFile = path.join(__dirname, "../data/user.json");

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0];
const subCommand = args[1];

// Check if user is already logged in
function isLoggedIn() {
    return fs.existsSync(userFile);
}

// First-time login setup
async function login() {
    console.clear();

    console.log(
        gradient.pastel.multiline(
            figlet.textSync("JARVIS", { horizontalLayout: "full" })
        )
    );

    console.log(
        boxen(
            chalk.cyan("Welcome to Jarvis Setup 🚀\nPlease enter your details"),
            { padding: 1, borderColor: "magenta", borderStyle: "round" }
        )
    );

    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const ask = (question) =>
        new Promise((resolve) =>
            readline.question(chalk.yellow(question), resolve)
        );

    const username = await ask("👤 Username: ");
    const email = await ask("📧 Email: ");
    const password = await ask("🔑 Password: ");
    const githubToken = await ask("🐙 GitHub Token: ");

    await fs.ensureDir(path.dirname(userFile));
    await fs.writeJson(userFile, { username, email, password, githubToken });

    console.log(chalk.green("\n✅ Login saved successfully!"));
    readline.close();
}


// If not logged in → force login
async function requireLogin() {
    if (!isLoggedIn()) {
        console.log("🔐 First time setup required.\n");
        await login();
        return false;
    }
    return true;
}

async function run() {
    if (!(await requireLogin())) return;

    const user = await fs.readJson(userFile);

    if (command === "tell") {
        if (subCommand === "date") {
            const today = new Date().toDateString();
            console.log(`Hey ${user.username}, today is ${today}`);
        }

        else if (subCommand === "time") {
            const time = new Date().toLocaleTimeString();
            console.log(`Hey ${user.username}, current time is ${time}`);
        }
        else {
            console.log("Unknown tell command");
        }
    }
    else if (command === "create" && subCommand === "backend") {
        const { execSync } = require("child_process");
        const fs = require("fs-extra");

        const spinner = ora(chalk.cyan("Building your backend...")).start();




        // 1️⃣ npm init
        execSync("npm init -y", { stdio: "inherit" });

        // 2️⃣ Install dependencies
        execSync("npm install express prisma cors axios dotenv", {
            stdio: "inherit",
        });

        // 3️⃣ Create folders
        fs.ensureDirSync("src");
        fs.ensureDirSync("config");
        fs.ensureDirSync("assets");

        // 4️⃣ Create .env
        fs.writeFileSync(".env", "PORT=3000\nDATABASE_URL=\n");

        // 5️⃣ Create .gitignore
        fs.writeFileSync(
            ".gitignore",
            `
            node_modules
            .env
            `
        );

        // 6️⃣ Update package.json → type module
        const pkg = fs.readJsonSync("package.json");
        pkg.type = "module";
        fs.writeJsonSync("package.json", pkg, { spaces: 2 });

        // 7️⃣ Create index.js starter
        fs.writeFileSync(
            "index.js",
            `
            import express from "express";
            import cors from "cors";
            import dotenv from "dotenv";

            dotenv.config();

            const app = express();

            app.use(cors());
            app.use(express.json());

            app.get("/", (req, res) => {
              res.send("API Running 🚀");
            });

            const PORT = process.env.PORT || 3000;

            app.listen(PORT, () => {
              console.log("Server running on port", PORT);
            });
            `
        );

        spinner.succeed(chalk.green("Backend setup complete! 🎉"));
    }

    else if (command === "create" && subCommand === "frontend") {
        const inquirer = require("inquirer");
        const { execSync } = require("child_process");
        const ora = require("ora");
        const fs = require("fs-extra");

        // 1️⃣ Ask project name
        const { projectName } = await inquirer.prompt([
            {
                type: "input",
                name: "projectName",
                message: "Enter project name:",
                default: "my-frontend"
            }
        ]);

        // 2️⃣ Ask type
        const { frontendType } = await inquirer.prompt([
            {
                type: "list",
                name: "frontendType",
                message: "What do you want to create?",
                choices: [
                    "Website (React + Vite + Tailwind)",
                    "Android App (React Native + Expo)"
                ],
            },
        ]);

        // 3️⃣ Confirm
        const { proceed } = await inquirer.prompt([
            {
                type: "confirm",
                name: "proceed",
                message: `Create ${frontendType} named "${projectName}"?`,
                default: true,
            },
        ]);

        if (!proceed) {
            console.log("❌ Cancelled.");
            return;
        }

        // ============================
        // 🌐 WEBSITE SETUP
        // ============================
        if (frontendType.includes("Website")) {
            const spinner = ora("Creating React + Vite + Tailwind project...").start();

            try {
                // Create Vite React project
                execSync(
                    `npm create vite@latest ${projectName} -- --template react --yes`,
                    { stdio: "ignore" }
                );

                process.chdir(projectName);

                // Install base deps
                execSync("npm install", { stdio: "ignore" });

                // Install Tailwind v3 (STABLE)
                execSync(
                    "npm install -D tailwindcss@3.4.4 postcss autoprefixer",
                    { stdio: "ignore" }
                );

                // Init Tailwind (works in v3)
                execSync("npx tailwindcss init -p", { stdio: "ignore" });

                // Configure Tailwind content paths
                const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
                fs.writeFileSync("tailwind.config.js", tailwindConfig);

                // Add Tailwind to CSS
                fs.writeFileSync(
                    "src/index.css",
                    `
@tailwind base;
@tailwind components;
@tailwind utilities;
`
                );

                // Ensure CSS is imported
                fs.appendFileSync(
                    "src/main.jsx",
                    `\nimport './index.css';\n`
                );

                spinner.succeed("Website ready! 🚀");

                console.log("\nNext steps:");
                console.log(`cd ${projectName}`);
                console.log("npm run dev");

            } catch (err) {
                spinner.fail("Failed to create website");
                console.log(err.message);
            }
        }

        // ============================
        // 📱 ANDROID APP SETUP
        // ============================
        else {
            const spinner = ora("Creating React Native app (Expo)...").start();

            try {
                execSync(
                    `npx create-expo-app ${projectName} --yes`,
                    { stdio: "ignore" }
                );

                spinner.succeed("Android app ready! 📱");

                console.log("\nNext steps:");
                console.log(`cd ${projectName}`);
                console.log("npm start");

            } catch (err) {
                spinner.fail("Failed to create app");
                console.log(err.message);
            }
        }
    }





    else if (command === "create" && subCommand === "repo") {
        const repoName = args[2];

        if (!repoName) {
            console.log("Please provide repo name");
            return;
        }

        const token = user.githubToken;

        try {
            // 1️⃣ Create repo on GitHub
            const res = await axios.post(
                "https://api.github.com/user/repos",
                {
                    name: repoName,
                    private: false
                },
                {
                    headers: {
                        Authorization: `token ${token}`
                    }
                }
            );

            const repoUrl = res.data.clone_url;

            console.log("✅ GitHub repo created:", repoUrl);

            // 2️⃣ Push current folder code
            await git.init();
            await git.add(".");
            await git.commit("Initial commit by Jarvis");
            await git.branch(["-M", "main"]);
            await git.addRemote("origin", repoUrl);
            await git.push("origin", "main");

            console.log("🚀 Code pushed successfully!");
        } catch (err) {
            console.log("❌ Error:", err.response?.data || err.message);
        }
    }
    else if (command === "logout") {
        await fs.remove(userFile);
        console.log("Logged out successfully.");
    }

    else {
        console.log(
            boxen(
                gradient.atlas(`Welcome back, ${user.username} 🚀`),
                { padding: 1, borderColor: "green", borderStyle: "round" }
            )
        );
        console.log(chalk.yellow("📦 jarvis create backend"));
        console.log(chalk.cyan("🌐 jarvis create frontend"));
        console.log(chalk.cyan("🌐 jarvis create repo"));

    }
}

run();
