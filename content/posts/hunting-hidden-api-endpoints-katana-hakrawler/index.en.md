---
title: "Hunting for Hidden API Endpoints Using Katana and Hakrawler"
date: 2024-09-09
draft: false
description: "Crawling a target I thought I knew — with Katana, hakrawler, waybackurls, and unfurl — surfaced a hidden /HelpApi/ endpoint and an IDOR leaking users' PII."
title_de: "Versteckte API-Endpunkte finden mit Katana und Hakrawler"
description_de: "Ein Ziel neu gecrawlt, das ich zu kennen glaubte — mit Katana, hakrawler, waybackurls und unfurl — und dabei einen versteckten /HelpApi/-Endpunkt sowie eine IDOR mit Nutzerdaten gefunden."
tags: ["bug-bounty", "recon", "idor", "api", "web-security"]
image: "cover.jpg"
---

Good day! I hope you're doing well.

In bug bounty, never say: *"This idea is silly to try; the result will be nothing."* Bug bounty hunting is essentially black-box testing — you have to keep poking at your target until something turns up.

الحمدلله والصلاة والسلام على سيدنا محمد
اللهم انصر إخواننا في فلسطين

The target I was hunting already had several bugs I'd found and reported before. I used to tell myself, *"I know everything about this website. If something new appears, I'll spot it."*

Then I watched [Hussein Daher's talk](https://youtu.be/vFk0XtHfuSg), where he mentioned he relies heavily on [**Katana**](https://github.com/projectdiscovery/katana) to crawl websites.

> Web crawling, in the context of bug bounty, is the process of automatically navigating a website's structure to discover resources such as pages, files, and scripts — by following links and examining directories to build a map of the site's content.

I was initially refusing to use it on this program, thinking *"It'll be useless — I already know all the URLs."* But I decided to give it a try, alongside another great tool: [**hakrawler**](https://github.com/hakluke/hakrawler) by **hakluke**.

First, I grabbed the archived URLs:

```bash
echo "http://target.com" | waybackurls | anew urls.txt
```

That gave me about **71,000** URLs.

![waybackurls output — around 71,000 URLs](01-waybackurls.png)

Then I ran all of them through Katana and hakrawler:

```bash
cat urls.txt | katana | hakrawler -d 3 | anew katana.txt
```

Katana has a lot of useful options, but since I was new to it I just ran it as-is. The `-d` flag in hakrawler sets the crawl depth (default is 2).

I left it running for about two days and ended up with **41,000** URLs in `katana.txt`.

![katana.txt — around 41,000 URLs](02-katana.png)

A lot of these were unique in their paths but not in their subdomains, for example:

```
https://sub1.target.com/account
https://sub2.target.com/account
```

I only wanted unique **paths**, so I used [**unfurl**](https://github.com/tomnomnom/unfurl) by Tomnomnom to filter them:

```bash
cat katana.txt urls.txt | unfurl format %p | anew paths.txt
```

That left me with around **5,500** unique paths. unfurl can also pull out subdomains, so I grabbed the unique ones too:

```bash
cat katana.txt urls.txt | unfurl format %d | anew subs.txt
```

Going through `paths.txt`, I initially found nothing new — every path looked familiar. But I was wrong. One path caught my eye that I'd never seen before:

```
/HelpApi/
```

Opening it on the main domain (`target.com/HelpApi/`) returned the **full API documentation** for the website.

![Exposed /HelpApi/ documentation](03-helpapi.png)

Now I had plenty to explore. One endpoint stood out:

```
/account/subscribe?groupId=123
```

I could smell an IDOR. The request returned the users in group `123` — and by changing the `groupId`, I could read users from other groups. The exposed data included email addresses, roles, phone numbers, and other private information.

I reported it as a PII (Personally Identifiable Information) disclosure. Alhamdulillah, it was triaged the next day, fixed, and rewarded.

![Report triaged and rewarded](04-reward.png)

I hope you enjoyed this one. Yes, it's a simple bug — but it came after a couple of days of recon. Huge thanks to [Hussein Daher](https://x.com/HusseiN98D) for his talk; I highly recommend watching it.

Thanks for reading. Cheers :)
