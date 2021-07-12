import SubWorker from './SubWorker'
import { workerBridgeWorker } from '../dist/BridgeWorker'

const startWorker =  () => {
	return new Promise (( resolve, reject ) => {
		const ready = () => {
			clearTimeout ( time )
			resolve ( bridgeWorker )
			return console.log (`Bridge Worker ready!`)
		}
		const bridgeWorker = new SubWorker ([ workerBridgeWorker ], ready )
	
		const time = setTimeout (() => {
			return reject ('Worker Factory Timeout Error!')
		}, 5000 )
	})
}

export default startWorker