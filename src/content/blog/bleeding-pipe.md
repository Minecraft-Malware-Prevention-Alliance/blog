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

This vulnerability has already been exploited many times and many 1.7.10/1.12.2 modpacks are vulnerable.

This vulnerability can spread past the server to infect any clients that might join, though we do not know if the activity we have observed does that.

# Introduction

BleedingPipe is an exploit being used in the wild allowing **FULL** remote code execution on clients and servers running popular Minecraft mods on 1.7.10/1.12.2 Forge (its mainly those versions, other versions are affected.), alongside some other mods. Use of the BleedingPipe exploit has already been observed on unsuspecting servers.

This is a vulnerability in mods using unsafe deserialization code, not in Forge itself.

# Known Affected Mods

The known affected mods include, but are not limited to:

- EnderCore (dependency of EnderIO). The GH New Horizons fork has been fixed, and the original has been aswell, but EnderIO's minimum versions has not yet been updated.
- LogisticsPipes. This has once again been fixed in the GH New Horizons fork as of July 25, 2023, but not upstream. If you have played on a server with this mod, assume you are infected.
- The 1.7-1.12 versions of BDLib. Once again, GTNH fork has this fixed, but the developer of the original has [no intention](https://github.com/bdew-minecraft/bdlib/issues/57) of fixing it. Assume you are infected if you have played on a server and are not on the GTNH fork.
- [Smart Moving 1.12](https://www.curseforge.com/minecraft/mc-mods/smart-moving-1-12-2)
- [Brazier](https://www.curseforge.com/minecraft/mc-mods/brazier)

## Initial Discovery

The first hints of such an issue go back all the way to March 2022, when [this](https://github.com/bdew-minecraft/bdlib/issues/57) issue was posted on BDLib's GitHub hinting at a vulnerability in `ObjectInputStream`. The GTNH team promptly merged a fix into their fork.

On July 9, 2023, a [Forge forum post](https://forums.minecraftforge.net/topic/124918-potential-rce-zero-day-exploit-targeting-forge-142352860-1122/) was made about a RCE happening live on a server, managing to compromise the server and send the discord credentials of clients, indicating the spread to clients. The issue was nailed down to 3 mods; EnderCore, BDLib, and LogisticsPipes. However, this post did not go mainstream, and most were not aware.

After this, the issue became quiet for a while, until [MineYourMind](https://mineyourmind.net) posted about a vulnerability on their [Enigmatica 2 Expert](https://www.curseforge.com/minecraft/modpacks/enigmatica2expert) server.

![Message in MineYourMind's announcement channel alerting people of the exploit.](https://cdn.discordapp.com/attachments/1133934284034556017/1133935398612115456/image.png)

After this series of announcements, the vulnerability was promptly patched in the rest of GTNH's forks, but it is still present in most servers with these mods, as well as the original versions of these mods.

## Mass-Exploitation

After the initial discovery, we discovered that a bad actor scanned all Minecraft servers on the IPv4 address space to mass-exploit vulnerable servers. A likely malicious payload was then deployed onto all affected servers.

We do not know what the contents of the exploit were or if it was used to exploit other clients, although this is very much possible with the exploit.

## What should I do?

As we do not know the contents of the payload being sent to the vulnerable servers, there is no concrete way of detecting this attack. There are still a few potential methods for detection listed below.

### As a server admin

As a server admin, we recommend checking for suspicious files in your server and updating/removing the mods affected by this vulnerabiilty. 

Malware targeting servers tends to infect other mods on the system once they get a target, so we recommend running something like [jSus](https://github.com/NeRdTheNed/jSus) or [jNeedle](https://github.com/KosmX/jneedle) on all installed mods.

### As a player

**As a player if you dont play on servers, you are not affected**

As a player, we recommend checking for suspicious files, doing an antivirus scan, and doing a scan on your `.minecraft` directory with something like [jSus](https://github.com/NeRdTheNed/jSus) or [jNeedle](https://github.com/KosmX/jneedle). Note that mod files are stored in a different directory when using a modded launcher such as Curseforge. These files can typically be accessed by right-clicking the modpack instance and clicking "Open Folder"

### Mitigation

If you have EnderIO, update to the latest version on CurseForge.

If you have BDLib or LogisticsPipes, migrate to the GT New Horizons forks of both if possible.

To mitigate all mods generally, you can install our mod [PipeBlocker](https://modrinth.com/mod/pipeblocker) on both forge servers and clients. We also recommend updating LogisticsPipes and all of your other mods to the newest versions available. Note that pre-made modpacks may become unstable or otherwise break by updating all mods. 


## Technical Details

The bug is a well known issue with deserialization using `ObjectInputStream`. The mods affected used OIS for networking code, and this allowed packets with malicious serialization to be sent. This allows any script to be run on the server, which then can be used on the server to do the same thing to all clients, therefore infecting all clients with the server in reverse.

 If you have any information on BleedingPipe, you can join the [MMPA Discord](https://discord.gg/zPdFK47682), or contact us anonymously at contact@mmpa.info