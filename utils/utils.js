module.exports = {
  getCarouselItemsArray: function (url) {
    return [
      {
        title: "View In Map",
        openUrlAction: {
          url: url
        },
        description: "View the live location in Google Map",
        image: {
          url:
            "https://res.cloudinary.com/techmky/image/upload/v1566890723/google_map2_mnl6ns.png",
          accessibilityText: "Image alternate text"
        }
      },
      {
        title: "Share Bus Location",
        openUrlAction: {
          url: `https://api.whatsapp.com/send?text=Vehicle Live Location\n${url}`
        },
        description: "Share Bus Live location on WhatsApp",
        image: {
          url:
            "https://res.cloudinary.com/techmky/image/upload/v1566899238/whatsapp_t9tj13.png",
          accessibilityText: "Image alternate text"
        }
      },
      {
        title: "Call RouteAlert",
        openUrlAction: {
          url: "https://www.google.com"
        },
        description: "Call RouteAlert Support Team For Any Help !",
        image: {
          url:
            "https://res.cloudinary.com/techmky/image/upload/v1566906021/call_resized_isstvt.png",
          accessibilityText: "Image alternate text"
        }
      }
    ];
  }
};
