import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://blog.mmpa.info/",
  author: "Minecraft Malware Prevention Alliance",
  desc: "Threat intel and general blog about what we are doing over at MMPA.",
  title: "MMPA Blog",
  ogImage: "blog-og.png",
  lightAndDarkMode: false,
  postPerPage: 3,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 100,
  height: 20,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/Minecraft-Malware-Prevention-Alliance",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:contact@mmpa.info",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Discord",
    href: "https://discord.gg/5NvpmUttDP",
    linkTitle: `${SITE.title} on Discord`,
    active: true,
  },
  {
    name: "Mastodon",
    href: "https://infosec.exchange/@mmpa",
    linkTitle: `${SITE.title} on Mastodon`,
    active: true,
  },
];
