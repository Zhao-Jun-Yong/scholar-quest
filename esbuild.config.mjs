import esbuild from "esbuild";
import process from "process";
import { builtinModules } from "module";
import { copyFileSync } from "fs";

const VAULT_PLUGIN_DIR = "/Users/yangshaojun/Obsidian/Second Brain/.obsidian/plugins/scholar-quest";

const copyToVaultPlugin = {
  name: "copy-to-vault",
  setup(build) {
    build.onEnd(() => {
      try {
        copyFileSync("main.js", `${VAULT_PLUGIN_DIR}/main.js`);
      } catch {}
    });
  },
};

const prod = process.argv[2] === "production";

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: [
    "obsidian", "electron",
    "@codemirror/autocomplete", "@codemirror/collab", "@codemirror/commands",
    "@codemirror/language", "@codemirror/lint", "@codemirror/search",
    "@codemirror/state", "@codemirror/view",
    "@lezer/common", "@lezer/highlight", "@lezer/lr",
    ...builtinModules,
  ],
  format: "cjs",
  target: "es2018",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  outfile: "main.js",
  plugins: [copyToVaultPlugin],
});

if (prod) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
}
