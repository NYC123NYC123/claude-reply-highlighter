# Claude Reply Highlighter

A small mod for Claude Code. When Claude's reply needs something from you (a decision, an approval, a step to take, a question to answer), those items are pulled out of the wall of text and shown in a soft yellow card at the very end of the reply, under the label **YOUR MOVE**.

Replies that need nothing from you get no card.

## What it does

1. It adds a hidden note to each message you send, asking Claude to finish any reply that needs you with a short numbered list of only your actions.
2. It draws that list as a faint yellow card with a glowing dot, so it stands out from the rest of the reply.

It reads nothing from your files and sends nothing anywhere.

## Install

You need a recent version of Claude Code (2.1.321 or newer). Older versions can't load this kind of mod.

**In a terminal session of Claude Code**, type this at the prompt:

```
/plugin install claude-reply-highlighter --marketplace NYC123NYC123/claude-reply-highlighter
```

Answer `y` to add the marketplace, then press Enter to install it for yourself.

**From a plain terminal (PowerShell, Terminal):**

```
claude plugin install claude-reply-highlighter --marketplace NYC123NYC123/claude-reply-highlighter
```

**In the Claude desktop app:** click **+** next to the message box, then **Plugins**, then **Add marketplace**, and enter `NYC123NYC123/claude-reply-highlighter`. Then choose **Add plugin** on Claude Reply Highlighter.

Start a new session afterwards. The card appears the next time Claude needs something from you.

## Prefer to paste?

Open [PASTE-INTO-CLAUDE.md](PASTE-INTO-CLAUDE.md), copy the box, and paste it into Claude Code. Claude does the install for you.

## Change the look

The colours live at the top of `hooks/register.tsx`:

- `YELLOW` is the label, dot and number colour.
- `TINT` is the faint wash behind the card (the last two characters set how strong it is).
- `EDGE` is the outline.

## Remove it

```
claude plugin uninstall claude-reply-highlighter
```
