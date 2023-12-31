---
title: 'Gas Auth: Gaslighting the masses to take over their accounts'
author: MMPA Administration Team
pubDatetime: 2023-07-30T17:37:20Z
postSlug: gasauth
featured: true
draft: false
tags:
  - vuln
  - threat
description: Poor documentation of OAuth scopes leads to full account access.
---

## TL;DR

Due to incorrect wording in Microsoft's OAuth consent screen, a service that claims to be accessing basic information can instead gain permanent access to your Minecraft account. We highly recommend visiting https://account.live.com/consent/Manage and revoking access to unfamiliar or obsolete connections.

## The Issue

This is a rather simple wording issue. In the OAuth scope for Microsoft permissions, Microsoft is understating how much information applications are given when connecting your account to a service.

### Let's explain what the consent screen says, versus what it does.
- Access your Xbox Live profile information and associated data, and sign you into its services as your Xbox Live profile information and associated data, and sign you into its services
  - This is not the full story. By giving an application this permission, it also allows full access for the application to grab your access token, and thus log into the game as you.
- Maintain access to data you have given the app access to
  - This is an important one. Without this, the app can only create access tokens for up to 48 hours before being kicked out. With this, it can indefinitely pose as you until you revoke access, which Microsoft seems to hide behind many prompts.



