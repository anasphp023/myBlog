---
title: "Random Notes on Bug Bounty Tools That Actually Work"
date: 2026-09-05
draft: false
description: "A few tools I reach for every day in my bug bounty workflow: httpx, notify, anew, Param Miner, hakrawler, jq/cut/awk, Logger++ and GitHub recon, with the exact flags I use."
title_de: "Zufällige Notizen zu Bug-Bounty-Tools, die wirklich funktionieren"
description_de: "Ein paar Tools, die ich täglich in meinem Bug-Bounty-Workflow nutze: httpx, notify, anew, Param Miner, hakrawler, jq/cut/awk, Logger++ und GitHub-Recon, samt der Flags, die ich wirklich verwende."
tags: ["bug-bounty", "recon", "tools", "automation", "web-security"]
image: "cover.jpg"
---

Hey everyone!

I hope you're having a good day. Long time no write — well, with the rise of AI we've nearly forgotten how to read and write like back in the old days. We're just using AI for everything. Anyway, I'm not going to speak very deep tech here, it's going to be just a few thoughts about tools I heavily use every day in my Bug Bounty workflows. I want to share some of them which I found — very nice — to have. Most of the tools I'm going to speak about are simple, but efficient and going to save you a lot of time I think. The list is randomly ordered, I'll just put whatever comes to my mind.

---

## 1. httpx from ProjectDiscovery

<https://github.com/projectdiscovery/httpx>

This is not just a tool to detect live domains, instead it's a built-in browser in your terminal. With the right options and flags it can give you a lot of information about a domain without even clicking it in the browser. For example use:

```bash
cat subdomains.txt | httpx -sc -title -cname -td -ct -fc 404
```

- `-sc` shows the response status code for each domain
- `-title` gives you the title of the page, which can tell you a lot (a title with "admin" or "register" will catch your eyes fast)
- `-cname` does the domain have a CNAME record?
- `-td` fingerprints the technology in use (WordPress, Tomcat, React, etc.) so you can look for common CVEs
- `-ct` shows the response content-type, for example if it's `application/json` this is probably a good hint that the server is an API surface
- `-fc` filters out response status codes you don't want

A result line ends up looking like:

```
https://old.target.com [200] [Legacy Admin Portal] [text/html] [old-target.herokudns.com] [Apache,PHP]
```

**Install:**

```bash
go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest
```

---

## 2. Notify from ProjectDiscovery

<https://github.com/projectdiscovery/notify>

This tool can help you stream your output into push notifications to a lot of apps like Slack, Discord and Telegram. Personally I use Telegram. It can be very useful for your monitoring scripts running 24H on your VPS. You only need to create a Telegram Bot and edit the file `.config/notify/provider-config.yaml` with your `telegram_api_key` and `telegram_chat_id`.

```bash
assetfinder --subs-only example.com | notify -p telegram -silent
```

**Install:**

```bash
go install -v github.com/projectdiscovery/notify/cmd/notify@latest
```

---

## 3. anew from Tomnomnom

<https://github.com/tomnomnom/anew>

I would highly recommend checking out all the tools made by Tomnomnom. `anew` is one of the simplest but a good tool. It does one very small thing: it reads lines from stdin, and for each line, if that line isn't already in a target file, it appends it there and prints it to stdout. If the line already exists in the file, it's silently skipped — no duplicate written, nothing printed.

For example:

```bash
$ cat subs.txt
api.target.com
www.target.com

$ subfinder -d target.com -silent | anew subs.txt
dev.target.com
```

Only `dev.target.com` gets printed and appended — the other two were already in the file, so they're skipped entirely. This is great for your monitoring script with `notify`, because it prints just the new lines, so you can pipe that straight into `notify` and get pinged only when something actually changed.

```bash
# tell me the instant a new host on this target goes live
assetfinder --subs-only example.com | httpx | anew liveSubdomains.txt | notify -p telegram -silent
```

**Install:**

```bash
go install -v github.com/tomnomnom/anew@latest
```

---

## 4. Param Miner (Burp Suite extension)

I would say that every request you test MUST go through Param Miner. This tool can fuzz parameters, headers, cookies and body params. It can also help you find Web Cache bugs, SSRF and DoS. Personally, I've been able to find many bugs starting with Param Miner. You can discover more here: <https://github.com/PortSwigger/param-miner>

**Install** in both Community and Professional Burp Suite → Extensions → BApp Store.

![Tuxedo Winnie the Pooh meme: "Bug" on top, "Bug Bounty" on the bottom](meme.jpg)

---

## 5. Hakrawler — Web Crawling

Or any tool that can help you crawl the target fast and walk through the site structure. You can also use `katana` from ProjectDiscovery as well, it has plenty of options there.

**Install:**

```bash
go install github.com/hakluke/hakrawler@latest
```

---

## 6. Output filter tools (jq, cut, awk)

These will make your workflow a bit faster and easier. If you don't know at least how to grep a specific pattern using `cut` on some output, you have to go back to command line basics. `jq` is for JSON output. I would call them "in-between tools" — every pipeline step will need its own custom filter or parsing flag.

---

## 7. Logger++ (Burp Suite extension)

Works like the normal Logger in Burp, but with more advanced filters. Works with both Community and Professional versions.

---

## 8. GitHub Reconnaissance

**github-subdomains** — looks for all subdomains in GitHub public code for a specific target:

```bash
go install github.com/gwen001/github-subdomains@latest
```

**github-endpoints** — looks for all URLs/endpoints in GitHub public code for a specific target:

```bash
go install github.com/gwen001/github-endpoints@latest
```

Both tools need a GitHub Personal Access Token in the config file.

---

## Final Recon Tips

For some recon tips, I'd say don't stick just to GitHub. There are a lot of websites that are worth looking into, for example GitLab, DockerHub, Postman workspaces, Replit, Bitbucket, Pastebin and etc...

Try them all and do your recon and research twice before moving on. Remember, it's always about consistency and the bugs will come sooner or later. I just wanted to share what came to my mind in this article, so I hope you liked it guys.

Thanks for reading. Don't forget to follow me here:

LinkedIn: [anas_hmaidy](https://www.linkedin.com/in/anas-hmaidy/)

X: [anasbetis023](https://x.com/anasbetis023)

Join my telegram channel: [anas_hmaidy](https://t.me/anas_hmaidy)

YouTube: [@anashamidii](https://www.youtube.com/@anashamidii)

**Cheers :)**
