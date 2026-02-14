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
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const ask = (question) =>
        new Promise((resolve) => readline.question(question, resolve));

    const username = await ask("Enter username: ");
    const email = await ask("Enter email: ");
    const password = await ask("Enter password: ");
    const githubToken = await ask("Enter GitHub Token: ");

    await fs.ensureDir(path.dirname(userFile));
    await fs.writeJson(userFile, { username, email, password, githubToken });

    console.log("\n✅ Login saved! Run your command again.");
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

        console.log("🚀 Creating backend project...");

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

        console.log("✅ Backend setup complete!");
    }

    else if (command === "create" && subCommand === "frontend") {
        const inquirer = require("inquirer");

        const answer = await inquirer.prompt([
            {
                type: "list",
                name: "frontendType",
                message: "What do you want to create?",
                choices: ["Website", "App"],
            },
        ]);

        console.log(`You selected: ${answer.frontendType}`);
        console.log("🚧 This feature is coming soon...");
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
        console.log(`Hello ${user.username} 👋`);
        console.log("Try commands:");
        console.log("jarvis tell date");
        console.log("jarvis tell time");
        console.log("jarvis tell score");
    }
}

run();
