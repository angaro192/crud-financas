import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs', 'esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  external: [
    '@prisma/client',
    '.prisma/client'
  ],
  noExternal: [
    'fastify',
    'zod'
  ]
})