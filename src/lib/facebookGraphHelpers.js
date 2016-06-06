import request from 'request-promise';

const apiURL = 'https://graph.facebook.com/v2.6/';

// ## pageSubscribe(pageAccessToken)
// Subscribe your facebook app/bot to a facebook page's webhook updates.
// You need to call this for each page you want to receive messages from.
//
// ### Parameters
// **pageAccessToken** - _string_ - The [token][pageAccessToken] for the page
// [pageAccessToken]: https://developers.facebook.com/docs/messenger-platform/implementation#page_access_token
const pageSubscribe = pageAccessToken => {
    const requestOptions = {
        uri: `${apiURL}me/subscribed_apps`,
        method: 'POST',
        qs: {
            access_token: pageAccessToken
        }
    };
    return request(requestOptions);
};


// ## sendTextMessage(message, pageAccessToken)
// Send a text message with yout Facebook Messenger app/bot.
//
// ### Parameters
// - **message** - _Object_ - Message [descrition][textMessage]
//   - **userId** - _number_ - recipient's messenger ID number
//   - **text** - _string_ - message's text to be sent.
// **pageAccessToken** - _string_ - The [token][pageAccessToken] for the page
// [textMessage]: https://developers.facebook.com/docs/messenger-platform/send-api-reference#guidelines
// [pageAccessToken]: https://developers.facebook.com/docs/messenger-platform/implementation#page_access_token
const sendTextMessage = (message, pageAccessToken) => {
    const requestOptions = {
        uri: `${apiURL}me/messages?access_token=${pageAccessToken}`,
        method: 'POST',
        body: {
            recipient: {
                id: message.userId
            },
            message: {
                text: message.text
            }
        },
        json: true
    };
    return request(requestOptions);
};

export { pageSubscribe, sendTextMessage };
