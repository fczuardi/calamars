import { FacebookMessengerBot } from './src/lib/facebook'; // eslint-disable-line

const {
    PORT,
    FB_CALLBACK_PATH
} = process.env;

const listeners = {
    onUpdate: update => {
        console.log('Update:', update.update);
    }
};
const bot = new FacebookMessengerBot({ listeners });
bot.start().then(() => {
    console.log(`Bot listening on localhost:${PORT}${FB_CALLBACK_PATH}`);
    console.log('Test of setting welcome message');
    bot.setWelcomeMessage('Hello World')
    .then(f => {
        console.log(f);
    });
});
