import { Client, MessageEmbed } from "discord.js";
const client = new Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]
});

// Ricorda di sostituire questo con il tuo token reale
client.login("MTIwODE3MDE5MjY2OTExODU5Ng.G8XR2D.puQrfPxas2IXbNBCcuwDNghemE-hSR2_nhlYVE")

let tasks = []; // Array per memorizzare le task

client.on("ready", () => {
    console.log("Bot ONLINE");
});

function updateEmbed() {
    var embed = new MessageEmbed()
        .setTitle("Blocco di appunti condiviso")
        .setDescription("Ecco le vostre attuali task:")
        .setColor("#EC4245")
        .setFooter("LISTA COMANDI:\n-> !aggiungi [task] (senza parentesi quadre)\n-> !rimuovi [n° task] (senza parentesi quadre, valore numerico)\n-> !azzera (azzera il blocco)\n-> !tasklist per evocare il blocco di appunti")
        .setThumbnail("https://st2.depositphotos.com/1265075/6847/v/450/depositphotos_68476335-stock-illustration-check-list-with-red-checkmark.jpg")
        .setTimestamp();

    embed.fields = []; // Pulisci i campi dell'embed prima di aggiungere nuovi

    // Separare le task completate da quelle non completate
    let activeTasks = tasks.filter(task => !task.completata);
    let completedTasks = tasks.filter(task => task.completata);

    // Aggiungere prima le task attive
    let taskNumber = 1;
    activeTasks.forEach(task => {
        embed.addField(`${taskNumber++}. ${task.descrizione}`, "\u200B", false);
    });

    // Poi aggiungere le task completate senza numerazione e barrate
    completedTasks.forEach(task => {
        embed.addField(`~~${task.descrizione}~~`, "\u200B", false);
    });

    return embed;
}

client.on("messageCreate", (message) => {
    if (message.content.startsWith("!aggiungi ")) {
        const taskDescription = message.content.slice(10);
        tasks.push({ descrizione: taskDescription, completata: false });
        message.channel.send({ embeds: [updateEmbed()] });
    } else if (message.content.startsWith("!rimuovi ")) {
        const indexToRemove = parseInt(message.content.slice(9)) - 1;
        if (indexToRemove >= 0 && indexToRemove < tasks.length) {
            // Ottieni solo le task non completate
            let activeTasks = tasks.filter(task => !task.completata);
            if (indexToRemove < activeTasks.length) {
                // Trova l'indice reale della task nell'array originale
                let realIndex = tasks.indexOf(activeTasks[indexToRemove]);
                tasks[realIndex].completata = true; // Segna la task come completata
                message.channel.send({ embeds: [updateEmbed()] });
            } else {
                message.channel.send("Numero di task non valido!");
            }
        } else {
            message.channel.send("Numero di task non valido!");
        }
    } else if (message.content == "!tasklist") {
        message.channel.send({ embeds: [updateEmbed()] });
    } else if (message.content == "!azzera") {
        tasks = []; // Azzera l'array delle task
        message.channel.send({ embeds: [updateEmbed()] }); // Invia un nuovo embed aggiornato che sarà vuoto
    }
});
