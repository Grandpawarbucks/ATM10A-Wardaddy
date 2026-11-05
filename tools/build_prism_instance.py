#!/usr/bin/env python3
"""Build launcher/ATM10A-Wardaddy-Prism.zip: an importable Prism Launcher instance that
installs and updates the pack from GitHub before every launch (Windows, macOS, Linux).
Prism: Add Instance -> Import -> pick the zip (or paste the zip's GitHub download URL).
"""
import pathlib, re, zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
PACK_URL = "https://raw.githubusercontent.com/Grandpawarbucks/ATM10A-Wardaddy/main/pack/pack.toml"
BOOTSTRAP = ROOT / "tools/packwiz-installer-bootstrap.jar"  # official v0.0.3, packwiz/packwiz-installer-bootstrap
OUT = ROOT / "launcher/ATM10A-Wardaddy-Prism.zip"
NAME = "ATM10A Wardaddy"

pack_toml = (ROOT / "pack/pack.toml").read_text()
mc = re.search(r'minecraft = "([^"]+)"', pack_toml).group(1)
neoforge = re.search(r'neoforge = "([^"]+)"', pack_toml).group(1)
version = re.search(r'^version = "([^"]+)"', pack_toml, re.M).group(1)

# $INST_JAVA and $INST_MC_DIR are Prism variables, so the command works on every OS.
instance_cfg = f"""[General]
ConfigVersion=1.3
InstanceType=OneSix
name={NAME}
iconKey=default
AutomaticJava=true
OverrideMemory=true
MinMemAlloc=4096
MaxMemAlloc=8192
OverrideJavaArgs=true
JvmArgs=-XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M
OverrideCommands=true
PreLaunchCommand=\\"$INST_JAVA\\" -jar \\"$INST_MC_DIR/packwiz-installer-bootstrap.jar\\" -g {PACK_URL}
notes={NAME} {version}. Before each launch, packwiz-installer pulls the latest pack from GitHub ({PACK_URL}).
"""

mmc_pack = f"""{{
    "components": [
        {{"uid": "org.lwjgl3", "version": "3.3.3", "dependencyOnly": true}},
        {{"uid": "net.minecraft", "version": "{mc}", "important": true}},
        {{"uid": "net.neoforged", "version": "{neoforge}"}}
    ],
    "formatVersion": 1
}}
"""

OUT.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr(f"{NAME}/instance.cfg", instance_cfg)
    z.writestr(f"{NAME}/mmc-pack.json", mmc_pack)
    z.write(BOOTSTRAP, f"{NAME}/minecraft/packwiz-installer-bootstrap.jar")
print(f"Wrote {OUT.relative_to(ROOT)} (MC {mc}, NeoForge {neoforge}, pack {version})")
