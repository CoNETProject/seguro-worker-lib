import startWorker from './interface/startWorker'

type DatabaseResolve = [status: 'SUCCESS' | 'FAILURE', payload?: string]


const getFromDatabase = (uuid: string): Promise<DatabaseResolve> => (
	new Promise<DatabaseResolve>((resolve) => {
		// get information from UUID
		return resolve(['SUCCESS', 'abcd'])
	})
)

const getScryptConfig = (): Promise<DatabaseResolve> => (
	new Promise<DatabaseResolve>(async (resolve) => {
		const [status, payload] = await getFromDatabase('scrypt');
		if (status === 'SUCCESS') {
			// other stuff to do
			return
		}
		return resolve(['FAILURE'])
	})
)

type ContainerResolve = [status: 'SUCCESS' | 'FAILURE', keyId?: string]

const createContainer = (password: string): Promise<ContainerResolve> => (
	new Promise<ContainerResolve>((resolve) => {
		// generate key
		// return resolve(['OK'])
		return resolve(['SUCCESS', 'ABC123123'])
	})
)




const saveToDatabase = (uuid: string, data: string) => {}

const deleteFromDB = () => {}


const anotherFunc = () => {}

export default {
	startWorker
}