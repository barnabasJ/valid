const path = require('path')

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        chunkLoading: false,
        wasmLoading: false,
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
}
