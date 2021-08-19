const fs = require('fs');
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
let {PythonShell} = require('python-shell')
const readline = require('readline');
const request = require('request');
const xf = require('xfetch-js');
const sagiri = require('sagiri');





const SESSION_FILE_PATH = './session.json';
const rtl_converter = require("rtl-arabic");

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const helpMsg = `

🤖ZELINSKI BOT COMMANDS🤖


🌁   $s : 
send it with media (image, video or gif) 
to convert it into sticker 

 📷   $insta :
mention this command on instagram post link
or send the link in a following line to download posts (please wait as it takes some time)

 🐦   $twitter :
mention this command on twitter tweet link
or send the link in a following line to download tweet's video (please wait as it takes some time)

🎵  $sc :
mention this command on soundcloud link
or send the link in a following line to download it (please wait as it takes some time)

🤔    $choose:
send it with  items provided in every single line
to choose randomly 

❤️    $love :
Send it or mention a message with it and the bot will reply with a compliment audio 

🏡     $help :
to get this list

` ;

const client = new Client({
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    },
    session: sessionData
})


client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr);

});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});


client.on('ready', () => {
    console.log('Bot is ready!');
});




client.on('message_create', async msg => {
	

	var contact = await msg.getContact();
	var diplayName = await contact.name;
	if(typeof displayName === 'undefined') {displayName = await contact.pushname}
    print(`\nnew message from: ${contact.name}`);
    print(`in chat: ${(await msg.getChat()).name}`);
    print(msg.body);
	var date = new Date(msg.timestamp);
	console.log(date.toString());

	

    if (msg.body == '$hi' && await messageFromBoss(msg)) {
        msg.reply("yes sir !") ;
        



    } else if (msg.body == "$s") {
        creatSticker(msg) ;





    } else if (msg.body.startsWith("$choose")) {
        choose(msg) ;




    } else if (msg.body == "$help") {
        msg.reply(helpMsg);



    } else if ((msg.body.startsWith("$math")) && await messageFromBoss(msg)) {
        var chat = await msg.getChat();
        msg.reply(doMath(msg.body), chat.id._serialized) ;




    } else if (msg.body == "$love") {
        sendMediaFileToMSG(msg, "love1.mp3")




    } else if (msg.body.startsWith("$insta")) {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/instaDownloader.py', null, function (err) {
            if (!err) {
                sendInstaVidos(msg) ;
            } else {
                msg.reply("عذرا حدث خطا ما")
            }
          });




    } else if (msg.body.startsWith("$twitter")) {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/twitterDownloader.py', null, function (err) {
            if (err) {
                msg.reply("عذرا حدث خطا ما")
            } else {
                sendMediaFileToMSG(msg, "twitterVideo.mp4")
            }
          });




    } else if (msg.body == "$sc") {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/soundDownloader.py', null, function (err) {
            if (err) {
                msg.reply("عذرا حدث خطا ما")
            } else {
                sendMediaFileToMSG(msg, "soundcloudFile.mp3") ;
            }
          });




    } else if (msg.body == "$yt") {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/youtubeDownloader.py', null, function (err) {
            if (err) {
                msg.reply("عذرا حدث خطا ما")
            } else {
                sendMediaFileToMSG(msg, "youtubeVideo.mp4") ;
            }
          });




    } else if (msg.body.startsWith("$ytmp3")) {
        writeShortcode(msg)

        PythonShell.run('./pythonCode/youtubeDownloader.py', null, function (err) {
            if (err) {
                msg.reply("عذرا حدث خطا ما")
            } else {
                PythonShell.run("./pythonCode/youtubeToMp3.py", null, function (err) {
                    if (err) {
                        msg.reply("عذرا حدث خطا ما")
                    } else {
                        sendMediaFileToMSG(msg, "youtubeVideo.mp3") ;
                    }
                }) ;
            }
          });


    }else if (msg.body == "$meme")  {
        randomMeme(msg)

    } else if (msg.body.startsWith("$startVote") && await messageFromBoss(msg)) {
        creatVote(msg.body) ;
        const voteMessage = creatVoteMessage()
        var chat = await msg.getChat();
        client.sendMessage(chat.id._serialized,voteMessage) ;




    } else if(msg.body == "$endVote" && await messageFromBoss(msg)) {
        const result = calculateVotesAndCreatMessage()
        var chat = await msg.getChat();
        client.sendMessage(chat.id._serialized,result) ;




    } else if(msg.body.startsWith("$startSpam") && await messageFromBoss(msg)) {
        var items = msg.body.split('\n') ;
        startSpam(msg,items[1], items[2]) ;


    } else  if (msg.body == "$sauce") {
        saucenaoAPI(msg)


    } 
    
    
    if (msgIsVote(msg)) {
        votes.push(msg.body.toUpperCase()) ;
    }


});


