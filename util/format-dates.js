class dateHelper {
    static formatToMinutes(secs) {
        const pad = num => {
            return ('0' + num).slice(-2);
        };
        let minutes = Math.floor(secs / 60);
        secs = secs % 60;
        minutes = minutes % 60;
        console.log(minutes);
        return `${minutes}:${pad(secs)}`;
    }
}

module.exports = dateHelper;
