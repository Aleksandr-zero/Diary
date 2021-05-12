module.exports = {
	output: {
		filename: 'app.js'
	},
	mode: "production",
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: '/node_modules/'
		}]
	}
}