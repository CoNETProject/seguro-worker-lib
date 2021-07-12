/**
 * 
 * 				Bridge Worker 	
 * 
 */

/// <reference path='../define.d.ts' />
import { workeropenpgp } from '@conet-project/seguro-worker-lib/src/dist/openpgp.min'
import { workerUuidV4 } from '@conet-project/seguro-worker-lib/src/dist/UuidV4'
import { workerBuffer } from '@conet-project/seguro-worker-lib/src/dist/Buffer'
import { workerPouchdb } from '@conet-project/seguro-worker-lib/src/dist/Pouchdb'
import { workerPouchdbMemory } from '@conet-project/seguro-worker-lib/src/dist/PouchdbMemory'
import { workerPouchdbFind } from '@conet-project/seguro-worker-lib/src/dist/PouchdbFind'

import { workerOpenPGPWorker } from '../dist/OpenPGPWorker'
import { workerDbWorker } from '../dist/DbWorker'

class SubWorker {
	public worker: Worker | undefined
	private cmdArray:  Map < string, ( cmd?: worker_command ) => void > = new Map ()
	public ready = false
	private catchReturn ( message: string ) {
		
		const jsonData = buffer.Buffer.from ( message ).toString()
		let cmd : worker_command
		try {
			cmd = JSON.parse ( jsonData )
		} catch ( ex ) {
			return console.dir ( ex )
		}

		const getCallBack = this.cmdArray.get ( cmd.uuid )

		if ( !getCallBack ) {
			return this.catchReturnCommand ( cmd )
		}

		this.cmdArray.delete ( cmd.uuid )

		return getCallBack ( cmd.data )
	}


	constructor ( scriptBase64: string[], private catchReturnCommand: ( cmd: worker_command ) => void ) {

		const kk = scriptBase64.map ( n => buffer.Buffer.from ( n, 'base64' ).toString ())

		const url = URL.createObjectURL( new Blob( [ 
			
			buffer.Buffer.from ( workerBuffer, 'base64' ).toString () + '\n\n', 
			buffer.Buffer.from ( workerUuidV4, 'base64' ).toString ()+ '\n\n',
			kk.join ('\n\n')
		], { type: 'text/javascript' }))

		this.worker = new Worker ( url )
		this.worker.onmessage = e => {
			return this.catchReturn ( e.data )
		}
		URL.revokeObjectURL( url )
	}

	public append ( message: worker_command, CallBack: any ) {
		message.uuid = getUUIDv4 ()
		this.cmdArray.set ( message.uuid, CallBack )
		const cmdStream = buffer.Buffer.from ( JSON.stringify ( message ))
		if ( this.worker?.postMessage ) {
			return this.worker.postMessage ( cmdStream.buffer, [ cmdStream.buffer ] )
		}
		return console.log ( `SubWorker Error: this.worker have no Object!`)
		
	}
}


let openPgpWorker: SubWorker | null = null
let dbWorker: SubWorker | null = null



const bridge_sendCommand = ( cmd: worker_command ) => {
	const cmdStream = buffer.Buffer.from ( JSON.stringify ( cmd ))
	return self.postMessage ( cmdStream.buffer, [ cmdStream.buffer ] )
}


const checkAllWorkerReady = () => {
	if ( openPgpWorker.ready && dbWorker.ready ) {
		const cmd: worker_command = {
			cmd: 'ready',
			uuid: null
		}
		return bridge_sendCommand ( cmd )
	}
}

const bridge_returnCommand = ( cmd: worker_command ) => {
	switch ( cmd.cmd ) {
		case 'openpgp_ready': {
			openPgpWorker.ready = true
			return checkAllWorkerReady ()
		}
		case 'db_ready': {
			dbWorker.ready = true
			return checkAllWorkerReady ()
		}
		default: {
			return bridge_sendCommand ( cmd )
		}
	}
	
}

const init = () => {
	if ( !openPgpWorker ) {
		openPgpWorker = new SubWorker ([ workeropenpgp, workerOpenPGPWorker ], bridge_returnCommand )

	}
	if ( !dbWorker ) {
		dbWorker = new SubWorker ([ workerPouchdb, workerPouchdbMemory, workerPouchdbFind, workerDbWorker ], bridge_returnCommand )
	}
	
}



const bridge_command_switch = ( cmd: worker_command ) => {
	const funChr = cmd.cmd.split ('_')[0]
	switch ( funChr ) {
		case 'DB': {
			return null;
		}
		default: {
			cmd.err = 'Bridge worker error: Unknow command!'
			return bridge_returnCommand ( cmd )
		}
	}
}

const doCommand = ( message: any )=> {
	let cmd: worker_command
	try {
		cmd = JSON.parse ( buffer.Buffer.from ( message.data ).toString ())
	} catch ( ex ) {
		return console.log (`Bridge worker error: doCommand JSON.parse Error ${ message }`)
	}
	return bridge_command_switch ( cmd )
}

self.onmessage = doCommand

init ()