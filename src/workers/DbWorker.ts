

const dbWorker_returnCommand = ( cmd: worker_command ) => {
	const cmdStream = buffer.Buffer.from ( JSON.stringify ( cmd ))
	self.postMessage ( cmdStream.buffer, [ cmdStream.buffer ] )
}

const db = new PouchDB('seguro')

const db_switch_command = ( cmd: worker_command ) => {
	switch ( cmd.cmd ) {
		case 'DB_ContainerKey': {

			return db.get ('ContainerKey').then ( doc => {

				return dbWorker_returnCommand ( cmd )
			}).catch ( err => {
				cmd.err = err
				return dbWorker_returnCommand ( cmd )
			})
			
		}
		default: {
			cmd.err = "Unknow command!"
			return dbWorker_returnCommand ( cmd )
		}
	}
}

const sendReady = () => {
	const command: worker_command = {
		cmd: 'db_ready',
		uuid: null
	}
	
	return dbWorker_returnCommand ( command )
}

const dbWorker_doCommand = ( message: any )=> {
	let cmd: worker_command
	try {
		cmd = JSON.parse ( buffer.Buffer.from ( message.data ).toString ())
	} catch ( ex ) {
		return console.log (`DB worker error: doCommand JSON.parse Error ${ message }`)
	}
	return db_switch_command ( cmd )
}

self.onmessage = dbWorker_doCommand

sendReady ()