// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

export default [
	
	{
		input: 'src/index.ts',
		output: {
			dir: 'build',
			format: 'cjs',
		},
		plugins: [ typescript({
			tsconfig:'src/interface/tsconfig.json'
		})]
	}
	
]
