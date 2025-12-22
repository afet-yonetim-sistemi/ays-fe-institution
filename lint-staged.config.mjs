const config = {
  '**/*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix --max-warnings 0'],
  '**/*.{css,scss,sass,less}': ['prettier --write'],
  '**/*.{json,json5,jsonc,yaml,yml}': ['prettier --write'],
  '**/*.{md,mdx,markdown}': ['prettier --write'],
  '**/*.{html,htm}': ['prettier --write'],
}

export default config