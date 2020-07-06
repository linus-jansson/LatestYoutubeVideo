const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');

const config = require('./config.json');

const fs = require('fs');

let log = 0;

function fetchYoutube() {

    return new Promise((resolve, reject) => {
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${config.googleApiKey}&channelId=${config.channelId}&part=snippet,id&order=date&maxResults=1`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(json => resolve(json))
            .catch((e) => reject(e));
    })

}

async function ping() {

    // async function which gets the latest video info from the channel
    fetchYoutube()
        .then((data) => {

            setTimeout(() => {
                // get video id from stored id in json file if it's the same just return and ping again. 
                // If it's not the same take the current video ID; place it in the file and then send

                fs.readFile('videoData.txt', "utf8", (err, content) => {
                    videoData = data.items[0].id.videoId;
                    fileData = content;

                    if (videoData != fileData) {
                        fs.writeFile('videoData.txt', videoData, 'utf8', () => {
                            log++
                            console.log('new video logged: ' + log);
                        });

                        // send content of video to discord

                        const embed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(`${data.items[0].snippet.title}`)
                            .setURL(`https://youtube.com/watch?=${data.items[0].id.videoId}`)
                            .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png')
                            .setImage(data.items[0].snippet.thumbnails.high.url);

                        client.channels.cache.get(`706041540690313288`).send(embed)
                            .catch((err) => console.log(err));
                    }
                });

                ping();

            }, 1000 * 60 * 60); // How often it should check 
        })
        .catch((err) => console.log(err));

}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    ping() // triggers the start of looking for new videos
});



// TODO: when wanting to get the latest video manually the video data should just be stored in a local file instead of featching it from youtube over and over again. (Prevents API usage and makes it faster)
client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content === '*ltt') {
        msg.channel.send('hello world');
    }
});


client.login(config.discordSecret);