import moment from "moment"

export const dateFormate = (date) =>
    moment(date).format("MMM Do YYYY, h:mm:ss a");