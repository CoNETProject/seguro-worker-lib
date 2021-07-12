
declare const openpgp
const generateKey = async () => {
	await openpgp.generateKey({ curve: 'curve25519', userIDs: [{ name: 'Test', email: 'test@test.com' }] })
	.then (( value: string )=> {
		console.log ( value )
	})
}

const openPGPWork_returnCommand = (  cmd: worker_command ) => {
	const cmdStream = buffer.Buffer.from ( JSON.stringify ( cmd ))
	self.postMessage ( cmdStream.buffer, [ cmdStream.buffer ] )
}

const PGP_switch_command = ( cmd: worker_command ) => {
	switch ( cmd.cmd ) {
		
		default: {
			cmd.err = "PGP_switch unknow command!"
			return openPGPWork_returnCommand ( cmd )
		}
	}
}

const openPGPWork_doCommand = ( message: any )=> {
	let cmd: worker_command
	try {
		cmd = JSON.parse ( buffer.Buffer.from ( message.data ).toString ())
	} catch ( ex ) {
		return console.log (`OpenPGP worker error: doCommand JSON.parse Error ${ message }`)
	}

	return PGP_switch_command ( cmd )
}

self.onmessage = openPGPWork_doCommand

const cmd: worker_command = {
	cmd: 'openpgp_ready',
	uuid: null
}
openPGPWork_returnCommand ( cmd )
