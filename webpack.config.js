const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//     .BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const pluginsWebpackConfig = () => {
    const plugins = [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new MiniCssExtractPlugin({
            filename: filenameConf('css')
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/static'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        })
    ];

    // if (isProd) plugins.push(new BundleAnalyzerPlugin());

    return plugins;
};

const optimizationConfig = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if (isProd) {
        config.minimizer = [
            new TerserWebpackPlugin(),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.optimize\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: [
                        'default',
                        { discardComments: { removeAll: true } }
                    ]
                },
                canPrint: true
            })
        ];
    }

    return config;
};

const filenameConf = (ext) =>
    isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaderConfig = (extra) => {
    const loader = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            }
        },
        'css-loader'
    ];

    if (extra) loader.push(extra);

    return loader;
};

const babelOptions = (preset) => {
    const options = {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties']
    };

    if (preset) options.presets.push(preset);

    return options;
};

const jsLoaderConfig = () => {
    const loaders = [
        {
            loader: 'babel-loader',
            options: babelOptions()
        }
    ];

    if (isDev) loaders.push('eslint-loader');

    return loaders;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    node: {
        fs: 'empty' // to fix fs error
    },
    entry: {
        main: [
            '@babel/polyfill',
            '@babel/plugin-proposal-class-properties',
            './index.jsx'
        ],
        analitycs: './analitycs.ts'
    },
    output: {
        filename: filenameConf('js'),
        path: path.resolve(__dirname, 'dist')
    },
    devtool: isDev ? 'source-map' : '',
    plugins: pluginsWebpackConfig(),
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    devServer: {
        port: 3000,
        hot: isDev
    },
    optimization: optimizationConfig(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaderConfig()
            },
            {
                test: /\.(s[ac]ss)$/,
                use: cssLoaderConfig('sass-loader')
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaderConfig()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            }
        ]
    }
};
