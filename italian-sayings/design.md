# Design Document: Italian Sayings

## Overview

Simple web app with category buttons that show one Italian saying at a time with English translation and usage context.

## How It Works

1. User sees 5 category buttons (warm, sarcastic, formal, humorous, wise)
2. User clicks a category button
3. App shows one random saying from that category
4. Saying includes: Italian text, English translation, when to use it
5. Clicking same button again shows a different saying

## Data Storage

- Sayings stored as JSON in browser's localStorage
- Each saying has: Italian text, English translation, category, usage context
- Data persists between browser sessions

## Key Features

- Random selection ensures variety
- All sayings in a category will eventually appear
- No immediate repetition when clicking same category
- Works offline once loaded

## Testing Approach

- Test that clicking categories shows appropriate sayings
- Test that random selection is fair over many clicks
- Test that data saves and loads correctly

