const { ipcRenderer } = require('electron');

var wdata = {};
var calendar_month = 1;
var calendar_day = 1;
var month_days = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var month_names = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
window.onload = function () {
    document.getElementById("closebtn").onclick = function () {
        ipcRenderer.send('close');
    }

    init_map();

    var btn_dashboard = document.getElementById("btn_dashboard");
    var btn_map = document.getElementById("btn_map");
    var btn_collections = document.getElementById("btn_collections");
    var btn_about = document.getElementById("btn_about");
    var dashboard = document.getElementById("dashboard");
    var map = document.getElementById("mapcontainer");
    var collections = document.getElementById("collections");
    var about = document.getElementById("about");

    btn_dashboard.onclick = function () {
        dashboard.style.display = "block";
        map.style.display = "none";
        collections.style.display = "none";
        about.style.display = "none";

        btn_dashboard.className = "tab_on";
        btn_about.className = "tab";
        btn_collections.className = "tab";
        btn_map.className = "tab";
    }

    btn_about.onclick = function () {
        dashboard.style.display = "none";
        map.style.display = "none";
        collections.style.display = "none";
        about.style.display = "block";

        btn_dashboard.className = "tab";
        btn_about.className = "tab_on";
        btn_collections.className = "tab";
        btn_map.className = "tab";
    }

    btn_map.onclick = function () {
        dashboard.style.display = "none";
        map.style.display = "block";
        collections.style.display = "none";
        about.style.display = "none";

        btn_dashboard.className = "tab";
        btn_about.className = "tab";
        btn_collections.className = "tab";
        btn_map.className = "tab_on";
    }

    btn_collections.onclick = function () {
        dashboard.style.display = "none";
        map.style.display = "none";
        collections.style.display = "block";
        about.style.display = "none";

        btn_dashboard.className = "tab";
        btn_about.className = "tab";
        btn_collections.className = "tab_on";
        btn_map.className = "tab";
    }

    document.getElementById('search_btn').onclick = function () {
        btn_dashboard.onclick();
        ipcRenderer.send('GetData', document.getElementById("search_text").value);
    }

    ipcRenderer.on('ShowDetail', function (event, data) {
        document.getElementById("citylist").style.display = "none";
        document.getElementById("dashboard_container").style.display = "flex";
        console.log(data);
        wdata = data;
        console.log(wdata);
        const parentDiv = document.getElementById("days");
        const childElements = parentDiv.children;
        for (const child of childElements) {
            child.removeAttribute("class");
        }
        document.getElementById("months").value = "January";
        childElements[0].setAttribute("class", "active");
        LoadGraph(1);
        ShowDetail(101);
        calendar_month = 1;
        calendar_day = 1;
        update_calendar();
    });

    document.getElementById("pre_btn").onclick = function () {
        calendar_day = 1;
        if (calendar_month == 1) calendar_month = 12;
        else calendar_month--;
        document.getElementById("months").innerHTML = month_names[calendar_month];
        update_calendar();
        LoadGraph(calendar_month);
    }

    document.getElementById("next_btn").onclick = function () {
        calendar_day = 1;
        if (calendar_month == 12) calendar_month = 1;
        else calendar_month++;
        document.getElementById("months").innerHTML = month_names[calendar_month];
        update_calendar();
        LoadGraph(calendar_month);
    }
}

function update_calendar() {
    var days = document.getElementById("days");
    days.innerHTML = "";
    for (var i = 1; i <= month_days[calendar_month]; i++) {
        days.innerHTML = days.innerHTML + "<li>" + i + "</li>\n";
    }

    const parentDiv = document.getElementById("days");
    const childElements = parentDiv.children;
    childElements[calendar_day - 1].setAttribute("class", "active");
    for (const child of childElements) {
        child.onclick = function () {
            childElements[calendar_day - 1].removeAttribute("class");
            calendar_day = parseInt(child.innerHTML);
            childElements[calendar_day - 1].setAttribute("class", "active");
            console.log("Pressed days" + child.innerHTML);
            if (document.getElementById("title_dashboard").innerHTML != "Dashboard") {
                ShowDetail(calendar_month * 100 + calendar_day);
            }
        }
    }

    ShowDetail(calendar_month*100 + calendar_day);

}

function getidx(date) {
    if (date < 200) return date - 101;
    if (date < 300) return date - 170;
    if (date < 400) return date - 241;
    if (date < 500) return date - 310;
    if (date < 600) return date - 380;
    if (date < 700) return date - 449;
    if (date < 800) return date - 519;
    if (date < 900) return date - 588;
    if (date < 1000) return date - 657;
    if (date < 1100) return date - 727;
    if (date < 1200) return date - 796;
    return date - 866;
}

function ShowDetail(date) {
    data = wdata[getidx(date)];
    console.log(data)
    document.getElementById("temp").innerHTML = " max:" + (data["maxTemp"] - 273.15).toFixed(2) + "°C<br /> min:" + (data["minTemp"] - 273.15).toFixed(2) + "°C<br /> mean:" + (data["meanTemp"] - 273.15).toFixed(2) + "°C";
    document.getElementById("clouds").innerHTML = " max:" + data["maxclouds"] + "%<br /> min:" + data["minclouds"] + "%<br /> mean:" + data["meanclouds"] + "%";
    document.getElementById("wind").innerHTML = " max:" + data["maxwind"] + "m/s<br /> min:" + data["minwind"] + "m/s<br /> mean:" + data["meanwind"] + "m/s";
    document.getElementById("pressure").innerHTML = " max:" + data["maxpressure"] + "Pa<br /> min:" + data["minpressure"] + "Pa<br /> mean:" + data["meanpressure"] + "Pa";
    document.getElementById("ppt").innerHTML = " max:" + data["maxppt"] + "mm<br /> min:" + data["minppt"] + "mm<br /> mean:" + data["meanppt"] + "mm";
    document.getElementById("humidity").innerHTML = " max:" + data["maxhumidity"] + "%<br /> min:" + data["minhumidity"] + "%<br /> mean:" + data["meanhumidity"] + "%";
    document.getElementById("title_dashboard").innerHTML = "Dashboard - " + data["cityname"];
}


