//The Calender
$(document).ready(function(){
  /* initialize the calendar
   -----------------------------------------------------------------*/
  //Date for the calendar events (dummy data)
  var date = new Date();
  var d = date.getDate(),
      m = date.getMonth(),
      y = date.getFullYear();
  $('#calendar').fullCalendar({
    titleFormat: {
            month: 'Y年M月',                             // 2013年9月
            week: "yyyy年M月d日", // 2013年9月7日 ～ 13日
            day: "yyyy年M月d日'('ddd')'"                  // 2013年9月7日(火)
    },
    // 月名称
    monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    // 月略称
    monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    // 曜日名称
    dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
    // 曜日略称
    dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
    header: {
      //left: 'prev,next today',
      left: 'prev,next',
      center: 'title',
      //right: 'month,agendaWeek,agendaDay'
      right: 'today'
    },
    buttonText: {
      today: '今日',
      month: 'month',
      week: 'week',
      day: 'day'
    },
    //Random default events
    events: [
      {
        title: '連続使用',
        start: new Date(y, m, 1),
        allDay: true,//will not show like "12a"
        //backgroundColor: "#f56954", //red
        //borderColor: "#f56954" //red
        backgroundColor: "#f39c12", //yellow
        borderColor: "#f39c12" //yellow
      },
      {
        title: '連続使用',
        start: new Date(y, m, 3),
        end: new Date(y, m, 7),
        allDay: true,//will not show like "12a"
        backgroundColor: "#f39c12", //yellow
        borderColor: "#f39c12" //yellow
      },
      {
        title: '連続使用',
        start: new Date(y, m, 9),
        end: new Date(y, m, 12),
        allDay: true,//will not show like "12a"
        backgroundColor: "#f39c12", //yellow
        borderColor: "#f39c12" //yellow
      },
      {
        title: '連続使用',
        start: new Date(y, m, d - 5),
        end: new Date(y, m, d +2),
        allDay: true,//will not show like "12a"
        backgroundColor: "#f39c12", //yellow
        borderColor: "#f39c12" //yellow
      },
      {
        title: '記録達成！',
        //start: new Date(y, m, d, 10, 30),
        start: new Date(y, m, d),
        //allDay: false,
        allDay: true,//will not show like "12a"
        //backgroundColor: "#0073b7", //Blue
        //borderColor: "#0073b7" //Blue
        backgroundColor: "#00a65a", //Success (green)
        borderColor: "#00a65a" //Success (green)
      },
      {
        title: 'クーポンゲット！',
        start: new Date(y, m, d, 12, 0),
        end: new Date(y, m, d, 14, 0),
        allDay: true,
        url: 'http://google.com/',
        backgroundColor: "#00c0ef", //Info (aqua)
        borderColor: "#00c0ef" //Info (aqua)
      },
      /*
      {
        title: 'Birthday Party',
        start: new Date(y, m, d + 1, 19, 0),
        end: new Date(y, m, d + 1, 22, 30),
        allDay: false,
        backgroundColor: "#00a65a", //Success (green)
        borderColor: "#00a65a" //Success (green)
      },
      {
        title: 'Click for Google',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        url: 'http://google.com/',
        backgroundColor: "#3c8dbc", //Primary (light-blue)
        borderColor: "#3c8dbc" //Primary (light-blue)
      }*/
    ],
    editable: false,// this allows things in calendar can be dropped !!!
    droppable: false, // this allows things to be dropped onto the calendar !!!
    drop: function (date, allDay) { // this function is called when something is dropped

      // retrieve the dropped element's stored Event Object
      var originalEventObject = $(this).data('eventObject');

      // we need to copy it, so that multiple events don't have a reference to the same object
      var copiedEventObject = $.extend({}, originalEventObject);

      // assign it the date that was reported
      copiedEventObject.start = date;
      copiedEventObject.allDay = allDay;
      copiedEventObject.backgroundColor = $(this).css("background-color");
      copiedEventObject.borderColor = $(this).css("border-color");

      // render the event on the calendar
      // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
      $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

      // is the "remove after drop" checkbox checked?
      if ($('#drop-remove').is(':checked')) {
        // if so, remove the element from the "Draggable Events" list
        $(this).remove();
      }

    }
  });

  /* ADDING EVENTS */
  var currColor = "#3c8dbc"; //Red by default
  //Color chooser button
  var colorChooser = $("#color-chooser-btn");
  $("#color-chooser > li > a").click(function (e) {
    e.preventDefault();
    //Save color
    currColor = $(this).css("color");
    //Add color effect to button
    $('#add-new-event').css({"background-color": currColor, "border-color": currColor});
  });
  $("#add-new-event").click(function (e) {
    e.preventDefault();
    //Get value and make sure it is not null
    var val = $("#new-event").val();
    if (val.length == 0) {
      return;
    }

    //Create events
    var event = $("<div />");
    event.css({"background-color": currColor, "border-color": currColor, "color": "#fff"}).addClass("external-event");
    event.html(val);
    $('#external-events').prepend(event);

    //Add draggable funtionality
    ini_events(event);

    //Remove event from text input
    $("#new-event").val("");
  });
})
