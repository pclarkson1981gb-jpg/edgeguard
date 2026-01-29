# 🛡️ EdgeGuard
**Stop AI Scrapers. Save your Serverless Bill.**

EdgeGuard is a lightweight Next.js Middleware that blocks aggressive AI bots (Meta, OpenAI, Claude, TikTok) at the Edge, before they trigger expensive serverless functions.

## The Problem
AI crawlers like `FacebookBot` and `Bytespider` can hit your site millions of times a month. On platforms like Vercel or AWS, **you pay for every execution**, even if `robots.txt` asks them to stop.

## The Solution
EdgeGuard runs on the Edge (Vercel Middleware). It drops malicious requests instantly (~0ms cost), saving you hundreds of dollars in compute time.

## Installation

```bash
npm install @edgeguard/protect
