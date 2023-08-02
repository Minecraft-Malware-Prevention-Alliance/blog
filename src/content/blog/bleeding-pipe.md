---
title: 'Bleeding Pipe: A RCE vulnerability exploited in the wild'
author: MMPA Administration Team
pubDatetime: 2023-07-29T18:21:32.743Z
postSlug: bleeding-pipe
featured: true
draft: false
tags:
  - threat
  - vuln
description: A new vulnerability in LogisticsPipes and other mods allowing RCE on clients and servers.
---

*This article will be updated with more information as it develops.*

## We recommend that you take this seriously.

This vulnerability has already been exploited many times and many 1.7.10/1.12.2 modpacks are vulnerable, however any other version of Minecraft can be affected if an affected mod is installed.

This vulnerability can spread past the server to infect any clients that might join, though we do not know if there is any such malware in the wild.

# Introduction

BleedingPipe is an exploit being used in the wild allowing **FULL** remote code execution on clients and servers running popular Minecraft mods on 1.7.10/1.12.2 Forge (other versions could also be affected), alongside some other mods. Use of the BleedingPipe exploit has already been observed on unsuspecting servers.

This is a vulnerability in mods using unsafe deserialization code, not in Forge itself.

# Known Affected Mods

The known affected mods include, but are not limited to:

- EnderCore (dependency of EnderIO). The GT New Horizons fork has been fixed, and the original has been aswell, but EnderIO's minimum versions has not yet been updated.
- LogisticsPipes. This has once again been fixed in GT New Horizons version as of July 25, 2023, and the original is fixed since version 0.10.0.71. MC 1.12 versions are not affected. If you have played on a server with a vulnerable version, assume you are infected.
- The 1.7-1.12 versions of BDLib. Both the GTNH fork and the original have been fixed as of August 1, update your versions.
- [Smart Moving 1.12](https://www.curseforge.com/minecraft/mc-mods/smart-moving-1-12-2)
- [Brazier](https://www.curseforge.com/minecraft/mc-mods/brazier)
- [DankNull](https://www.curseforge.com/minecraft/mc-mods/dank-null)
- [Gadomancy](https://legacy.curseforge.com/minecraft/mc-mods/gadomancy)

## Initial Discovery
To begin; this vulnerability is well known in the Java community, and has been fixed before in other mods, such as RebornCore. This exploit is generally referred to as a deserialization attack/gadget chain, and there are many exploited cases, however none have been of this scale in the Minecraft community.

The first hints of this exploit in this specific list of mods go back all the way to March 2022, when [this](https://github.com/bdew-minecraft/bdlib/issues/57) issue was posted on BDLib's GitHub hinting at a vulnerability in `ObjectInputStream`. The GTNH team promptly merged a fix into their fork.

After this, the issue became quiet for a while, until [MineYourMind](https://mineyourmind.net) posted about a vulnerability on their [Enigmatica 2 Expert](https://www.curseforge.com/minecraft/modpacks/enigmatica2expert) server.

On July 9, 2023, a [Forge forum post](https://forums.minecraftforge.net/topic/124918-potential-rce-zero-day-exploit-targeting-forge-142352860-1122/) was made about a RCE happening live on a server, managing to compromise the server and send the discord credentials of clients, indicating the spread to clients. The issue was nailed down to 3 mods; EnderCore, BDLib, and LogisticsPipes. However, this post did not go mainstream, and most were not aware.

On July 24, 2023, MineYourMind suddenly announced they had "fixed" the bug and will be working with the devs to make patches. No other info was published.
![Message in MineYourMind's announcement channel alerting people of the exploit.](https://cdn.discordapp.com/attachments/1133934284034556017/1133935398612115456/image.png)

After this series of announcements, the vulnerability was promptly patched in the rest of GTNH's forks, but it is still present in most servers with these mods, as well as the original versions of these mods.

## Mass Exploitation

After the initial discovery, we discovered that a bad actor scanned all Minecraft servers on the IPv4 address space to mass-exploit vulnerable servers. A likely malicious payload was then deployed onto all affected servers.

We do not know what the contents of the exploit were or if it was used to exploit other clients, although this is very much possible with the exploit.

## What should I do?

As we do not know the contents of the payload being sent to the vulnerable servers, there is no concrete way of detecting this attack. There are still a few potential methods for detection listed below.

### As a server admin

As a server admin, we recommend checking for suspicious files in your server and updating/removing the mods affected by this vulnerabiilty. 

Malware targeting servers tends to infect other mods on the system once they get a target, so we recommend running something like [jSus](https://github.com/NeRdTheNed/jSus) or [jNeedle](https://github.com/KosmX/jneedle) on all installed mods.

### As a player

**As a player if you don't play on servers, you are not affected.**

As a player, we recommend checking for suspicious files, doing an antivirus scan, and doing a scan on your `.minecraft` directory with something like [jSus](https://github.com/NeRdTheNed/jSus) or [jNeedle](https://github.com/KosmX/jneedle). Note that mod files are stored in a different directory when using a modded launcher such as Curseforge. These files can typically be accessed by right-clicking the modpack instance and clicking "Open Folder"

### Mitigation

If you have EnderIO, BDlib, or LogisticsPipes, update to the latest versions on CurseForge.

To mitigate all mods generally, you can install our mod [PipeBlocker](https://modrinth.com/mod/pipeblocker) on both forge servers and clients. We also recommend updating LogisticsPipes and all of your other mods to the newest versions available. Note that pre-made modpacks may become unstable or otherwise break by updating all mods. 

If you are a mod developer and use `ObjectInputStream`, unless you know what you are doing, you are recommended to switch to another safe serializer or make your own.

## Technical Details

The bug is a well known issue with deserialization using `ObjectInputStream`. The mods affected used OIS for networking code, and this allowed packets with malicious serialization to be sent. This allows anything to be run on the server, which then can be used on the server to do the same thing to all clients, therefore infecting all clients with the server in reverse.

If you have any information on BleedingPipe, you can join the [MMPA Discord](https://discord.gg/zPdFK47682), or contact us anonymously at contact@mmpa.info.
