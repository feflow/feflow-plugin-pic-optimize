# feflow-plugin-pic-optimize

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/feflow/generator-ivweb/blob/master/LICENSE) [![npm package](https://img.shields.io/npm/v/feflow-plugin-pic-optimize.svg?style=flat-square)](https://www.npmjs.org/package/feflow-plugin-pic-optimize) [![NPM downloads](http://img.shields.io/npm/dt/feflow-plugin-pic-optimize.svg?style=flat-square)](https://www.npmjs.com/package/feflow-plugin-pic-optimize) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/feflow/generator-ivweb/pulls) [![developing with feflow](https://img.shields.io/badge/developing%20with-feflow-1b95e0.svg)](https://github.com/feflow/feflow)

This is a Feflow plugin. The principle is to use the open source compression tools pngquant, pngcrush, optipng, svgo to serially compress and optimize an image.

## Features

- Automatically traverse all image files in the src directory.
- Support svgo, png and jpg.


## Installation

You need to install [`feflow`](https://github.com/feflow/feflow) first.

```sh
$ npm install feflow-cli -g
```

Then install feflow-plugin-pic-optimize

```sh
$ feflow install feflow-plugin-pic-optimize
```
## Usage

```sh
$ feflow upic
```
## Benchmark
![](https://qpic.url.cn/feeds_pic/ajNVdqHZLLDaQnwDicxlX72EOFYApoG4xZ98YdYUyQ9crWrmenhgqQw/)

## Changelog

[Changelog](CHANGELOG.md)

## License

[MIT](https://tldrlegal.com/license/mit-license).
