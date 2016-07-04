import test from 'ava';
import { calamarMessageFormat } from 'lib/calamar'; // eslint-disable-line

test('Translate Facebook Messenger messaging item to Calamar message format', t => {
    const text = 'hello';
    const timestamp = 1465304850533;
    const mid = 'mid.1465304850526:21ca65ee5092344595';
    const senderId = '10154319360809636';
    const recipientId = '721458654659118';
    const platformName = 'facebookMessenger';
    const facebookMessagingItem = {
        sender: {
            id: senderId
        },
        recipient: {
            id: recipientId
        },
        timestamp,
        message: {
            mid,
            seq: 111,
            text
        }
    };
    const calamarMessage = {
        text,
        timestamp,
        messageId: mid,
        senderId,
        recipientId,
        chatId: senderId,
        platform: platformName
    };
    t.deepEqual(calamarMessageFormat(facebookMessagingItem), calamarMessage);
});
test('Translate Telegram update message object to Calamar message format', t => {
    const text = 'hello';
    const timestamp = 1465310372;
    const messageId = 1942;
    const senderId = 19555963;
    const chatId = 19555963;
    const platformName = 'telegram';
    const telegramMessageUpdate = {
        update_id: 404569936,
        message: {
            message_id: messageId,
            from: {
                id: senderId,
                first_name: 'Fabricio',
                last_name: 'Zuardi',
                username: 'fczuardi'
            },
            chat: {
                id: chatId,
                first_name: 'Fabricio',
                last_name: 'Zuardi',
                username: 'fczuardi',
                type: 'private'
            },
            date: timestamp,
            text
        }
    };
    const calamarMessage = {
        text,
        timestamp: timestamp * 1000,
        messageId,
        senderId,
        chatId,
        platform: platformName
    };
    t.deepEqual(calamarMessageFormat(telegramMessageUpdate), calamarMessage);
});
