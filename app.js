const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');

const config = require('./config.json');



client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content === '*ltt') {

        fetch(`https://www.googleapis.com/youtube/v3/search?key=${config.googleApiKey}&channelId=${config.channelId}&part=snippet,id&order=date&maxResults=1`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${json.items[0].snippet.title}`)
                .setURL(`https://youtube.com/watch?=${json.items[0].id.videoId}`)
                .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png')
                .setImage(json.items[0].snippet.thumbnails.high.url);

            msg.channel.send(embed);
        })
        .catch((e) => console.log(e));
    }
});

client.login(config.discordSecret);