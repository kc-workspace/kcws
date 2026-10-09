# @kcinternals/config-builder

Build configuration with ordered setting and configuration plugins.

## Synchronous Plugins

`definePluginSync` accepts synchronous actions. `defineConfigSync` returns the final
configuration directly.

```ts
import { defineConfigSync, definePluginSync } from "@kcinternals/config-builder";

const increment = definePluginSync("increment", {
  applyConfig: (config: number) => config + 1,
});

const config = defineConfigSync(1, increment); // 2
```

## Asynchronous Plugins

`definePluginAsync` accepts actions returning either a value or a promise.
`defineConfigAsync` accepts both synchronous and asynchronous plugins and always
returns `Promise<C>`. Asynchronous plugins cannot be passed to `defineConfigSync`.

```ts
import {
  defineConfigAsync,
  definePluginAsync,
} from "@kcinternals/config-builder";

const remoteConfig = definePluginAsync("remoteConfig", {
  applyConfig: async (config: { endpoint: string; token: string }) => {
    const response = await fetch(config.endpoint);
    return { ...config, token: await response.text() };
  },
});

const config = await defineConfigAsync(
  { endpoint: "https://example.com/token", token: "" },
  remoteConfig,
);
```

Both pipelines apply every setting action before any configuration action.
Setting actions run in ascending `settingPriority`; configuration actions run in
ascending `configPriority`. Both priorities default to `0`.

The asynchronous pipeline awaits each action before passing its result to the
next plugin. Throwing or rejecting stops execution and rejects the returned
promise. Settings and configuration logging follow the synchronous pipeline.
