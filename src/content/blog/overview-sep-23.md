---
title: 'MMPA Monthly Overview #1 (September)'
author: MMPA Administration Team
pubDatetime: 2023-10-08T17:35:36.533Z
postSlug: overview-sep-23
featured: true
draft: false
tags:
  - meta
  - threat
description: A general overview of what MMPA has done (and whats to come) in the month of September, 2023.
ogImage: "monthly/sep-23-og.png"
---
    

# Introduction
September did not have many malware incidents, but MMPA has made decent progress toward several measures for preventing the spread of malware. 

![Pie chart, Curseforge 44%, Discord 22%, Bukkit 11%, Spigot 22%, Modrinth 0%](https://files.horizon.pics/200604d0-7ed0-45ff-b534-6a8ba0eb0125?a=580&mime1=image&mime2=png)

or in raw numbers,

- CurseForge: 4
- Discord: 2
- Spigot: 2
- Bukkit: 1
- Modrinth: 0

As seen from the chart above, Modrinth has been consistently malware-free for several months (**this does not guarantee safety**). Below is a statement from Emma Alexia, a Growth Manager and Lead Moderator at Modrinth on how often they see attempts of malware being uploaded to their platform.

![A Discord message from Emma Alexia that reads "Modrinth's specific definition of 'malware' includes things that other people may not consider malware, so the number of takedowns for malware we have is higher than actual cases of malicious software being uploaded. that said, once a month or less"](https://polarite.with-your.mom/r/b1232cac-436b-4059-80ec-c44e5ee6ac2b.png)

Curseforge has been actively addressing some of the issues that lead to malware spreading, such as existing mods being re-uploaded under new names with malware added. Bukkit is likely taking similar precautions, as they are both owned by the same company.

Spigot and Discord have yet to make any major strides towards preventing the spread of malware on their platforms.

## Malware of the Month


### Comet

Comet is a malware family that Lenni0451 reported to MMPA on September 10th. It was originally thought to be a simple Force OP plugin, but it did a concerning amount of web requests. Comet only works on servers.

Authorized users gain access to the following Comet chat commands:
![Comet help menu, displaying commands update, plugins, stop, console, sudo, perm, op, deop, ban, kick, gm, kill, give, dupe, coords, tp, tpxyz, invsee](https://files.horizon.pics/bd829f4a-2aa1-484e-8aab-a0819970040e?a=580&mime1=image&mime2=png)


Authorizing with Comet is as simple as typing ``*auth <password>`` in chat. Comet's auth password is simply "``test``", despite it being stored as an MD5 hashed string.

This password only works when logged in as one of the names below. Comet is mostly meant for attacking cracked/offline Minecraft servers where players can join under any username. We have blurred the real player names in the screenshot below.
![Blurred IGNs of allowed players, with the fake names "Jesus", "mojangdeveloper", "dev"](https://files.horizon.pics/dee4bb6f-d24a-4d8d-bee1-fbf4df97e0a5?a=580&mime1=image&mime2=png)


After more investigation, MMPA found that the backend server ran on Replit and included a Discord token in plain sight.

This Discord token granted us full access to the bad actors' Discord server. With this abiilty, we made a 1:1 clone of the server to gain access to its messages.

As expected, the server was filled with talk of backdoors, malicious plugins, and bigotry.

At the time of writing, Comet's C2 has not been taken down, despite our report to Replit.


### Ectasy

Ectasy has been a well established backdoor-as-a-service in the spigot backdooring space. The main method of spreading Ectasy is SpigotMC's plugin website. Ectasy only works on servers.

Similar to Comet, Ectasy works mostly based on commands with the prefix of `*`. This means that Ectasy has no C2 we can take down. The `ectasy[.]club` website has been reported to Porkbun, but at the time of writing, the website is still online.

An instance of the Ectasy malware was found on SpigotMC by Lenni0451 on October 6th, 2023. The plugin was named ["Anti xray"](https://www.spigotmc.org/resources/anti-xray.112970/). Within a few hours, it had about 5 downloads. 

When the plugin is run on a server, it downloads a file named ``bungee.jar`` into the ``plugins/PluginMetrics`` folder in the server files.

![Code that downloads the bungee.jar file](https://files.horizon.pics/02017a48-27b1-4ce1-a9a1-a603b6191a13?a=580&mime1=image&mime2=png)


The plugin itself is a 1:1 copy of an existing, uninfected plugin. The only thing that the malware author added is the ``TranslatableComponentDeserializer`` class and the ``TranslatableComponentDeserializer$1`` class inside of it.
![A screenshot showing the classes within the AntiXray jar. The highlighted class is "TranslatableComponentDeserializer\$1.class"](https://files.horizon.pics/b1ec0906-f814-4218-a638-0ed5a0670d92?a=580&mime1=image&mime2=png)

Opening the ``bungee.jar`` file reveals that this plugin is infected with Ectasy:
![Screenshot of the bungee.jar file's Core.class file open in ByteEdit. The notable line is "Decompiling Ectasy source code is against TOS"](https://files.horizon.pics/1de15f82-e258-4e2e-8702-5692a0d65f30?a=580&mime1=image&mime2=png)


Spigot deleted the malicious file within about 7 hours.
![Notification on the Spigot website from "Today at 12:40 AM" that reads "The resource Anti xray has been deleted. Reason: Malicious. Delete immediately. Downloads and saves a file to plugins/PluginMetrics/bungee.jar which is then run"](https://files.horizon.pics/030bf715-4f2f-4514-b62e-08baf9d352a5?a=580&mime1=image&mime2=png)


### Seroxen

On September 26th, [misleadingly named mods were reuploaded to the Curseforge website](https://www.reddit.com/r/feedthebeast/comments/16t1far/psa_curseforge_user_mkatmonster_is_uploading/) by a user named [`MkatMonster`](https://legacy.curseforge.com/members/mkatmonster/projects). These mods had barely any working code and had names very similar to existing mods. Seroxen is capable of infecting both clients and servers.

The malicious mods downloaded a batch file called Sero.bat. With a few more PowerShell stagers, the final payload was a [RAT called Seroxen](https://www.trendmicro.com/en_us/research/23/f/seroxen-mechanisms-exploring-distribution-risks-and-impact.html). 

Unfortunately, this incident occured in the middle of night in Israel, where the Curseforge team is located. The mods were removed as soon as the Curseforge team were available.

Seroxen is already detected by many popular antiviruses, so anyone who did download it is unlikely to be infected.

### Bonus

*This information comes from a scrapped blog article from August. Because it's a few months old and the mods had no malicious code, we thought we'd include it as a bonus.*


Thousands of nearly identical files were uploaded to CurseForge by bots between August 9, 2023 and August 11, 2023. All files contained the same example mod code. The project pages have separate files for each selectable Minecraft version, ranging from 1.3.1 all the way to the newest 1.20.2 snapshots. The files are marked for both Forge and Fabric, even though they only work on Forge.

Due to how CurseForge’s approval process works, all files uploaded to Curseforge are automatically given either 1 or 2 downloads. In this case, hundreds of files were uploaded to each project. This allowed several of the projects to reach almost 2,000 “downloads”. This was later amplified by the amount of curious users who scraped these files, allowing some of the projects to surpass the 2,000 mark.

![The Curseforge page for the "Mystical Beasts mod", uploaded by  sapphireseeker789. The mod has 1,957 downloads and 11 pages of files uploaded.](https://files.horizon.pics/c693d3d6-10b8-4fe4-bc41-7805202a0b10?a=580&mime1=image&mime2=png)


All of the abusive mods had AI generated [names](https://chorb.is-from.space/r/DiscordPTB_jkrScvlsd3.png), [photos](https://femboy.enterprises/pEhxBwWD8E), and [descriptions](https://chorb.is-from.space/r/chrome_uFBevUW9ub.png).

A few hours after the Minecraft Malware Prevention Alliance team notified CurseForge, all offending projects were taken down. This happened on 8/12/23 at 2:02 AM CST. Curseforge is taking steps to prevent this from happening in the future, and responded to the situation as quickly as they could.

## Future Plans


### SpigotMC

Spigot is notoriously known for doing almost no code verification on submitted plugins, which makes uploading malware a menial task.

Spigot's answer to this issue has generally been, "We can't review stuff, there's way too many plugins". We'd like this situation to change, but the SpigotMC representative we had in our Discord left, which means we have no contact with their team.

We would like the Spigot team to strengthen their approval process due to how big of a target their platform is for bad actors.

### TOTP (or WebAuthn)

A required 2FA implementation that pops up when you try to, for example, upload or update a new version of a mod would be a big step towards preventing compromised accounts from spreading malware. SMS 2FA would not be ideal due to how unsafe it is.

[GitHub has already done this](https://github.blog/2023-03-09-raising-the-bar-for-software-security-github-2fa-begins-march-13/), requiring all users to enable 2FA with TOTP or Webauthn. 

#### CI Security

If we force all uploads to be authenticated with 2FA, how would CI work?

This question is a bit tricky to answer, but the current idea is that a token would be generated after the user enabled 2FA and it would only be shown once (unless regenerated, with a prompt for 2FA). As a extra precaution, the user should be emailed/a notification should be sent out alerting them of the upload/change. 

### [Concoction](https://github.com/Minecraft-Malware-Prevention-Alliance/concoction/)

We have been making great progress on Concoction, our automated scanning tool, capable of both dynamic and static analysis.

We deem Concoction's static signatures usable in production, with a simple API to go with it.

Dynamic analysis is also almost in a usable state, all it needs is something to discover entrypoints of common modding platforms.

Col-E released a great [overview video](https://www.youtube.com/watch?v=n4280vz_w5k) a while ago of what our plans are.

#### GUI

The concoction GUI is an easy way for end users to scan for signatures.

![Concoction UI demo](https://github.com/Minecraft-Malware-Prevention-Alliance/concoction/raw/main/docs/media/concoction-gui.gif)

*Shown in the demo are obvious signatures that will flag almost all Java programs, the detections are only to test, these applications shown "detected" with malware aren't actually malware*

In an ideal future, we will have a tool created for automatically creating GUIs for detecting specific malware families during major incidents like Fractureiser.

### Sandboxing

Implementing sandboxes for MacOS & Linux is already possible, but Windows is still a big barrier. Windows can be very janky, and we still need to account for all use cases.

If you are willing to work on Windows sandboxing with us, please make sure to [send a e-mail](mailto:sandboxing@mmpa.info) or join our Discord and chat in `#sandboxing`, we would love to work on it with you!


### Credits

- Lenni0451 - Alerting us of several malicious Spigot plugins and helping us decompile the malicious code
- Modrome - Alerting MMPA about the issue from the "Bonus" section and helping research Seroxen
- u/RedChuJelly - Making the Reddit post from the "Bonus" section
- LambdAurora - Proofreading and suggestion of post changes
- PandaNinjas - Helping with Seroxen research
- mommyraven - Helping with Seroxen research
- barrulik - Helping with Seroxen research
- emmikat - Helping with Seroxen research
- pypylia - Helping with Seroxen research
- janrupf - Helping with Seroxen research
- cbax - Helping with Seroxen research
- chorb - Research and proofreading
- eva - Research and blog writing
- IMS - Blog post preparation
- tobipickle - Proofreading
- axolotlite - Proofreading
- eoka_official - Research
- Polarite - Proofreading
