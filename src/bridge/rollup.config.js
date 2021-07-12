// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

export default [
	
	{
		input: 'src/bridge/BridgeWorker.ts',
		output: {
			dir: 'src/dist',
			format: 'cjs',
		},
		plugins: [ typescript({
			tsconfig:'src/bridge/tsconfig.json'
		})],
	}
	
]
