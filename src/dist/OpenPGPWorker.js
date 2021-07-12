const generateKey = async () => {
    await openpgp.generateKey({ curve: 'curve25519', userIDs: [{ name: 'Test', email: 'test@test.com' }] })
        .then((value) => {
        console.log(value);
    });
};
const openPGPWork_returnCommand = (cmd) => {
    const cmdStream = buffer.Buffer.from(JSON.stringify(cmd));
    self.postMessage(cmdStream.buffer, [cmdStream.buffer]);
};
const PGP_switch_command = (cmd) => {
    switch (cmd.cmd) {
        default: {
            cmd.err = "PGP_switch unknow command!";
            return openPGPWork_returnCommand(cmd);
        }
    }
};
const openPGPWork_doCommand = (message) => {
    let cmd;
    try {
        cmd = JSON.parse(buffer.Buffer.from(message.data).toString());
    }
    catch (ex) {
        return console.log(`OpenPGP worker error: doCommand JSON.parse Error ${message}`);
    }
    return PGP_switch_command(cmd);
};
self.onmessage = openPGPWork_doCommand;
const cmd = {
    cmd: 'openpgp_ready',
    uuid: null
};
openPGPWork_returnCommand(cmd);
