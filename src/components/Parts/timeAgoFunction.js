function TimeSince(timeStamp) {
    if (!(timeStamp instanceof Date)) {
      timeStamp = new Date(timeStamp);
    }

    if (isNaN(timeStamp.getDate())) {
      return "Fecha no válida";
    }

    var now = new Date(),
      secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;

    var formatDate = function(date, format, utc) {
      var MMMM = ["\x00", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      var MMM = ["\x01", "Ener", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Agost", "Sept", "Oct", "Nov", "Dic"];
      var dddd = ["\x02", "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      var ddd = ["\x03", "Dom", "Lun", "Mart", "Miérc", "Jue", "Vie", "Sáb"];

      function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
      }

      var y = utc ? date.getUTCFullYear() : date.getFullYear();
      format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
      format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
      format = format.replace(/(^|[^\\])y/g, "$1" + y);

      var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
      format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
      format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
      format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
      format = format.replace(/(^|[^\\])M/g, "$1" + M);

      var d = utc ? date.getUTCDate() : date.getDate();
      format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
      format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
      format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
      format = format.replace(/(^|[^\\])d/g, "$1" + d);

      var H = utc ? date.getUTCHours() : date.getHours();
      format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
      format = format.replace(/(^|[^\\])H/g, "$1" + H);

      var h = H > 12 ? H - 12 : H === 0 ? 12 : H;
      format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
      format = format.replace(/(^|[^\\])h/g, "$1" + h);

      var m = utc ? date.getUTCMinutes() : date.getMinutes();
      format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
      format = format.replace(/(^|[^\\])m/g, "$1" + m);

      var s = utc ? date.getUTCSeconds() : date.getSeconds();
      format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
      format = format.replace(/(^|[^\\])s/g, "$1" + s);

      var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
      format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
      f = Math.round(f / 10);
      format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
      f = Math.round(f / 10);
      format = format.replace(/(^|[^\\])f/g, "$1" + f);

      var T = H < 12 ? "AM" : "PM";
      format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
      format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

      var t = T.toLowerCase();
      format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
      format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

      var tz = -date.getTimezoneOffset();
      var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
      if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
      }
      format = format.replace(/(^|[^\\])K/g, "$1" + K);

      var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
      format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
      format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

      format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
      format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

      format = format.replace(/\\(.)/g, "$1");

      return format;
    };

    if(secondsPast < 0){ // Future date
      return timeStamp;
    }
    if(secondsPast < 60){ // Less than a minute
      return parseInt(secondsPast) + 'secs';
    }
    if(secondsPast < 3600){ // Less than an hour
      return parseInt(secondsPast/60) + 'mins';
    }
    if(secondsPast <= 86400){ // Less than a day
      return parseInt(secondsPast/3600) + 'hrs';
    }
    if(secondsPast <= 172800){ // Less than 2 days
      return ', ' + formatDate(timeStamp, "h:mmtt");
    }
    if(secondsPast > 172800){ // After two days
      var timeString;

      if(secondsPast <= 604800)
        timeString = formatDate(timeStamp, "dddd") + ", " + formatDate(timeStamp, "h:mmtt") // with in a week
      else if(now.getFullYear() > timeStamp.getFullYear())
        timeString = formatDate(timeStamp, "MMMM d, yyyy") // a year ago
      else if(now.getMonth() > timeStamp.getMonth())
        timeString = formatDate(timeStamp, "MMMM d") // months ago
      else
        timeString = formatDate(timeStamp, "MMMM d") + ", " + formatDate(timeStamp, "h:mmtt") // with in a month

      return timeString;
    }
  }
  export {
    TimeSince
  }