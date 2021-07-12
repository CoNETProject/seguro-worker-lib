const { src, dest } = require('gulp');
const textTransformation = require('gulp-text-simple');
const rename = require('gulp-rename');
const merge = require('merge-stream');


var transformString = ( text, options ) => {
    // do whatever you want with the text content of a file
	console.dir ( options );
	const dd = options.sourcePath.split("/");
	const souce = 'worker' + dd [ dd.length - 1 ].split (".")[0];
	const ret = `export const ${ souce } = "${ Buffer.from ( '/*******************' + souce + '**************/\n\n' + text+ '\n\n\n').toString ('base64')}";`
    return ret;
};

// create the factory with GulpText simple
var myTransformation = textTransformation(transformString);
var _src = ['../dist/BridgeWorker.js']

exports.default = () => {

	const tasks = _src.map ( n => src( n )
	.pipe( myTransformation ()) // create the Gulp transformation and insert it into the Gulp stream
	.pipe ( rename ( path => {
		path.extname = '.ts';
	}))
	.pipe( dest('../dist')))
	return merge( tasks )
}

