const config = {
  '**/*.{js,jsx,ts,tsx}': (filenames) => {
    const filteredFiles = filenames.filter((file) => !file.includes('src/shadcn/'))
    if (filteredFiles.length === 0) return []
    const filesString = filteredFiles.join(' ')
    return [
      `prettier --write ${filesString}`,
      `eslint --fix --max-warnings 0 --no-warn-ignored ${filesString}`,
    ]
  },
  '**/*.{css,scss,sass,less}': ['prettier --write'],
  '**/*.{json,json5,jsonc,yaml,yml}': ['prettier --write'],
  '**/*.{md,mdx,markdown}': ['prettier --write'],
  '**/*.{html,htm}': ['prettier --write'],
}

export default config
