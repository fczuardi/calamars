import request from 'request-promise';

const apiURL = 'https://graph.facebook.com/v2.6/';

// ## pageSubscribe(pageAccessToken)
// Subscribe your facebook app/bot to a facebook page's webhook updates.
// You need to call this for each page you want to receive messages from.
//
// ### Parameters
// - **pageAccessToken** - _string_ - The [token][pageAccessToken] for the page
// [pageAccessToken]: https://developers.facebook.com/docs/messenger-platform/implementation#page_access_token
const pageSubscribe = pageAccessToken => {
    const requestOptions = {
        uri: `${apiURL}me/subscribed_apps`,
        method: 'POST',
        qs: {
            access_token: pageAccessToken
        }
    };
    return new Promise(resolve => {
        return request(requestOptions)
            .then(result => resolve(result))
            .catch(e => {
                console.error(e.message);
                return resolve(e.message);
            });
    });
};

// ## sendTextMessage(message, pageAccessToken)
// Send a text message with your Facebook Messenger app/bot.
//
// ### Parameters
// - **message** - _Object_ - Message [descrition][textMessage]
//   - **userId** - _string_ - recipient's messenger ID
//   - **text** - _string_ - message's text to be sent.
// **pageAccessToken** - _string_ - The [token][pageAccessToken] for the page
// [textMessage]: https://developers.facebook.com/docs/messenger-platform/send-api-reference#guidelines
// [pageAccessToken]: https://developers.facebook.com/docs/messenger-platform/implementation#page_access_token
const sendTextMessage = (message, pageAccessToken) => {
    const { attachment, text } = message;
    const croppedText = text
        ? text.substring(0, 319) + (message.text.length > 320 ? '…' : '')
        : null;
    const requestOptions = {
        uri: `${apiURL}me/messages`,
        qs: {
            access_token: pageAccessToken
        },
        method: 'POST',
        body: {
            recipient: {
                id: message.userId
            },
            message: {
                text: croppedText,
                attachment
            }
        },
        json: true
    };
    return request(requestOptions);
};


// ## senderActions(status, userId, pageAccessToken)
// Set typing indicators or send read receipts to your Facebook Messenger app/bot.
//
// ### Parameters
// - **status** - _string_ - 'mark_seen' || 'typing_on' || 'typing_off'
// - **userId** - _string_ - The user fbid to send the status
// **pageAccessToken** - _string_ - The [token][pageAccessToken] for the page
// [senderActions]: https://developers.facebook.com/docs/messenger-platform/send-api-reference/sender-actions
// [pageAccessToken]: https://developers.facebook.com/docs/messenger-platform/send-api-reference/sender-actions
const senderActions = (status, userId, pageAccessToken) => {
    const requestOptions = {
        uri: `${apiURL}me/messages`,
        qs: {
            access_token: pageAccessToken
        },
        method: 'POST',
        body: {
            recipient: {
                id: userId
            },
            sender_action: status
        },
        json: true
    };
    return request(requestOptions);
};


// ## quickRepliesText(text, attachment, pageAccessToken)
// Send a quick replies message with your Facebook Messenger app/bot.
//
// ### Parameters
//   - **attachment** - _Object_ - Array of objects including the quick replies options
//   - **userId** - _string_ - recipient's messenger ID
//   - **text** - _string_ - message's text to be sent.
// **pageAccessToken** - _string_ - The [token][pageAccessToken] for the page
// [quickReplies]: https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies
// [pageAccessToken]: https://developers.facebook.com/docs/messenger-platform/implementation#page_access_token
const quickRepliesText = (text, attachment, userId, pageAccessToken) => {
    const requestOptions = {
        uri: `${apiURL}me/messages`,
        qs: {
            access_token: pageAccessToken
        },
        method: 'POST',
        body: {
            recipient: {
                id: userId
            },
            message: {
                text,
                quick_replies: attachment
            }
        },
        json: true
    };
    return request(requestOptions);
};


// ## userInfo(userId, pageAccessToken)
// Retrieves user information, first name, last name, profile pic, locale,
// time zone and gender, from Facebook's [User Profile API][userprofileapi]
//
// ### Parameters
// - **userId** - _string_ - The user fbid to retriev metadata from
// - **pageAccessToken** - _string_ - A page access token that has permissions to
// get information from the userId
//
// [userprofileapi]: https://developers.facebook.com/docs/messenger-platform/send-api-reference#user_profile_request
const userInfo = (userId, pageAccessToken) => new Promise(resolve => request({
    uri: `${apiURL}${userId}`,
    qs: {
        fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
        access_token: pageAccessToken
    }
}).then(body =>
    resolve(JSON.parse(body))
));

// ## threadSettings(options, pageId, pageAccessToken)
// Generic method for the various thread settings that can be set, such as
// Greeting Text, Get Start Button or Persistent Menu
//
// A helper function to make graph api calls to
// [thread_settings endpoint][thread_settings_reference].
//
// [thread_settings_reference]: https://developers.facebook.com/docs/messenger-platform/thread-settings
const threadSettings = ({ type, state, text, cta }, pageId, pageAccessToken) => {
    const requestOptions = {
        uri: `${apiURL}${pageId}/thread_settings`,
        qs: {
            access_token: pageAccessToken
        },
        method: 'POST',
        json: true
    };
    if (type === 'greeting') {
        return request({
            ...requestOptions,
            body: {
                setting_type: type,
                greeting: {
                    text
                }
            }
        });
    }
    return request({
        ...requestOptions,
        body: {
            thread_state: state,
            setting_type: type,
            call_to_actions: cta
        }
    });
};

// ## setWelcomeMessage(message, pageId, pageAccessToken)
// Change the Welcome Message for the messenger of a page.
// A helper function to make graph api calls to set new thread state message
// [setting][welcome_message_configuration].
//
// [welcome_message_configuration]: https://developers.facebook.com/docs/messenger-platform/send-api-reference#welcome_message_configuration
const setWelcomeMessage = (message, pageId, pageAccessToken) => threadSettings(
    {
        type: 'call_to_actions',
        state: 'new_thread',
        cta: [{
            payload: JSON.stringify({
                type: 'legacy-welcome',
                message
            })
        }]
    },
    pageId,
    pageAccessToken
);

export {
    pageSubscribe,
    sendTextMessage,
    userInfo,
    setWelcomeMessage,
    threadSettings,
    senderActions,
    quickRepliesText
};
