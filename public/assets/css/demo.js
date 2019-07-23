import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "map": {
        "position": "relative",
        "width": "100%",
        "height": "calc(100% - 60px)",
        "marginTop": 70
    },
    "places-buttons btn": {
        "marginBottom": 30
    },
    "space-70": {
        "height": 70,
        "display": "block"
    },
    "tim-row": {
        "marginBottom": 20,
        "paddingTop": 50
    },
    "tim-typo": {
        "paddingLeft": "25%",
        "marginBottom": 40,
        "position": "relative"
    },
    "tim-typo tim-note": {
        "bottom": 10,
        "color": "#c0c1c2",
        "display": "block",
        "fontWeight": "400",
        "fontSize": 13,
        "lineHeight": 13,
        "left": 0,
        "marginLeft": 20,
        "position": "absolute",
        "width": 260
    },
    "tim-row h3": {
        "marginTop": 0
    },
    "third": {
        "width": "33.333333%"
    },
    "movingTabS": {
        "width": 178,
        "transform": "translate3d(-8px, 0px, 0px)",
        "transition": "transform 0s"
    },
    "tableImageDiv img": {
        "width": 200
    },
    "tableImage": {
        "width": 200
    },
    "fireadminbar": {
        "marginTop": -100,
        "marginLeft": 40
    },
    "breadcrumbSeparator": {
        "marginLeft": 20
    }
});