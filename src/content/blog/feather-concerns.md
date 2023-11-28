---
title: FeatherMC Concerns
author: MMPA Administration Team
pubDatetime: 2023-11-28T20:16:48.371Z
postSlug: feathermc-concerns
featured: true
draft: false
tags:
  - vuln
description: In this blog post, we talk about the recent security concerns we have found in Feather Client, alongside the Feather teams (fast) but incompetent response. Please read through this entire thing if you have at any point used Feather Client. 
ogImage: "reports/feather.png"
---

# FeatherMC Concerns

In this blog post, we will talk about the recent security concerns we found in [Feather Client](https://feathermc.com). While these concerns aren't major, they are still unacceptable for a Minecraft client with over 1.1 million users.

## TOS Concerns

During our investigation of Feather Client, we reverse-engineered their client to find potential security vulnerabilities.

Which is... against their [TOS](https://feathermc.com/terms)?
![FeatherMC TOS saying "You may not reverse engineer, disassemble, or decompile any prototypes, software, or other tangible objects of our website and services."](https://hackmd.io/_uploads/HklpZI546.png)

This is the standard clause companies add to their TOS to scare away people interested in reversing their software.

In most regions, reverse engineering is considered a legal way to acquire code in a program to figure out non-patented technology, so this clause is overall pretty useless. 

## The First Findings

These issues were found very early in our investigation. 

### Dumping User Information

This vulnerability is the most major we'll be discussing. While we were reverse-engineering their client, we came across one of their online services.

![Endpoint class of Feather Client, decompiled with Vineflower](https://hackmd.io/_uploads/S1dINUqEp.png)

This, seemingly was a list of endpoints for their API. The account search endpoint stood out to us, so we simply sent a request to it:

```bash
curl -X POST https://api.feathermc.com/v1/minecraft/account-search
```

After a few seconds of waiting, we were greeted by this pretty horrifying response.

```json 
{
	"total": 1161208,
	"results": [
		{
			"id": "91a2e3b7-7a90-4a34-a199-a032909f54a5",
			"mcID": "51ff32a8-0234-4ee1-8715-cdc0182aa4d2",
			"registeredAt": "2021-08-23T06:56:30.218Z"
			"mcUsername": "________0______",
			"username": null,
			"email": null,
			"firstName": null,
			"lastName": null, // These seem to *always* be null. No personal data was leaked.
			"status": "offline",
			"location": null
        }
        ....
    ]
} 
```

Just like that, we had access to the Minecraft names, IDs, online statuses, and locations (current servers, including private ones) of all of their over 1.1 million users.

There were also fields for an `email` and `password`, however, they were all null in every instance we could find. We have no reason to believe that any personal info was published.

We also tried looking for an instance where the `location` field wasn't null, and we quickly found out that the `location` field was the current server the user was on.

This is used in-game for the friends system, but as long as the user has not changed their privacy settings, this is accessible to anyone.

**Current status:** Feather has mitigated this issue by requiring a filter (UUID, Username, or Feather ID) to be provided to find this information. You cannot request all users anymore, but the endpoint still doesn't check who you are or if you're supposed to be able to access this information. It also isn't fully patched, see below.

### Unencrypted Communication

The second thing we noticed is that Feather sends unencrypted authentication over the wire for their real-time communication system called Redstone. 

This means that any attacker that has access to any part of your connection can drop into your connection and authenticate as you in Feather.

This is generally not a problem, however, if Feather's servers get hijacked, the malicious actor could log in as any user using Feather (MITM attack).

**Current status:** Unpatched, Feather has expressed a minor interest in fixing this. They do not have any plans to do so at the moment.

### Insider Threat

Feather decides if a user owns a Minecraft account by using the normal Minecraft login authentication flow which involves the client sending a request to a Mojang server, providing both a server ID and the user's access token (Session ID).

Feather takes advantage of this by making the client send a request to Mojang with a Server ID Feather knows and provides, and then the client sends a request back to Feather, saying that the client has done it, along with the username of who they are claiming to be. Then Feather's servers request Mojang with the Server ID and username to see if the client request was valid, if so, accept them in.

This is an implementation detail issue, but as an implementation detail, feather's servers completely have control of the Server ID the client joins, meaning they can spoof a server they want to join as the user (eg. hypixel.net)'s server ID, send that to the client, and then they are logged in!

This can be fixed by having a prefix appended to the Server ID **in the client code**, so there's no way this happening.

**Current status:** Unpatched, Feather does not think this is that big of an issue.

### P2P Mentions in the Code

We found several mentions of P2P and a whole P2P Peer implementation in Redstone, we couldn't find out what exactly this was for, and we assumed voice.

However, we were wrong and the Feather Team confirmed that this was an unreleased feature like the [Essential](https://essential.gg) server sharing, and it was scrapped due to the large burden required to do it.

## Feather's First Response

Due to previous contact with the Feather team, they responded extremely quickly (within the hour!) and were experienced in the codebase. They mitigated the vulnerability they thought was most important (all) via a rate limit at first, and then a proper patch second.

The other issues they considered non-critical.


## The Second Wave

After the initial response, we were meant to be done there, but we continued and realized that many things were broken.

### Holes in Feather's Response

![image](https://hackmd.io/_uploads/HksrwLXST.png)

This was Feather's initial response. They addressed many of our concerns but notably mentioned that the Server IP leak can be mitigated by a privacy setting per user.

#### Server IP Leak Bypass

We quickly realized the friends-only setting in the Privacy Settings... well, does nothing. To put it simply, we could still access your Server IP even if you had that setting on.

![image](https://hackmd.io/_uploads/rkSluUXBp.png)

The other solution they gave to this was to change your Feather status to invisible, which we don't think is a valid solution at all.

#### Dumping All Users

We quickly realized that the patch they made for dumping all users was insufficient, cause we discovered an extra parameter called `email`, which even if it's an array of some bogus, returns all users.

  They quickly patched this one without us even reporting it, probably because every request took several seconds even with the `limit` set to `1`.

Then we realized the existence of `partialUsername` which allows us to search via a partial username. While this isn't as easy to scrape as the first, it's still pretty easy.

But turns out, that didn't matter at all, because we found a second bypass to their patches. With `partialUsername` set to `%%%` it still leaks *all* users!

This was also patched, but while patching it, they broke the entire social system in their client. **Which, at the time of writing, is still not fixed.**

This is evidenced by posts in their discord:

![image](https://hackmd.io/_uploads/HkydnuXHT.png)

This is because their patch to `partialUsername` was to remove it, which broke the in-game friending and search functionality.

### Dumping Users Social List

While this isn't exactly private information, we couldn't see it being used anywhere, but the endpoint `/social/list/<uuid>` allows us to see a user socials: (Update: Feather said that this was intentionally public)

```json
[
	{
		"id": "129318072677826560",
		"username": "brend4n#0",
		"platform": "discord"
	},
	{
		"id": "UCVHdZwrQ5G9gsPC_fr9hcMg",
		"username": "Feather Client",
		"platform": "youtube"
	},
	{
		"id": "1364386047585525761",
		"username": "Feather_Client",
		"platform": "twitter"
	},
	{
		"id": "49798377",
		"username": "Brend4n",
		"platform": "twitch"
	}
]
```

### Feather's Tracking

Feather was tracking lots more than we thought originally, their Redstone services were sending plaintext data about a user, this data included:

- System Info
  - Computer Name
  - CPU Cores
  - Maximum Memory (in MB)
  - CPU Info
  - Graphics Card
- MC Version
- Mods
  - Mod Name
- Resource Packs
  - Pack ID
- Enabled Feather Modules
  - Slug (ID)
- Server Joins
  - IP, Port
- Server Leaves
  - IP, Port

The server joins and server leaves are still sent, if you turn off the send location in your privacy settings.

### GDPR Concerns

When an external party messaged about GDPR concerns, this was their response:

![Feather representative saying "Hello, All the information that we collect is on our privacy policy. About the right to be forgotten, we do not collect any sensitive personal information. Additionally, IP address and Minecraft account UUID are not considered personal information as it is not linked to any identity. See: generic GDPR information link"](https://hackmd.io/_uploads/B1P-nUXrp.png)

As seen above, this is **not** the only data they collect, though to be fair, it is a pretty exhaustive list.

The disregard for what data is personal information is concerning, considering these tracking features cannot be turned off.

They also state that they collect this data in the privacy policy, but as seen, in the reply they do not acknowledge the collection of this data, sort of slipping it under the rug.
![Data collection clause in https://feathermc.com/privacy/](https://hackmd.io/_uploads/S1Jv6UQBp.png)

This, notably does not include the collection of the Computer Name, which could be argued to be identifiable to a user.
<!-- oh god, GDPR :kekw: -->

### Confusing Code

There are about 20 different logging formats used in the code, which indicates either a lack of organization or copied code.

Exhibit A:

!["[Feather <feature>]" logging](https://hackmd.io/_uploads/rkEjNPXBT.png)

Exhibit B:

!["ClassName.java" logging](https://hackmd.io/_uploads/HJUq0vXHT.png)

Exhibit C:

![Rust style "[Feather::FeatureName]" logging](https://hackmd.io/_uploads/BkkJ1O7rT.png)


#### Feather did not reply to a request for comment.


## Conclusion

We would've liked to not see such an easy and kind of major set of problems in Feather, however, their response was quick and knowledgable. They expressed interest in future cooperation, and reaffirmed they do not believe any sensitive info was leaked as part of any of this.

However, their API reveals a constant lack of testing, as well as hiding information from the user. While this may be considered "normal for clients"... that doesn't fly here, in a community of open modding.


## Further Reverse Engineering Projects

If you are skilled in Java reverse engineering or have significant credentials, [please apply](https://tally.so/r/nWRV5J) if you are interested. 

If you have any questions, [send us an email](mailto:contact@mmpa.info).

# Credits

- [xyzeva](https://kibty.town): Research and Writing
- [Honbra](https://honbra.com): Research and Writing
- [slonkazoid](https://gitlab.com/slonkazoid): Research