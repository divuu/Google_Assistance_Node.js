
const Response = {
    getBasicResponse: (isUserResponseExpected, textToSpeech) => {
        return {
            payload: {
                google: {
                    expectUserResponse: `${isUserResponseExpected}`,
                    richResponse: {
                        items: [
                            {
                                simpleResponse: {
                                    textToSpeech: `${textToSpeech}`
                                }
                            }
                        ]
                    }
                }
            }
        }
    },
    getRichResponse: (isUserResponseExpected, textToSpeech, carouselItems) => {
        return {
            source: "example.com",
            payload: {
                google: {
                    expectUserResponse: isUserResponseExpected,
                    richResponse: {
                        items: [
                            {
                                simpleResponse: {
                                    textToSpeech: textToSpeech
                                }
                            },
                            {
                                carouselBrowse: {
                                    items: [...carouselItems]
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
}

module.exports = Response;