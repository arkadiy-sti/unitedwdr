import tseslint from "typescript-eslint";
export default tseslint.config({ ignores: ["dist/**", "node_modules/**", ".astro/**"] }, ...tseslint.configs.recommended,
  { files: ["src/**/*.ts", "tests/**/*.ts"], rules: { "@typescript-eslint/no-explicit-any": "off" } });
