
import { workerBuffer } from '../dist/Buffer'
import { workerUuidV4 } from '../dist/UuidV4'

export default class SubWorker {
	public worker: Worker | undefined
	private cmdArray:  Map < string, ( cmd: worker_command ) => void > = new Map ()
	private catchReturn ( message: string ) {
		
		const jsonData = Buffer.from ( message ).toString()
		let cmd : worker_command
		try {
			cmd = JSON.parse ( jsonData )
		} catch ( ex ) {
			return console.dir ( ex )
		}

		const getCallBack = this.cmdArray.get ( cmd.uuid )

		if ( !getCallBack ) {
			if ( /^ready$/i.test ( cmd.cmd ) ) {
				return this.readyBack ()
			}
			return console.log ( `SubWorker catch unknow UUID sharedMainWorker Return: ${ cmd } `)
		}

		this.cmdArray.delete ( cmd.uuid )

		return getCallBack ( cmd )
	}


	constructor ( scriptBase64: string[], private readyBack: ()=> void ) {
		const kk = scriptBase64.map ( n => Buffer.from ( n, 'base64' ).toString ())
		const url = URL.createObjectURL( new Blob ([
			Buffer.from ( workerBuffer, 'base64' ).toString () + '\n\n', 
			Buffer.from ( workerUuidV4, 'base64' ).toString () + '\n\n',
			kk.join ('\n\n')
		], { type: 'text/javascript' }))
		this.worker = new Worker ( url )
		this.worker.onmessage = e => {
			return this.catchReturn ( e.data )
		}
		URL.revokeObjectURL( url )
	}

	public append ( message: worker_command, CallBack: ( cmd?: worker_command ) => void ) {
		message.uuid = getUUIDv4 ()
		this.cmdArray.set ( message.uuid, CallBack )
		const cmdStream = Buffer.from ( JSON.stringify ( message ))
		if ( this.worker?.postMessage ) {
			return this.worker.postMessage ( cmdStream.buffer, [ cmdStream.buffer ] )
		}
		return console.log (`SubWorker Error: this.worker have no Object!`)
		
	}
}