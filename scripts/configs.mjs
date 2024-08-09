import replace from '@rollup/plugin-replace';
import nodeResolve from'@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import * as fs from 'node:fs';
import server from './server.mjs';

// @ts-ignore
const pckg = require('../package.json');

const buildFeatures = {
  SEARCH_FUSE: "full", // "basic" / "null"
}

// Allow the following to manual set feature flags;
// npm run js:build-dev -- --environment SEARCH_FUSE:null
let defaultBuild = {};
Object.keys(buildFeatures).forEach((k) => {
  defaultBuild[k] = process.env[k] || buildFeatures[k];
})

const builds = [
  {
    name: ".",
    features: defaultBuild
  },
  {
    name: "search-basic",
    features: {
      ...buildFeatures,
      SEARCH_FUSE: "basic"
    }
  },
  {
    name: "search-prefix",
    features: {
      ...buildFeatures,
      SEARCH_FUSE: "null"
    }
  },
];

const outputTypes = {
  js : {
    prefix: 'iife',
    ext: 'js',
    format: 'iife',
    default: false,
  },
  umd : {
    ext: 'js',
    format: 'umd',
    default: true,
  },
  cjs : {
    ext: 'cjs',
    format: 'cjs',
    default: true,
  },
  mjs : {
    ext: 'mjs',
    format: 'es',
    default: true,
  },
};

const OUTPUT_TYPES = (process.env.OUTPUT_TYPES || Object.keys(outputTypes).filter(k => outputTypes[k].default).join(',')).split(',')

const FILENAME = 'choices'
const VERSION = process.env.VERSION || pckg.version
const AUTHOR = pckg.author
const HOMEPAGE = pckg.homepage
const banner = `/*! choices.js v${VERSION} | © ${new Date().getFullYear()} ${AUTHOR} | ${HOMEPAGE} */\n`

const withDeclarations = !!process.env.WITH_D_TS_FILES;
if (withDeclarations) {
  [
    'public/types/src',
    'public/assets/scripts',
  ].forEach((p) => {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true });
    }

    fs.mkdirSync(p, { recursive: true });
  });
}

const candidateBuilds = process.env.TARGET
  ? builds.filter((build) => build.name === process.env.TARGET)
  : builds;

const suffix = (s, suffix) => {
  return s + (suffix ? '.' + suffix : '')
}

function genConfig(buildConfig) {
  // built-in vars
  const vars = {
    __VERSION__: VERSION,
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production')
  }

  if ('features' in buildConfig) {
    Object.keys(buildConfig.features).forEach((key) => {
      if (buildConfig.features[key] === 'undefined' || buildConfig.features[key] === 'null') {
        vars[`process.env.${key}`] = false;
      } else {
        vars[`process.env.${key}`] = JSON.stringify(buildConfig.features[key])
      }
    })
  }

  const config = {
    input: 'src/entry.js',
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: 'src/tsconfig.json',
        // https://github.com/rollup/plugins/issues/1495
        // @rollup/plugin-typescript just doesn't want to reliably generate .d.ts files when "composite" is true, so just copy the tsconfig.json definition around
        // Additionally tsc no longer accepts relative directories which escape declarationDir
        "declaration": withDeclarations,
        // declarationDir in src/tsconfig.json with a value of "./" magically maps to "./src" here...
        "declarationDir": withDeclarations ? "./src" : undefined,
        "declarationMap": false,
      }),
      replace(vars)
    ],
    output: [],
  }

  const output = [false, true];
  output.forEach((minify) => {
    OUTPUT_TYPES.forEach((t) => {
      const type = outputTypes[t];
      if (!type) {
        return;
      }

      let f = `public/assets/scripts/${FILENAME}`;

      f = suffix(f, buildConfig.name !== '.' ? buildConfig.name : '');
      f = suffix(f, type.prefix ? type.prefix : '');
      f = suffix(f, minify ? 'min' : '');
      f = suffix(f, type.ext);

      const output = {
        banner,
        file: f,
        format: type.format,
        name: 'Choices',
        exports: 'default',
        plugins: []
      };
      if (type.format !== 'es') {
        config.plugins.push(babel({ babelHelpers: 'bundled' }))
      }

      if (minify) {
        output.plugins.push(terser())
      }

      config.output.push(output);
    })
  });

  if (config.output.length === 0) {
    return false;
  }

  return config
}

let buildConfig = [];
candidateBuilds.forEach((build) => {
  buildConfig.push(genConfig(build));
});

buildConfig = buildConfig.filter((b) => !!b);
if (buildConfig.length === 0) {
  console.log('No valid build targets or feature combinations.');
} else {
  const localServer = server();
  if (localServer) {
    buildConfig[0].output[0].plugins.push(localServer)
  }
}

// noinspection JSUnusedGlobalSymbols
export default buildConfig;