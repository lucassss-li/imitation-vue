import typescript from '@rollup/plugin-typescript'
export default {
    input: './src/index.ts',
    output: [
        {
            format: 'cjs',
            file: 'dist/vue-cjs.js',
        },
        {
            format: 'esm',
            file: 'dist/vue-esm.js',
        },
    ],
    plugins: [typescript()],
}
