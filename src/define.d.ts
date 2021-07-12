interface Window {
	postMessage(message: any, transfer?: Transferable[]): void;
}
interface worker_command {
	cmd: string
	data?: any
	uuid: string
	err?: string
}
declare const buffer
declare const getUUIDv4: any
declare const PouchDB
declare module '@conet-project/seguro-worker-lib'