# ATM10A Wardaddy

A friends-and-family build of **All the Mods 10: Aeronautics 0.8.0** (Minecraft 1.21.1, NeoForge 21.1.250), with quality-of-life and progression tweaks.

## Install it (Prism Launcher)

1. Install **[Prism Launcher](https://prismlauncher.org)** and sign in with your Microsoft account.
2. Download **[ATM10A-Wardaddy-Prism.zip](https://github.com/Grandpawarbucks/ATM10A-Wardaddy/raw/main/launcher/ATM10A-Wardaddy-Prism.zip)**.
3. In Prism, click **Add Instance → Import**, choose the zip, then click **OK**.
   (Or paste the download link above into the Import box.)
4. Click **Launch**. The first launch downloads about 1 GB of mods, so give it a few minutes.

**Updates are automatic.** Every launch checks this repo and downloads any changes before the game starts.

Prism picks the right Java (21) automatically. The instance is set to 4–8 GB of memory. If you have 16 GB or more, you can raise it to 10 GB under **Edit → Settings → Java**.

## What's different from stock ATM10 Aeronautics

- **Death and travel:** keepInventory is on, only 50% of players need to sleep, you get 5 homes, and the cooldowns are shorter for `/rtp` (2 min), `/back` and the Waystones inventory button.
- **Loot:** structure chests roll 3x as often and mobs drop 2x loot and 2x XP (LootJS/KubeJS). Lootr chests refill every 10 minutes.
- **Quests:** XP and stackable item rewards are doubled, loot crates give 2 rolls, and quest items are detected faster.
- **Machines:** Powah, Mekanism and Iron Furnaces generators produce 4x. Vanilla and Iron Furnaces smelt 4x faster. Hostile Neural Networks costs less power. The AllTheOres ore hammer gives 4 dust per ore or raw ore (stock is 2). The Mining Gadget uses half the power per block and holds twice as much.
- **Farming:** random tick speed is 6 (crops grow faster). Botany Pots grow 2x, Productive Bees work 2x faster, and the Mystical Agriculture Growth Accelerator ticks 2x faster. Mystical Agriculture crops can drop a second seed, Fertilized Essence drops 25% of the time, and mobs drop Inferium Essence 20% of the time.
- **Relics:** every relic (Relics and Reliquified Artifacts) is fully maxed the moment it reaches your inventory: max level and rank, all abilities unlocked and maxed, best stat rolls. Chests that can hold a relic now have one 60% of the time (stock is 20%).
- **Apotheosis:** multi-level enchantments go up to level 127, the config maximum, from both enchanting and loot (except Quick Charge 5, Lure 8 and Frost Walker 11, which break or lag at high levels), and reforging is cheaper (upgrade: 1 sigil + 100 levels; reroll: 75 levels).
- **Gear and storage:** Iron Jetpacks can be enchanted, every Sophisticated Backpack tier has 2 more upgrade slots, and the Mega Torch and Dread Lamp cover a 128-block radius.
- **Mods added:** LootJS, Entity Culling, Backpack Plus, Generator Galore, Trade Cycling, Cable Facades, Applied Flux, YUNG's Better Dungeons and YUNG's Better Mineshafts.

## For the maintainer

- `pack/` is a [packwiz](https://packwiz.infra.link) pack. Mods are only metadata; they download from CurseForge and Modrinth.
- After you change configs or scripts in the CurseForge instance, run `tools/sync_from_instance.sh`, then commit and push.
- To add a mod, run `cd pack && packwiz modrinth add <slug>` (or `packwiz curseforge add <slug>`).
  Prefer Modrinth for anything CurseForge blocks from third-party download.
- After changing the Minecraft or NeoForge version in `pack/pack.toml`, rebuild the Prism zip with `python3 tools/build_prism_instance.py`.

Credits: the base pack is by the [All The Mods team](https://github.com/AllTheMods/ATM10-Aeronautics). Mods belong to their authors.