### (In this, we will be using MultiMC as an example. The real MultiMC is safe, but the attacker can name the malicious app anything, including reusing name of a safe app! Do not assume because there is a trusted name that it is by a trusted developer.)
![Microsoft OAuth Prompt](https://cdn.discordapp.com/attachments/1124494549574758531/1135256504988074124/SyVBme4o2.png)

This can be **very dangerous if you accept this prompt even once**, as the access tokens will not get revoked until 48 hours pass. You currently cannot do anything to revoke them, other than wait 48 hours.

## Mitigation

Mitigation of this attack is completely up to the user until Microsoft releases a fix.

### Do not give access to "basic Xbox Live information" unless you trust the application.

If you believe you have done so in the past, please confirm that the apps you've given access to are trustworthy and are related to services you actively use: https://account.live.com/consent/Manage

## Official Solutions

There is no official solution from Microsoft at the time of this blog post, and we are not expecting one anytime soon due to Microsoft's continued ignorance of this issue.

## Usages of OAuth phishing in the wild

We have generally seen it being used in the Hypixel Skyblock community, with the intent of stealing user's accounts for in-game currency or rare items. Other notable usages are; 
- The OG name community (due to Minecraft access tokens being capable of changing usernames)
- Doxxing and extortion (due to access tokens being capable of leaking a user's private information through Xbox Live)
- Minecraft servers that "require verification" to play
- Discord giveaway servers that "require Minecraft verification" to join

## How you can report these malicious apps

- Go to the official report form by going to https://aka.ms/mce-reviewappid
- Select `Existing AppID for Review/Report` for the request type
- Find the page where it asks you to authorize the app and use the name shown there (usually some impersonation of Discord/Minecraft/Hypixel/whatever)
- Find the application's ID:
  - to do this, look at the URL: https://login\.live\.com/oauth20_authorize\.srf?client_id=**f0376527-21d0-4bff-8fe0-88a20e9886f4**&response_type=code&scope=XboxLive\.signin%20offline_access&state=...
  - `client_id=` is what you're looking for (example above)
- You can leave the tenant ID empty.
- If the scam came from a Discord server, enter the link under `associated website or domain`, or otherwise link to the website that asks you to authorize.
- You can use `Gathering user account credentials and exporting them to a non-Microsoft platform.` as justification
- Under the "any other information" section, you can add the following:
  - If the link was using a shortened link (like bitly) provide an unshortened version
  - Where the link came from (in-game, from a discord, or from a website?)
  - A link to a screenshot of the link being distributed

## Message for Microsoft

Please change the Xbox Live scope descriptions. Add a **very clear** warning that this scope can be used to obtain access tokens.

Revoke access tokens generated by an app when access has been revoked from said app and revoke the tokens when a password is reset. As it currently stands, users are giving up access to their accounts for at least 48 hours, even if you immediately revoke access from the malicious app.

## Initial Timeline
Please note that all timestamps are based on GMT+10, an Australian timezone.

*On the 28th of July 2022,*

A user going by the name of "ChiefChippy2" (We will refer to them as Chippy) contacted Ada and Gildfesh (the developers of [Nodus](https://nodus.gg)) to discuss this exploit and ask how it should be handled. Chippy was told to report it to Mojang.

![Chippy messaging Ada](https://toaster.sh/i/m8u40jno.png)

Later that day, Chippy created a ticket through Microsoft's bug tracker, Mojira, explaining the issue. The private Mojira ticket's ID is `WEB-6006`.

A week after the ticket's creation, Chippy alerted a Mojang employee about the ticket through the SaveMC Discord server, in a channel that the employee was frequently active in.

![](https://cdn.discordapp.com/attachments/1124494549574758531/1135256546423619594/SyeTpq-4i3.png)

--------------------------------------
*By December 10, 2022*

Attackers had started using this issue in the wild, mainly in the Hypixel Skyblock community. An update had yet to be received from Microsoft on this matter.

-------------------------------------- 
*On December 28, 2022*

The YouTube channel No Text To Speech made a video [about the issue](https://youtu.be/uHKhSFc9RqA).

--------------------------------------

*On March 14th, 2023*

As it began approaching a year since the issue first emerged and Mojang still hadn't acknowledged the issue, Gildfesh made the decision to further pressure Microsoft into fixing the issue.

Gildfesh obtained permission from the [YouTuber LiveOverflow](https://www.youtube.com/@LiveOverflow) to demonstrate the exploit on him, as part of LiveOverflow's Hacking Minecraft series.

A successful attempt done on LiveOverflow's account by the Nodus team can be viewed here;
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Uf2EPT3AGkw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


--------------------------------------
*On April 3rd, 2023*

LiveOverflow contacted Microsoft Security Response Center (MSRC) after seeing the extent of the issue and having it used against him. The MSRC case number is `VULN-097281` (This would later be updated to `MSRC-78760`)

![](https://cdn.discordapp.com/attachments/1124494549574758531/1135256570834468974/image.png)

--------------------------------------
*On April 18th, 2023*

LiveOverflow received this from the MSRC team, saying they confirmed the issue and are discussing how to fix it.

!["still waiting btw" with the attached screenshot](https://cdn.discordapp.com/attachments/1124494549574758531/1135256585707470888/image.png)

--------------------------------------
*On June 1st, 2023*

[Mojang announced changes to the Game Service APIs.](https://help.minecraft.net/hc/en-us/articles/16254801392141) Due to these changes, a manual review was required for future API usage. Apps that were already setup with the old system would continue to function as normal. If you wanted to create a new phishing app, you would have to try and get through whatever the manual review process is by lying about your intent.

--------------------------------------
*On July 30th, 2023*

TheMisterEpic released a video [informing his audience of the issue](https://www.youtube.com/watch?v=4t92Wlu5a3s) with help from the Nodus team.

After this video, MMPA deemed the issue as declassified and decided it was better to inform the users instead of waiting for a patch, which led to the release of this blog post.

## Credits

- ChiefChippy2 (For initial discovery and report)
- [Nodus](https://nodus.gg) (For notifying us about this and their continued effort to fix the issue)
- No Text To Speech (For reporting on this issue)
- TheMisterEpic (For reporting on this issue)
- xyzeva - (Writing the blog post)
- IMS12 - (Writing the blog post)
- chorb (Proofreading and revisions)
- [LiveOverflow](https://www.youtube.com/@LiveOverflow) (Publicity)


## Bloopers

- "for this version of gaslight, you steal the victim's account then send a rule breaking message as them on your server. you can report this message to mojang to have their account banned" - Gildfesh
- "GasAuth :yortfuckinhaw:" - IMS
- "Changed Gildfesh to Goldfish" - Google Docs (we didnt actually use google docs, it was just a spellcheck)
- are you sure it isnt your dialup internet setting the quality to minimum when you try to play it - eva
- you are a compression issue - eva

### Crowd Favorite

> OH MY FUCKING GOD
> @eva
> the moment we polish this up
> the site to fix this
> HAS WENT DOWN @Gildfesh
> @Ada
> https://account.live.com/consent/Manage
> THE CONSENT SITE IS DOWN

\- IMS, 2023
