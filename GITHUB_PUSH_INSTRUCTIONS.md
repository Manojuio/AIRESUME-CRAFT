# GitHub Setup Instructions

Follow these steps to push your AI Resume Craft project to GitHub with a unique repository name.

## Step 1: Create a New Repository on GitHub

1. Go to [GitHub New Repository](https://github.com/new)
2. Enter repository name: **airesume-craft** (or your preferred unique name)
3. Add description: "🤖 AI-powered resume generator that transforms GitHub profiles into ATS-optimized resumes"
4. Choose **Public** (recommended for portfolio)
5. Do NOT initialize with README (we have one)
6. Click "Create repository"

## Step 2: Add Remote and Push

After creating the repository, run these commands in your terminal:

```bash
cd c:\Users\undra\OneDrive\resume-ai

# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/airesume-craft.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: (Optional) Add GitHub Token Authentication

If you encounter authentication issues, use a GitHub Personal Access Token:

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "git-push-token"
4. Select scopes: `repo` (Full control of private repositories)
5. Click "Generate token" and copy it
6. Use the token as your password when Git prompts for credentials

## Step 4: Alternative - Using GitHub CLI

If you have GitHub CLI installed:

```bash
gh auth login
cd c:\Users\undra\OneDrive\resume-ai
gh repo create airesume-craft --source=. --remote=origin --push
```

## Verify Your Repository

After pushing, verify everything is on GitHub:

```bash
git remote -v
git log --oneline  # Should show your commits
```

## Optional: Create Release/Tags

To create a release for your project:

```bash
git tag -a v1.0.0 -m "Initial release: AI Resume Generator"
git push origin v1.0.0
```

Then create a release on GitHub using the tag.

## Repository Links

Once pushed, your repository will be available at:
- **Repository**: https://github.com/YOUR_USERNAME/airesume-craft
- **Clone URL**: https://github.com/YOUR_USERNAME/airesume-craft.git

## Share Your Project

- Add to portfolio/resume
- Share on social media with description
- Consider adding to GitHub topics: `ai`, `resume`, `groq`, `react`, `fastapi`

---

**Good luck with your AI Resume Craft repository! 🚀**