// -MARK: Commands Functions 

async function creatSticker(msg) {
    var chat = await msg.getChat();
    if (msg.hasQuotedMsg) {
        const qm = await msg.getQuotedMessage()
        const attachmentData = await qm.downloadMedia();
        msg.reply(attachmentData,chat.id._serialized,{sendMediaAsSticker: true});
    } else {
        const attachmentData = await msg.downloadMedia();
        msg.reply(attachmentData,chat.id._serialized,{sendMediaAsSticker: true});
    }
}


function print(text) {
	//var body = msg.body;
	//body = rtl_converter(body)
	arLetters = "أابتثجحخدذرزسشصضطظعغفقكلمنهويةىلاءئؤإلإلأ"
	if(arLetters.includes(text.split("")[0])) {text = text.split("").reverse().join("")}
    console.log(`${text}`)
}


function choose(msg) {
    const choices = msg.body.split('\n')
    const randIndex = 1 + Math.floor(Math.random() * (choices.length-1));
    finalChoice = choices[randIndex]
    msg.reply(finalChoice)
}


async function messageFromBoss(msg) {
    var contact = await msg.getContact();
    if (contact.id._serialized.includes("565525150")) {
        return true ;
    }else if (contact.id._serialized.includes("531372944")){
        return true
    } else {
        return false ;
    }
}

async function sendMediaFileToMSG(msg, fileName) {
    const media = MessageMedia.fromFilePath(`./media/${fileName}`)
    var chat = await msg.getChat();
    if (msg.hasQuotedMsg) {
        const qm = await msg.getQuotedMessage()
        qm.reply(media, chat.id._serialized)
    } else {
        msg.reply(media, chat.id._serialized)
    }
}

async function msgIsVote(msg) {
    if (msg.body.length == 1 && letters.includes(msg.body.toUpperCase())) {
        if (msg.hasQuotedMsg) {
            const qm = await msg.getQuotedMessage()
            if (qm.body.includes("🗳 GROUP VOTE 🗳")) {
                return true
            }
        }
    }

    return false
}

function randomLine(s) {
    const items = s.split("/n") ;
    items.shift()
    let ran = Math.floor((Math.random() * items.length)) ;

    return items[ran] ;
}

function doMath(s) {
    const splitted = s.split("\n") ;
    const eq = splitted[1] ;
    const res = eval(eq) ;
    return res.toString() ;
}


// -MARK: Votes Functions

let options = {} ;
let votes = [] ;
let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "L", "M", "N", "O", "P"] ;

function calculateVotesAndCreatMessage() {
    const result = {} ;
    const optionsLength = Object.keys(options).length
    for (let i = 0; i < optionsLength; i++) {
        const count = countVote(letters[i]) ;
        const percent = ((count / votes.length) * 100).toFixed(2)
        result[letters[i]] = percent ;
        console.log(result)
    }
    
    let resultMessage = `🗳 VOTE RESULT 🗳 ` ;

    const resutlLength = Object.keys(result).length

    for (let i = 0; i < resutlLength; i++) {
        let option = `\n\n-${options[letters[i]]}: %${result[letters[i]]} ` ;
        resultMessage += option
    }

    return resultMessage ;
}

function countVote(vote) {
    var count = 0;
    for(let i = 0; i < votes.length; i++){
        if(votes[i] === vote) {
            count += 1;
        }
    }
    console.log(count)
    return count ;
}

function creatVote(voteCommand) {
    votes = [] ;
    options = {} ;
    const items = voteCommand.split("\n") ;
    items.shift() ;

    for (let i = 0; i < items.length; i++) {
        options[letters[i]] = items[i]
        console.log(options)
    }

}


function creatVoteMessage() {
    let voteMessage = `🗳 GROUP VOTE 🗳` ;
    const optionsLength = Object.keys(options).length
    for (let i = 0; i < optionsLength; i++) {
        let option = `\n\nReply with ${letters[i]} to vote for: \n-${options[letters[i]]}`
        voteMessage += option
    }

    voteMessage += "\n\nsend $endVote to end vote and send results" ;
    return voteMessage
}