function LoadGraph(month) {
    /*if(!linegraph_init) {
        init_LineGraph();
        linegraph_init = true;
        console.log("line graph init");
    }*/
    document.getElementById("LinerGraph").innerHTML = "";
    var data = [];
    var idx = 1;
    for (var i = getidx(month * 100 + 1); i < getidx((month + 1) * 100 + 1); i++) {
        data.push([idx.toString(), wdata[i]["meanTemp"] - 273.15, wdata[i]["meanclouds"], wdata[i]["meanppt"], wdata[i]["meanpressure"] / 1000, wdata[i]["meanhumidity"], wdata[i]["meanwind"]]);
        idx++;
    }

    var dataSet = anychart.data.set(data);

    // map data for the first series,
    // take x from the zero column and value from the first column
    var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });

    // map data for the second series,
    // take x from the zero column and value from the second column
    var secondSeriesData = dataSet.mapAs({ x: 0, value: 2 });

    // map data for the third series,
    // take x from the zero column and value from the third column
    var thirdSeriesData = dataSet.mapAs({ x: 0, value: 3 });

    // map data for the fourth series,
    // take x from the zero column and value from the fourth column
    var fourthSeriesData = dataSet.mapAs({ x: 0, value: 4 });
    var fifthSeriesData = dataSet.mapAs({ x: 0, value: 5 });
    var sixthSeriesData = dataSet.mapAs({ x: 0, value: 6 });
    var chart = anychart.line();
    chart.animation(true);
    chart.title('Monthly Weather Trend');
    chart.crosshair().enabled(true).yLabel(false).yStroke(null);

    // create the first series with the mapped data
    var firstSeries = chart.line(firstSeriesData);
    firstSeries
        .name('Temperature')
        .stroke('3 #f49595')
        .tooltip()
        .format('Temperature : {%value}K');

    // create the second series with the mapped data
    var secondSeries = chart.line(secondSeriesData);
    secondSeries
        .name('Clouds')
        .stroke('3 #f9eb97')
        .tooltip()
        .format('Clouds : {%value}%');

    // create the third series with the mapped data
    var thirdSeries = chart.line(thirdSeriesData);
    thirdSeries
        .name('Precipitation')
        .stroke('3 #a8d9f6')
        .tooltip()
        .format('Precipitation : {%value}mm');

    // create the fourth series with the mapped data
    var fourthSeries = chart.line(fourthSeriesData);
    fourthSeries
        .name('Pressure')
        .stroke('3 #e2bbfd')
        .tooltip()
        .format('Pressure : {%value}');


    // create the first series with the mapped data
    var fifthSeries = chart.line(fifthSeriesData);
    fifthSeries
        .name('Humidity')
        .stroke('3 #11ff11')
        .tooltip()
        .format('Humidity : {%value}%');

    // create the first series with the mapped data
    var sixthSeries = chart.line(sixthSeriesData);
    sixthSeries
        .name('Wind')
        .stroke('3 #222')
        .tooltip()
        .format('Wind : {%value}%');

    // turn the legend on
    chart.legend().enabled(true);

    // set the container id for the line chart
    chart.container('LinerGraph');
    chart.width(330);
    chart.height(340);

    // draw the line chart
    chart.draw();
}

function init_map() {
    anychart.onDocumentReady(function () {
        // create the dataset of points that are defined by latitude and longitude values
        var data = citylistarray;
        console.log(data);

        document.getElementById("mapcontainer").style.display = "block";

        var map = anychart.map();

        // Sets geodata using https://cdn.anychart.com/geodata/latest/custom/world/world.js
        map.geoData('anychart.maps.world');

        // Sets Chart Title
        map
            .title()
            .enabled(true)
            .text('Cities With Weather Data')
            .padding([0, 0, 20, 0]);

        map.interactivity().selectionMode('none');

        // Sets bubble max size settings
        map.minBubbleSize('0.5%').maxBubbleSize('1.5%');
        var series = map.marker(data);
        map.listen('dblclick', clickcity);
        function clickcity(e) {
            document.getElementById("btn_dashboard").onclick();
            ipcRenderer.send('GetData', citylistarray[e.pointIndex]["name"]);
        }

        map.interactivity().zoomOnMouseWheel(true);

        /*map
            .tooltip()
            .background('#3A4750')
            .enabled(true)
            .fill('#00ADB5')
            .stroke('#c1c1c1')
            .corners(3)
            .cornerType('round');*/

        // create zoom controls
        map.background().fill("#3A4750");
        var zoomController = anychart.ui.zoom();
        zoomController.render(map);

        // Sets container id for the chart
        map.container('mapcontainer');
        // Initiates chart drawing
        map.draw();
        document.getElementById("mapcontainer").style.display = "none";
    });
}