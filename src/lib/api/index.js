exports.getThatThing = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                messages: [
                    {
                        payload: {
                            voice: 'Hello World!',
                        },
                        timeSent: 1551120708
                    },
                    {
                        payload: {
                            text: 'Hello Space',
                        },
                        timeSent: 1551120643
                    }
                ],
                quickReplies: [
                    {
                        data: 'Do it!',
                    }
                ]
            })
        }, 500);
    });
}