// -MARK: Social Media Functions

function getInstaShortcode(url) {
    const items = url.split("/")
    for (let i = 0; i < items.length; i++) {
        if (items[i].length == 11) {
            return items[i] ;
        }
    }
    return -1 ;
}

async function writeShortcode(msg) {
    let url = ""

    if (msg.hasQuotedMsg) {
        const qm = await msg.getQuotedMessage()
        url = msg.body.startsWith("$insta") ? getInstaShortcode(qm.body) : qm.body
    } else {
        const splitted = msg.body.split("\n") ;
        url = msg.body.startsWith("$insta") ? getInstaShortcode(splitted[1]) : splitted[1] ;
    }

    fs.writeFile(`shortcode.txt`, url, function(err) {
        if (err) {
            return -1 ;
        } else {
            return 1 ;
        }
    });
}

async function sendInstaVidos(msg) {
    let filesPaths = [] ;
    fs.readdir("./media/insta", function (err, files) {
        if (err) {
            msg.reply("عذرا حدث خطا ما")
        } else {
    
            files.forEach(function (file, index) {
                filesPaths.push(file) ;
            });

            for (let f of filesPaths) {
                const media = MessageMedia.fromFilePath(`./media/insta/${f}`)
                msg.reply(media) ;
            }
        }
    });
}

async function startSpam(msg, num, text) {
    
    for (let i = 0; i < num; i++) {
        var chat = await msg.getChat()
        var id = chat.id._serialized
        client.sendMessage(id, text);
        }
    }
    


function randomMeme(msg) {

    const options = {
        method: 'GET',
        url: 'https://random-stuff-api.p.rapidapi.com/image/dankmemes',
        headers: {
          'x-api-key': "9HXmSweBcXt2",
          'x-rapidapi-key': '768fea5b8dmsh0a5e52ef9cad9b9p136ac9jsna51d4e5a32b8',
          'x-rapidapi-host': 'random-stuff-api.p.rapidapi.com',
          useQueryString: true
        }
      };
      
      request(options, function (error, response, body) {
            if (error) throw new Error(error);
            const json = JSON.parse(body)

            let extenstion = json[0].split(".")
            extenstion = extenstion[extenstion.length - 1]

        //   const file = fs.createWriteStream()
            const stream = request(json[0]).pipe(fs.createWriteStream(`meme.${extenstion}`))
            stream.on('finish', function () {
                const media = MessageMedia.fromFilePath(`meme.${extenstion}`)
                msg.reply(media)
             });
            
      });

}


async function saucenaoAPI(msg) {

    // const sagiri = require('sagiri'); 
    const apiKey = "b94b2c183e71903683209c37356cb60b7fa06739"

    const saucenao = sagiri(apiKey);

    const qm = await msg.getQuotedMessage()
    const media = await qm.downloadMedia();
    
    
    const chat = await msg.getChat()

    fs.writeFile("anime.jpeg", media.data, "base64", async function(err) {
        if (err) {console.log(err)}

        else {
        const chat = await msg.getChat()
        const imageFileStream = fs.createReadStream("anime.jpeg")

        const result = await saucenao(imageFileStream)


        const first = result[0]
        const raw = first["raw"]
        const data = raw["data"]

        const similarity = raw["similarity"]
        const imageURL = first["thumbnail"]
        const source = data["ext_urls"]
        const anime = data["source"]
        const episode = data["part"]
        const time = data["est_time"]
        const title = data["title"]
        const authorName = data["author_name"]
        const authorURL = data["author_url"]
        

        const stream = request(imageURL).pipe(fs.createWriteStream(`anime.jpeg`))
        stream.on("finish", function() {
            let info = ``

            if (source) {
                info += `source: ${source} \n`
            }
            if (anime) {
                info += `anime: ${anime} \n`
            } 
            if (episode) {
                info += `episode: ${episode} \n`
            }
            if (time) {
                info += `time in episode: ${time.split("/")[0]} \n`
            }
            if (title != undefined) {
                info += `title: ${title} \n`
            }
            if (authorName) {
                info += `author name: ${authorName} \n`
            }
            if (authorURL) {
                info += `author url: ${authorURL} \n`
            }


            const newMedia = MessageMedia.fromFilePath("anime.jpeg")

            
            client.sendMessage(chat.id._serialized, newMedia, {caption : info})
        })

        }
})
            

}


    





client.initialize();


