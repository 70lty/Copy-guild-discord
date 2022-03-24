var util = require('util');
var stream = require('stream');

var Transform = stream.Transform;

module.exports = StreamOfLines;

function StreamOfLines(options) {
	Transform.call(this, options);
	this._prevChunks = [];
	this._hasPrevChunks = false;
}

util.inherits(StreamOfLines, Transform);

StreamOfLines.prototype._transform = function(chunk, encoding, callback) {
	chunk = chunk.toString();
	var fromIndex = 0;
	var newLineIndex;
	while ((newLineIndex = chunk.indexOf('\n', fromIndex)) != -1) {
		var line;
		if (this._hasPrevChunks) {
			line = this._prevChunks.join('') + chunk.substring(fromIndex, newLineIndex);
			this._prevChunks = [];
			this._hasPrevChunks = false;
		} else {
			line = chunk.substring(fromIndex, newLineIndex);
		}
		fromIndex = newLineIndex + 1;
		this.push(line);
	}
	if (fromIndex < chunk.length) {
		this._prevChunks.push(chunk.substring(fromIndex));
		this._hasPrevChunks = true;
	}
	callback();
}