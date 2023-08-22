---
title: 'WeirdUtils: Advanced SkyBlock Malware'
author: MMPA Administration Team
pubDatetime: 2023-08-22T16:02:58.844Z
postSlug: weirdutils
featured: true
draft: false
tags:
  - threat
description: "What's a lets encrypt? Let's figure it out together.."
---

# WeirdUtils

WeirdUtils is a family of advanced malware mainly targetting players of [Hypixel's SkyBlock gamemode](https://wiki.hypixel.net/Introduction) (**THAT DOES NOT MEAN ITS *ONLY* TARGETING SKYBLOCK**). A minimum of 5,000 people have installed files infected with WeirdUtils over the span of two years. At the time of this blog post's release, WeirdUtils is not detectable by major antiviruses. The known mods are impersonating open source, or closed source projects, and adding malware.

*Documentation in progress, nothing is finalised*

# For users

## TL;DR

We have found mods that use a multi-stage process to infect users with WeirdUtils. First, an encrypted Pastebin file is loaded. This is decrypted into a url used to download a JAR file that, when decrypted (twice) contains code to steal passwords/tokens from the following sources:
- Google Chrome
- Opera
- Discord Stable
- Discord Canary
- The currently running instance of Minecraft

**The current version of the malware has been disarmed by Pastebin on August 19, 2023, at 9:08 pm CDT, and stage 3 was disarmed by GitHub sometime on August 21, 2023. The malware developers may release updates to reupload them, however.**

## How do I know if I have been infected?

You can use our detection tool [UtilsDetector](https://github.com/Minecraft-Malware-Prevention-Alliance/UtilsDetector/releases/latest) to detect if you have any infected jar files on your machine. As this malware does not spread, there should not be that many infected files.

Updated versions of the malware may not be detected by any tool; be safe.

## I'm infected. Help!

If you have found out that you were/are infected, assume all accounts saved in browsers, along with your Discord account and Minecraft account, are compromised.

Make sure the malware is completely removed from your system, after submitting the jar via the detector tool.

Change the passwords for all of these accounts, along with any other accounts using the same or similar passwords.

# Timeline of Events
All times listed below are in GMT.

### Saturday, August 19th

***17:56***
TirelessTraveler discovers the WeirdUtils malware family.

***20:29***
TirelessTraveler sends a private message to Heather about WeirdUtils. TirelessTraveler also sends a [message](https://ptb.discord.com/channels/1115852272245686334/1116452145068257392/1142550877027176648) in the #general channel of MMPA's  [Discord server](https://discord.gg/NTUj5VNUsU).

***21:00***
Heather begins an investigation into how WeirdUtils functions.

***21:23***
The Pastebin URL that WeirdUtils grabs from is decrypted. Investigation into the contents begins.

***21:40***
Heather fully decrypts and decompiles WeirdUtils' payload. The findings are reported to TirelessTraveler.

***21:49***
A thread titled "WeirdUtils" is created in the internal #malware-discussion Discord forum with TirelessTraveler present.

***21:51***
Eva sends a private message to Heather, redirecting all future findings to the forum thread.

***22:15***
Representatives for both Curseforge and Modrinth are pinged in the thread, with hopes of removing any samples that may be present on their websites. Luckily, we were unable to find any instances of WeirdUtils on either platform.

***22:17***
A HackMD page is created to document all information. This later turned into the blog post you are now reading.

***22:51***
IMS reports the accounts of both malware developers to GitHub and the paste to PasteBin.

### Sunday, August 20th

***13:58***
Eva sends an [email](https://media.discordapp.net/attachments/1142575996034371738/1142820109828759632/image.png?width=1440&height=548) to Pastebin admins about the malicious paste. Taking down the pastebin would immobilize the malware, at least until the malware developers update. 

***14:08***
Pastebin admins [delete](https://media.discordapp.net/attachments/1142575996034371738/1142824309417582694/image.png?width=1440&height=181) the malicious paste.

***19:58***
Eva finishes coding UtilsDetector.

### Tuesday, August 22nd

***~14:38***
IMS was notified both of the GitHub pages were taken down.

# Technical Details

## Ingredients

- One tablespoon of script kiddie
- 1mg of hacky CA stuff
- 2mg of GitHub C2s
- 1 tablespoon of Pastebin

No, seriously.

It starts with `org/spongepowered/tools/obfuscation/ObfuscatedClassloader`.
This class is very lightly obfuscated, but I'll spare you the details.

Then, it tries to download `https://pastebin.com/raw/4LhnDCtf`. The contents of this were actually AES-encrypted data, which, when decrypted, turns into the actual payload.

The decryption flow uses `AES/CBC/NOPADDING` the actual key for this encryption... is the class bytecode. This creates a kind of trust chain, so a researcher that doesn't have the initial payload cannot decrypt the URL.

After this, we get a GitHub URL `https://github.com/ultra-weird-owo/a` with the payload jarfile, which is then decrypted.
The classes are then decrypted again and loaded with a class loader, and the `Updater` class with the `update` method is invoked.

This method then does the following things;

- Collect Discord tokens at the default paths of Discord & Discord Canary for Windows
- Collect Chrome passwords at the default paths of Chrome for Windows
- Collect Opera passwords at the default paths of Opera for Windows
- Collect your operating system name
- Collect your Minecraft session tokens and UUID 

All of this information is sent to `https://owouwu.tk`.

Due to many factors, the browser and Discord stealing only works on Windows. Minecraft session stealing works on all systems.

## The malware's decompiled code

All versions of the end payload have been decrypted and decompiled. A rundown of the commit history alongside decompiled payloads can be found [here](https://gist.github.com/MommyHeather/1dc0fc8ded2265b57b5ba7fe0f6b7a42).

## Addendum: "What's a LetsEncrypt"

Some suspicious code was found in the malware that seems to load files into a trust store. Weirdly, this code was named `whyTFDoesLetsEncryptNotWork`, and downloaded a PEM file + messed with X.509.

This ended up being an amateur understanding of Java 8 by the malware developer that was bypassed with sample code and a hosted PEM file on an alt account on [GitHub](https://raw.githubusercontent.com/ultra-weird-owo/a/main/a.pem).

The core reason for this weird naming is likely because the malware worked without this code... until it didn't. The reason why it didn't work was because the Java version Minecraft 1.8 (the version most SkyBlock users play on) provided via the default launcher does not actually support the current Let's Encrypt certificates, and newer Java versions (which the dev used) updated to support this! So in the end, what looked like a weird workaround ended up being bad understanding of Java certificates.

# Contact

If you know anything about WeirdUtils or want to contact us for general concerns, you can do so via [Discord](https://discord.gg/NTUj5VNUsU), or anonymously over email @ [contact@mmpa.info](mailto:contact@mmpa.info).

# Credits

- TirelessTraveler for the initial report and extensive help!
- Heather (`mommyraven` on Discord), for reverse engineering the stages
- [Eva](https://github.com/xyzeva) for some reverse engineering, writing the blog post and the malware scanner/detector.
- chorb for writing the blog post and gathering information
- IMS for writing the blog post and moral support

# Bloopers


- "can we make a uptime status for your internet" - eva
- "i am going to triangulate your exact location by knowing when your power cuts off" - eva
- ![Every pc is a donor pc](https://cdn.discordapp.com/attachments/1116509347984441445/1143038088692645918/image.png)
- We cookin - Col-E
- @Col-E just forcepushed, feeling good - eva
- I'm not a War Thunder player - Col-E
- You're gonna get a CLI and you're gonna like it ✊ 💢 - Col-E
- whats a yara? - Heather
- ![built the wrong repo](https://cdn.discordapp.com/attachments/1142575996034371738/1143550187260891186/image.png) - eva