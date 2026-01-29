// src/index.ts
import { NextRequest, NextResponse } from 'next/server';
import { BAD_BOTS, DEFAULT_WHITELIST } from './bot-list';

interface EdgeGuardConfig {
  /** Your EdgeGuard API Key (Optional for Free Tier) */
  apiKey?: string;
  /** Enable aggressive blocking for all AI scrapers? Default: true */
  blockAI?: boolean;
  /** Custom paths to never block */
  whitelist?: string[];
  /** If true, logs blocked attempts to Vercel console */
  verbose?: boolean;
}

export async function protect(
  req: NextRequest, 
  config: EdgeGuardConfig = {}
): Promise<{ blocked: boolean; response?: NextResponse }> {
  
  const userAgent = (req.headers.get('user-agent') || '').toLowerCase();
  const path = req.nextUrl.pathname;

  // 1. SAFETY CHECK: Skip Whitelisted Paths
  // We do not want to block Stripe webhooks or static assets
  const whitelist = [...DEFAULT_WHITELIST, ...(config.whitelist || [])];
  if (whitelist.some(w => path.startsWith(w))) {
    return { blocked: false };
  }

  // 2. CHECK: Is this a known Bad Bot?
  // In V2, this is where you'd check a real-time remote DB if apiKey is present
  const isBadBot = BAD_BOTS.some(bot => userAgent.includes(bot.toLowerCase()));

  if (isBadBot && (config.blockAI !== false)) {
    if (config.verbose) {
      console.warn(`[EdgeGuard] Blocked ${userAgent} requesting ${path}`);
    }

    // 3. ACTION: Return 403 Forbidden
    // We return a JSON response so it's clear why it failed
    return {
      blocked: true,
      response: new NextResponse(
        JSON.stringify({ error: 'Bot traffic blocked by EdgeGuard', bot: userAgent }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    };
  }

  // 4. PASS: Traffic is clean
  return { blocked: false };
}
