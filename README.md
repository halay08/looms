# Bulk Delete Loom Videos

## Getting Started

### Install dependencies and run build

```sh
$ pnpm i
$ pnpm build
```

### Bulk Delete

You can run the script directly to delete all videos.

**IMPORTANT:**: By default, all your videos are deleted when performing a search with 10 items. Therefore, please ensure that you truly want to delete all your videos or only specific ones based on a search query. If you need to modify the query, you can do so in the bulkDelete function located in the file [./src/loom.ts](./src/loom.ts).

```sh
$ cp .env.example .env
$ pnpm bulkDelete
```
