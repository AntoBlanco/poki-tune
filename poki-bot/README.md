# poki-bot

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.10. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.


## Discord
    Create an application
    Add a bot in your application
    Save the bot's token and set it as the DISCORD_BOT_TOKEN environment variable
    Go to https://discordapp.com/oauth2/authorize?client_id=<YOUR_BOT_CLIENT_ID>&scope=bot&permissions=3222592
    Add music bot to server

# Construir las imágenes de Bun y levantar todo
docker-compose up --build -d
docker-compose logs -f