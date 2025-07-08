# API Setup Guide

## OpenAI API Configuration

To use the AI Gift Finder feature, you'll need to set up an OpenAI API key:

1. **Get an OpenAI API Key:**
   - Go to [OpenAI's website](https://platform.openai.com/)
   - Sign up or log in to your account
   - Navigate to the API section
   - Generate a new API key

2. **Add Environment Variable:**
   - In your project root, create a `.env.local` file (if it doesn't exist)
   - Add your OpenAI API key:
   \`\`\`
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

3. **Deploy to Vercel:**
   - In your Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add `OPENAI_API_KEY` with your API key value
   - Redeploy your application

## Usage

The AI Gift Finder will now be available at `/gift-finder` and will generate personalized gift suggestions based on:
- Relationship to the recipient
- Occasion
- Budget constraints

The API endpoint is available at `/api/giftgen` for programmatic access.
