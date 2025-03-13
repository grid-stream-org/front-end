module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
        // Add this to transform import.meta
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!(firebase)/)'],
  setupFiles: ['<rootDir>/src/tests/setup.js'], // Add this line
  // Add support for import.meta by enabling ES modules in Jest
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}
