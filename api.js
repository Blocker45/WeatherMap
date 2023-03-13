const sqlite3 = require("sqlite3").verbose();
const path = require("path");
function WeatherAPI() {
    var db = new sqlite3.Database(path.join(__dirname, "./weather.db"));

    this.GetDataByDate = async function (cityname, date) {
        db.each("SELECT * FROM weather WHERE cityname = '" + cityname + "' AND wdate = '" + date + "'", function (err, row) {
            console.log(row);
            return row;
        }, (err, count) => {
            if (err != null)
                console.log(err);
        });
    }

    this.getDB = function () {
        return db;
    }
}

module.exports = WeatherAPI;