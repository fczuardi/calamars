// constants
const PLATFORM_FACEBOOK_MESSENGER = 'facebookMessenger';
const PLATFORM_TELEGRAM = 'telegram';

// Test to see if an update object is a
// facebook messenger ["messaging" item][webhookUpdatePayloadFormat]
//
// [webhookUpdatePayloadFormat]: https://developers.facebook.com/docs/messenger-platform/implementation#receive_message
const isFacebookMessengerMessagingItem = item =>
    (item && item.timestamp && item.sender && item.recipient);

// Test to see if an update object is a
// [telegram update object][telegramUpdateFormat]
//
// [telegramUpdateFormat]: https://core.telegram.org/bots/api#update
const isTelegramUpdate = update => (update && update.update_id);

// ## calamarMessageFormat(update)
// Translate message updates from Telegram or Facebook to a generic
// message update object format containing commonly used attributes.
const calamarMessageFormat = update => {
    if (isFacebookMessengerMessagingItem(update)) {
        const { message, timestamp, sender, recipient } = update;
        const { mid = null, text = null, is_echo = false } = message;
        return {
            text,
            timestamp,
            messageId: mid,
            isEcho: is_echo,
            senderId: sender.id,
            recipientId: recipient.id,
            chatId: sender.id,
            platform: PLATFORM_FACEBOOK_MESSENGER
        };
    }
    if (isTelegramUpdate(update)) {
        const { message_id, text, date, from, chat } = update.message;
        const timestamp = date.toString().length < 13 ? date * 1000 : date;
        return {
            text,
            timestamp,
            messageId: message_id,
            senderId: from.id,
            chatId: chat.id,
            platform: PLATFORM_TELEGRAM
        };
    }
    return null;
};

export { calamarMessageFormat };
